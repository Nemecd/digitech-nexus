"use server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getDownloadUrl(userProductId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userProduct } = await supabase
    .from("user_products")
    .select("id, user_id, status, products(file_url, type)")
    .eq("id", userProductId)
    .eq("user_id", user.id)
    .single();

  const product = userProduct?.products as any;
  if (!userProduct || product?.type !== "ebook" || userProduct.status !== "active" || !product?.file_url) {
    throw new Error("Not authorized to download this item");
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("ebooks")
    .createSignedUrl(product.file_url, 3600, { download: true });

  if (error || !data) throw new Error("Could not generate download link");
  return data.signedUrl;
}