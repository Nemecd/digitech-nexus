import { createAdminClient } from "@/lib/supabase/admin";

// Notifications are written with the service-role key because users and admins
// have no insert policy on the notifications table.
export async function notify(userId: string, title: string, message: string, type = "system") {
  const admin = createAdminClient();
  const { error } = await admin.from("notifications").insert({ user_id: userId, title, message, type });
  if (error) console.error("notify failed:", error.message);
}