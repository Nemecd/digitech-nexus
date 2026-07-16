"use server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getDownloadUrl(userProductId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userProduct } = await supabase
    .from("user_products")
    .select("id, user_id, products(file_url, type)")
    .eq("id", userProductId)
    .eq("user_id", user.id)
    .single();

  if (!userProduct || (userProduct.products as any)?.type !== "ebook") {
    throw new Error("Not authorized to download this item");
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("ebooks")
    .createSignedUrl((userProduct.products as any).file_url, 3600); // expires in 1 hour

  if (error || !data) throw new Error("Could not generate download link");
  return data.signedUrl;
}