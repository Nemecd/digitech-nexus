"use server";
import { createClient } from "@/lib/supabase/server";

export async function getPostPurchaseDestination(orderId: string): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "/dashboard/products";

  // Fulfilment may still be finishing on the webhook side, so retry briefly
  for (let attempt = 0; attempt < 6; attempt++) {
    const { data: items } = await supabase
      .from("user_products")
      .select("id, products(id, type)")
      .eq("order_id", orderId)
      .eq("user_id", user.id);

    if (items && items.length > 0) {
      if (items.length > 1) return "/dashboard/products";

      const item = items[0];
      const product = item.products as any;

      if (product.type === "ebook") return `/dashboard/products/${item.id}?autodownload=1`;
      if (product.type === "course") return `/dashboard/courses/${product.id}`;
      if (product.type.endsWith("_service") || product.type === "student_placement") {
        return `/dashboard/service-requests/${item.id}`;
      }
      return "/dashboard/products";
    }

    await new Promise((resolve) => setTimeout(resolve, 700));
  }

  return "/dashboard/products";
}