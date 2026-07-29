import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function markRead(formData: FormData) {
  "use server";
  const supabase = await createClient();
  await supabase.from("contact_messages").update({ status: "read" }).eq("id", formData.get("id"));
  revalidatePath("/admin/messages");
}

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Messages</h1>
      <div className="space-y-4">
        {messages?.map((m) => (
          <div key={m.id} className={`rounded-2xl bg-white border p-5 ${m.status === "new" ? "border-gold/40" : "border-line"}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-navy text-sm">{m.name} <span className="text-slate font-normal">· {m.email}</span></p>
              {m.status === "new" && (
                <form action={markRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="text-xs text-gold hover:underline">Mark read</button>
                </form>
              )}
            </div>
            {m.subject && <p className="text-xs text-slate mb-1">Subject: {m.subject}</p>}
            <p className="text-sm text-slate">{m.message}</p>
            <p className="text-xs text-slate/60 mt-2">{new Date(m.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}