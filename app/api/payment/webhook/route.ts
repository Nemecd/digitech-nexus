import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const signature = req.headers.get("verif-hash");

  if (!signature || signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = await req.json();
  const supabase = createAdminClient();

  if (event.event === "charge.completed" && event.data.status === "successful") {
    // Re-verify directly with Flutterwave rather than trusting the webhook body alone
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${event.data.id}/verify`,
      { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` } }
    );
    const verified = await verifyRes.json();

    if (verified.data?.status !== "successful") {
      return NextResponse.json({ received: true });
    }

    const orderId = verified.data.tx_ref;
    const { data: order } = await supabase.from("orders").select("*, order_items(*)").eq("id", orderId).single();

    if (order && order.payment_status !== "paid" && verified.data.amount >= order.total_amount) {
      await supabase.from("orders").update({ payment_status: "paid", payment_reference: String(event.data.id) }).eq("id", orderId);

      for (const item of order.order_items) {
        const { data: product } = await supabase.from("products").select("type").eq("id", item.product_id).single();
        const isService = product?.type?.endsWith("_service") || product?.type === "student_placement";

        await supabase.from("user_products").insert({
          user_id: order.customer_id,
          product_id: item.product_id,
          order_id: order.id,
          status: isService ? "pending" : "active",
        });
      }

      await supabase.from("notifications").insert({
        user_id: order.customer_id,
        title: "Payment successful",
        message: "Your order has been confirmed. Check My Products for details.",
        type: "order",
      });
    }
  }

  return NextResponse.json({ received: true });
}