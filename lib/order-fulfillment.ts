import { createAdminClient } from "@/lib/supabase/admin";

export async function fulfillOrder(orderId: string, providerReference: string, paidAmount: number) {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (!order || order.payment_status === "paid") {
    return; // already processed, or order doesn't exist — safe to no-op
  }

  if (paidAmount < Number(order.total_amount)) {
    return; // paid less than owed — don't grant access, leave status pending for manual review
  }

  await supabase.from("orders").update({ payment_status: "paid", payment_reference: providerReference }).eq("id", orderId);

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

  if (order.affiliate_id) {
    const { data: affiliate } = await supabase.from("affiliates").select("commission_rate").eq("id", order.affiliate_id).single();
    if (affiliate) {
      const commissionAmount = (Number(order.total_amount) * Number(affiliate.commission_rate)) / 100;
      await supabase.from("commissions").insert({
        affiliate_id: order.affiliate_id,
        order_id: order.id,
        amount: commissionAmount,
        status: "pending",
      });
    }
  }
}