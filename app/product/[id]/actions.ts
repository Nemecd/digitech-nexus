"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { success: boolean; error?: string };

export async function submitReview(productId: string, rating: number, comment: string): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Please log in to leave a review" };

  const stars = Math.round(Number(rating));
  if (!Number.isFinite(stars) || stars < 1 || stars > 5) {
    return { success: false, error: "Choose a star rating" };
  }
  const text = (comment || "").trim().slice(0, 1000);

  const { data: existing } = await supabase
    .from("product_reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();

  // The database only lets people who bought the product write a review
  const { error } = existing
    ? await supabase.from("product_reviews").update({ rating: stars, comment: text || null }).eq("id", existing.id)
    : await supabase
        .from("product_reviews")
        .insert({ product_id: productId, user_id: user.id, rating: stars, comment: text || null });

  if (error) return { success: false, error: "Only people who bought this can review it" };

  revalidatePath(`/product/${productId}`);
  return { success: true };
}

export async function deleteReview(reviewId: string, productId: string): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { success: false, error: "Not authorized" };

  const { error } = await supabase.from("product_reviews").delete().eq("id", reviewId);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/product/${productId}`);
  return { success: true };
}
