import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const body = await req.json();
  const rawItems: { id: string; quantity: number }[] = Array.isArray(body.items) ? body.items : [];

  if (rawItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Merge duplicates and sanitise quantities
  const quantities = new Map<string, number>();
  for (const item of rawItems) {
    const qty = Math.floor(Number(item.quantity));
    if (!item.id || !Number.isFinite(qty) || qty < 1 || qty > 20) {
      return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
    }
    quantities.set(item.id, (quantities.get(item.id) || 0) + qty);
  }

  // Prices come from the database, never from the browser
  const admin = createAdminClient();
  const { data: products } = await admin
    .from("products")
    .select("id, price")
    .in("id", Array.from(quantities.keys()))
    .eq("status", "published");

  if (!products || products.length !== quantities.size) {
    return NextResponse.json({ error: "Some items in your cart are no longer available" }, { status: 400 });
  }

  const lines = products.map((p) => ({
    product_id: p.id,
    unit_price: Number(p.price),
    quantity: quantities.get(p.id)!,
  }));
  const total = lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0);

  // Affiliate attribution (self-referral blocked)
  const cookieStore = await cookies();
  const refCode = cookieStore.get("ref_code")?.value;
  let affiliateId: string | null = null;

  if (refCode) {
    const { data: link } = await admin
      .from("affiliate_links")
      .select("affiliate_id, affiliates(user_id, status)")
      .eq("code", refCode)
      .single();

    const aff = link?.affiliates as any;
    if (link && aff?.status === "active" && aff?.user_id !== user.id) {
      affiliateId = link.affiliate_id;
    }
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      customer_id: user.id,
      affiliate_id: affiliateId,
      total_amount: total,
      payment_status: "pending",
      payment_method: "card",
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  await admin.from("order_items").insert(lines.map((l) => ({ ...l, order_id: order.id })));

  const flwRes = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: order.id,
      amount: total,
      currency: "NGN",
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
      customer: { email: user.email },
      customizations: { title: "Digitech Nexus", description: "Order payment" },
    }),
  });

  const flwData = await flwRes.json();
  if (flwData.status !== "success") {
    return NextResponse.json({ error: flwData.message || "Payment init failed" }, { status: 500 });
  }

  return NextResponse.json({ authorization_url: flwData.data.link });
}