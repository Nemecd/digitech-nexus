"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

function refresh(productId: string) {
  revalidatePath(`/admin/products/${productId}/lessons`);
  revalidatePath(`/product/${productId}`);
}

async function orderedLessonIds(productId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("course_lessons")
    .select("id")
    .eq("product_id", productId)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });
  return (data ?? []).map((l: any) => l.id as string);
}

async function saveOrder(ids: string[]) {
  const supabase = await createClient();
  await Promise.all(
    ids.map((lessonId, index) =>
      supabase.from("course_lessons").update({ order_index: index + 1 }).eq("id", lessonId)
    )
  );
}

export async function addLesson(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") || "");
  const supabase = await createClient();

  const { count } = await supabase
    .from("course_lessons")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const duration = formData.get("duration");

  await supabase.from("course_lessons").insert({
    product_id: productId,
    title: String(formData.get("title") || "").trim(),
    video_url: String(formData.get("videoUrl") || "").trim(),
    duration_minutes: duration ? Number(duration) : null,
    order_index: (count ?? 0) + 1,
  });

  refresh(productId);
}

export async function updateLesson(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") || "");
  const lessonId = String(formData.get("lessonId") || "");
  const supabase = await createClient();

  const duration = formData.get("duration");

  await supabase
    .from("course_lessons")
    .update({
      title: String(formData.get("title") || "").trim(),
      video_url: String(formData.get("videoUrl") || "").trim(),
      duration_minutes: duration ? Number(duration) : null,
    })
    .eq("id", lessonId);

  refresh(productId);
}

export async function deleteLesson(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") || "");
  const lessonId = String(formData.get("lessonId") || "");
  const supabase = await createClient();

  await supabase.from("course_lessons").delete().eq("id", lessonId);

  // Close the gap so the numbers stay 1, 2, 3...
  await saveOrder(await orderedLessonIds(productId));

  refresh(productId);
}

export async function moveLesson(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") || "");
  const lessonId = String(formData.get("lessonId") || "");
  const direction = String(formData.get("direction") || "");

  const ids = await orderedLessonIds(productId);
  const from = ids.indexOf(lessonId);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from < 0 || to < 0 || to >= ids.length) return;

  [ids[from], ids[to]] = [ids[to], ids[from]];
  await saveOrder(ids);

  refresh(productId);
}

export async function saveInstructor(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") || "");
  const supabase = await createClient();

  // Merge into metadata so other settings (like a form template) are kept
  const { data: product } = await supabase.from("products").select("metadata").eq("id", productId).single();
  const metadata = {
    ...((product?.metadata as Record<string, unknown> | null) ?? {}),
    instructor_name: String(formData.get("instructorName") || "").trim(),
    instructor_bio: String(formData.get("instructorBio") || "").trim(),
  };

  await supabase.from("products").update({ metadata }).eq("id", productId);

  refresh(productId);
}
