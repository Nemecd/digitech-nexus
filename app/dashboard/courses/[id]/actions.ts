"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Result = { success: boolean; error?: string };

export async function setLessonComplete(lessonId: string, complete: boolean): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Please log in again" };

  // Lessons can only be read by people who own the course (or admins),
  // so finding the lesson here also proves the student has access.
  const { data: lesson } = await supabase
    .from("course_lessons")
    .select("id, product_id")
    .eq("id", lessonId)
    .maybeSingle();
  if (!lesson) return { success: false, error: "Lesson not found" };

  if (complete) {
    const { error } = await supabase.from("lesson_progress").insert({
      user_id: user.id,
      product_id: lesson.product_id,
      lesson_id: lesson.id,
    });
    // 23505 means it was already marked complete, which is fine
    if (error && error.code !== "23505") {
      return { success: false, error: "Could not save your progress" };
    }
  } else {
    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id);
    if (error) return { success: false, error: "Could not update your progress" };
  }

  revalidatePath(`/dashboard/courses/${lesson.product_id}`);
  return { success: true };
}

export async function claimCertificate(formData: FormData): Promise<void> {
  const productId = String(formData.get("productId") || "");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // limit(1) so a student who bought the course twice still passes this check
  const { data: owned } = await supabase
    .from("user_products")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .eq("status", "active")
    .limit(1);
  if (!owned || owned.length === 0) redirect("/dashboard/products");

  const [{ data: lessons }, { data: progress }] = await Promise.all([
    supabase.from("course_lessons").select("id").eq("product_id", productId),
    supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id).eq("product_id", productId),
  ]);

  const done = new Set((progress ?? []).map((p: any) => p.lesson_id as string));
  const allLessons = lessons ?? [];
  const finished = allLessons.length > 0 && allLessons.every((l: any) => done.has(l.id));
  if (!finished) redirect(`/dashboard/courses/${productId}`);

  // Certificates are written by the server only (students have no insert permission)
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("course_certificates")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  let certificateId: string | undefined = existing?.id;

  if (!certificateId) {
    const { data: created } = await admin
      .from("course_certificates")
      .insert({ user_id: user.id, product_id: productId })
      .select("id")
      .single();
    certificateId = created?.id;
  }

  if (!certificateId) {
    // A double click can lose the insert race; look it up again
    const { data: again } = await admin
      .from("course_certificates")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();
    certificateId = again?.id;
  }

  if (!certificateId) redirect(`/dashboard/courses/${productId}`);
  redirect(`/certificate/${certificateId}`);
}
