"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("profiles").update({
    full_name: formData.get("fullName"),
    phone: formData.get("phone"),
  }).eq("id", user.id);

  revalidatePath("/dashboard/profile");
}