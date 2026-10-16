"use server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

type Result = { success: boolean; archived?: boolean; error?: string };

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { ok: false as const, error: "Not authorized" };

  return { ok: true as const, supabase };
}

export async function createProduct(input: {
  type: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string | null;
  fileUrl: string | null;
  formTemplate: string | null;
}): Promise<Result> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const { error } = await auth.supabase.from("products").insert({
    type: input.type,
    title: input.title,
    description: input.description,
    price: input.price,
    status: "published",
    thumbnail_url: input.thumbnailUrl,
    file_url: input.fileUrl,
    metadata: input.formTemplate ? { form_template: input.formTemplate } : null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(input: {
  productId: string;
  title: string;
  description: string;
  price: number;
  status: string;
  thumbnailUrl: string | null; // null = keep the current one
  fileUrl: string | null;      // null = keep the current one
  formTemplate?: string | null;
}): Promise<Result> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const admin = createAdminClient();
  const { data: existing } = await admin.from("products").select("file_url").eq("id", input.productId).single();

  const updates: Record<string, any> = {
    title: input.title,
    description: input.description,
    price: input.price,
    status: input.status,
  };
  if (input.thumbnailUrl) updates.thumbnail_url = input.thumbnailUrl;
  if (input.fileUrl) updates.file_url = input.fileUrl;
  if (input.formTemplate) updates.metadata = { form_template: input.formTemplate };

  const { error } = await auth.supabase.from("products").update(updates).eq("id", input.productId);
  if (error) return { success: false, error: error.message };

  // Clean up the old eBook file once it has been replaced
  if (input.fileUrl && existing?.file_url && existing.file_url !== input.fileUrl) {
    await admin.storage.from("ebooks").remove([existing.file_url]);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${input.productId}/edit`);
  return { success: true };
}

export async function deleteProduct(productId: string): Promise<Result> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const admin = createAdminClient();

  const { data: product } = await admin
    .from("products")
    .select("id, type, file_url")
    .eq("id", productId)
    .single();
  if (!product) return { success: false, error: "Product not found" };

  const [orderItems, ownedProducts, serviceRequests] = await Promise.all([
    admin.from("order_items").select("id", { count: "exact", head: true }).eq("product_id", productId),
    admin.from("user_products").select("id", { count: "exact", head: true }).eq("product_id", productId),
    admin.from("service_requests").select("id", { count: "exact", head: true }).eq("product_id", productId),
  ]);

  const hasHistory =
    (orderItems.count || 0) > 0 || (ownedProducts.count || 0) > 0 || (serviceRequests.count || 0) > 0;

  if (hasHistory) {
    const { error } = await admin.from("products").update({ status: "archived" }).eq("id", productId);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/products");
    return { success: true, archived: true };
  }

  await admin.from("affiliate_links").delete().eq("product_id", productId);

  const { error } = await admin.from("products").delete().eq("id", productId);
  if (error) return { success: false, error: error.message };

  if (product.type === "ebook" && product.file_url) {
    await admin.storage.from("ebooks").remove([product.file_url]);
  }

  revalidatePath("/admin/products");
  return { success: true };
}