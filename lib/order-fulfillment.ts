import { createAdminClient } from "@/lib/supabase/admin";

const COMMISSION_ELIGIBLE_TYPES = ["course", "ebook"];

export async function fulfillOrder(orderId: string, providerReference: string, paidAmount: number) {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (!order || order.payment_status === "paid") return;
  if (paidAmount < Number(order.total_amount)) return;

  // Claim the order atomically: only one caller can flip it to paid
  const { data: claimed } = await supabase
    .from("orders")
    .update({ payment_status: "paid", payment_reference: providerReference })
    .eq("id", orderId)
    .neq("payment_status", "paid")
    .select("id");

  if (!claimed || claimed.length === 0) return;

  let eligibleTotal = 0;

  for (const item of order.order_items) {
    const { data: product } = await supabase.from("products").select("type").eq("id", item.product_id).single();
    const isService = product?.type?.endsWith("_service") || product?.type === "student_placement";

    await supabase.from("user_products").insert({
      user_id: order.customer_id,
      product_id: item.product_id,
      order_id: order.id,
      status: isService ? "pending" : "active",
    });

    if (product?.type && COMMISSION_ELIGIBLE_TYPES.includes(product.type)) {
      eligibleTotal += Number(item.unit_price) * Number(item.quantity);
    }
  }

  await supabase.from("notifications").insert({
    user_id: order.customer_id,
    title: "Payment successful",
    message: "Your order has been confirmed. Check My Products for details.",
    type: "order",
  });

  if (order.affiliate_id && eligibleTotal > 0) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("commission_rate, user_id")
      .eq("id", order.affiliate_id)
      .single();

    if (affiliate) {
      const amount = Math.round(((eligibleTotal * Number(affiliate.commission_rate)) / 100) * 100) / 100;

      const { error } = await supabase.rpc("credit_commission", {
        p_affiliate_id: order.affiliate_id,
        p_order_id: order.id,
        p_amount: amount,
      });

      if (!error) {
        await supabase.from("notifications").insert({
          user_id: affiliate.user_id,
          title: "Commission earned",
          message: `You earned ₦${amount.toLocaleString()} commission from a referred purchase.`,
          type: "order",
        });
      }
    }
  }
}