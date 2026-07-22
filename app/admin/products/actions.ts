"use server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const type = formData.get("type") as string;
  const thumbnailFile = formData.get("thumbnail") as File | null;
  const ebookFile = formData.get("ebookFile") as File | null;

  let thumbnailUrl: string | null = null;
  if (thumbnailFile && thumbnailFile.size > 0) {
    const path = `${Date.now()}-${thumbnailFile.name}`;
    const { error } = await admin.storage.from("thumbnails").upload(path, thumbnailFile);
    if (!error) {
      const { data } = admin.storage.from("thumbnails").getPublicUrl(path);
      thumbnailUrl = data.publicUrl;
    }
  }

  let fileUrl: string | null = null;
  if (type === "ebook" && ebookFile && ebookFile.size > 0) {
    const path = `${Date.now()}-${ebookFile.name}`;
    const { error } = await admin.storage.from("ebooks").upload(path, ebookFile);
    if (!error) fileUrl = path; // storage path only — signed URLs are generated on download, never stored raw
  }

  await supabase.from("products").insert({
    type,
    title: formData.get("title"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    status: "published",
    thumbnail_url: thumbnailUrl,
    file_url: fileUrl,
  });

  revalidatePath("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", formData.get("id"));
  revalidatePath("/admin/products");
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const productId = formData.get("productId") as string;
  const type = formData.get("type") as string;
  const thumbnailFile = formData.get("thumbnail") as File | null;
  const ebookFile = formData.get("ebookFile") as File | null;

  const updates: Record<string, any> = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    status: formData.get("status"),
  };

  if (thumbnailFile && thumbnailFile.size > 0) {
    const path = `${Date.now()}-${thumbnailFile.name}`;
    const { error } = await admin.storage.from("thumbnails").upload(path, thumbnailFile);
    if (!error) {
      const { data } = admin.storage.from("thumbnails").getPublicUrl(path);
      updates.thumbnail_url = data.publicUrl;
    }
  }

  if (type === "ebook" && ebookFile && ebookFile.size > 0) {
    const path = `${Date.now()}-${ebookFile.name}`;
    const { error } = await admin.storage.from("ebooks").upload(path, ebookFile);
    if (!error) updates.file_url = path;
  }

  await supabase.from("products").update(updates).eq("id", productId);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
}