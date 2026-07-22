"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addLesson(formData: FormData) {
  const productId = formData.get("productId") as string;
  const supabase = await createClient();

  await supabase.from("course_lessons").insert({
    product_id: productId,
    title: formData.get("title"),
    video_url: formData.get("videoUrl"),
    duration_minutes: formData.get("duration") ? Number(formData.get("duration")) : null,
    order_index: Number(formData.get("orderIndex")) || 0,
  });

  revalidatePath(`/admin/products/${productId}/lessons`);
}

export async function deleteLesson(formData: FormData) {
  const productId = formData.get("productId") as string;
  const supabase = await createClient();
  await supabase.from("course_lessons").delete().eq("id", formData.get("lessonId"));
  revalidatePath(`/admin/products/${productId}/lessons`);
}