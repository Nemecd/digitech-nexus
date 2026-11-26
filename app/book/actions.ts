"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBookingOnly } from "@/lib/booking-config";

// Only allow redirects to pages on this site
function safePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? path : "/services/nin";
}

export async function startBooking(formData: FormData): Promise<void> {
  const productId = String(formData.get("productId") || "");
  const returnTo = safePath(String(formData.get("returnTo") || "/services/nin"));
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent(returnTo)}`);

  const admin = createAdminClient();
  const { data: product } = await admin
    .from("products")
    .select("id, type, status")
    .eq("id", productId)
    .maybeSingle();

  if (!product || product.status !== "published" || !isBookingOnly(product.type)) {
    redirect(returnTo);
  }

  // Reuse an unfinished booking instead of piling up duplicates
  const { data: open } = await admin
    .from("user_products")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .eq("status", "pending")
    .is("order_id", null)
    .limit(1);

  let bookingId: string | undefined = open?.[0]?.id;

  if (!bookingId) {
    const { data: created } = await admin
      .from("user_products")
      .insert({ user_id: user.id, product_id: productId, order_id: null, status: "pending" })
      .select("id")
      .single();
    bookingId = created?.id;
  }

  if (!bookingId) redirect(returnTo);
  redirect(`/dashboard/service-requests/${bookingId}`);
}
