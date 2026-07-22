import { createClient } from "@/lib/supabase/server";

import { Bell, Circle } from "lucide-react";
import { markAsRead } from "./action";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, message, type, read, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-6">Notifications</h1>

      <div className="rounded-2xl bg-white border border-line divide-y divide-line">
        {notifications && notifications.length > 0 ? notifications.map((n) => (
          <div key={n.id} className={`flex items-start gap-4 px-6 py-4 ${!n.read ? "bg-gold/5" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
              <Bell size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-navy">{n.title}</p>
                {!n.read && <Circle size={7} className="fill-gold text-gold" />}
              </div>
              <p className="text-sm text-slate mt-0.5">{n.message}</p>
              <p className="text-xs text-slate/70 mt-1">{new Date(n.created_at).toLocaleString()}</p>
            </div>
            {!n.read && (
              <form action={markAsRead}>
                <input type="hidden" name="id" value={n.id} />
                <button className="text-xs text-gold hover:underline whitespace-nowrap">Mark read</button>
              </form>
            )}
          </div>
        )) : (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}