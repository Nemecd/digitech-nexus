"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsRead(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("notifications").update({ read: true }).eq("id", formData.get("id"));
  revalidatePath("/dashboard/notifications");
}