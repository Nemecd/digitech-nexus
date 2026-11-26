
"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getDownloadUrl(userProductId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // First, verify that this purchase belongs to the logged-in user.
  const { data: userProduct, error: purchaseError } = await supabase
    .from("user_products")
    .select("id, user_id, status, product_id")
    .eq("id", userProductId)
    .eq("user_id", user.id)
    .single();

  if (purchaseError || !userProduct) {
    throw new Error("Purchase record not found.");
  }

  if (userProduct.status !== "active") {
    throw new Error("This purchase is not active.");
  }

  // Fetch the product separately.
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, title, type, file_url")
    .eq("id", userProduct.product_id)
    .single();

  if (productError || !product) {
    throw new Error("The purchased product could not be found.");
  }

  if (product.type !== "ebook" || !product.file_url) {
    throw new Error("This item is not an available eBook download.");
  }

  // Generate a secure, temporary download link.
  const admin = createAdminClient();

  const { data, error } = await admin.storage
    .from("ebooks")
    .createSignedUrl(product.file_url, 3600, {
      download: true,
    });

  if (error || !data) {
    throw new Error("Could not generate download link.");
  }

  return data.signedUrl;
}
