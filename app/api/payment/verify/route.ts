import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fulfillOrder } from "@/lib/order-fulfillment";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get("transaction_id");
  if (!transactionId || !/^\d+$/.test(transactionId)) {
    return NextResponse.json({ error: "Missing or invalid transaction_id" }, { status: 400 });
  }

  const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
    cache: "no-store",
  });
  const data = await res.json();

  if (data.status !== "success" || !data.data) {
    return NextResponse.json({ status: "error", data: { status: "failed" } });
  }

  const txRef: string = data.data.tx_ref;

  // Only the customer who placed the order may see or complete it
  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("id, customer_id").eq("id", txRef).single();
  if (!order || order.customer_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const paid = data.data.status === "successful" && data.data.currency === "NGN";

  if (paid) {
    await fulfillOrder(txRef, String(data.data.id), Number(data.data.amount));
  }

  // Minimal response only: no customer or card details
  return NextResponse.json({
    status: paid ? "success" : "error",
    data: { status: paid ? "successful" : data.data.status, tx_ref: txRef },
  });
}