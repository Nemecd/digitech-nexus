import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { items, email } = await req.json();
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const total = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ customer_id: user.id, total_amount: total, payment_status: "pending", payment_method: "card" })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  await supabase.from("order_items").insert(
    items.map((i: any) => ({ order_id: order.id, product_id: i.id, unit_price: i.price, quantity: i.quantity }))
  );

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
      customer: { email },
      customizations: { title: "Digitech Nexus", description: "Order payment" },
    }),
  });

  const flwData = await flwRes.json();
  if (flwData.status !== "success") {
    return NextResponse.json({ error: flwData.message || "Payment init failed" }, { status: 500 });
  }

  return NextResponse.json({ authorization_url: flwData.data.link });
}