"use server";
import { createClient } from "@/lib/supabase/server";

export async function submitContactMessage(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (error) throw new Error("Could not send message");
}