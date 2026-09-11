import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import UserActionsMenu from "./UserActionsMenu";

async function updateRole(formData: FormData) {
  "use server";
  const supabase = await createClient();
  await supabase.from("profiles").update({ role: formData.get("role") }).eq("id", formData.get("userId"));
  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, created_at")
    .order("created_at", { ascending: false });

  const { data: authData } = await admin.auth.admin.listUsers();
  const emailMap = new Map(authData?.users.map((u) => [u.id, u.email]) || []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Users</h1>

      <div className="rounded-2xl bg-white border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-slate">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="px-5 py-3 text-navy font-medium">{u.full_name || "—"}</td>
                <td className="px-5 py-3 text-slate">{emailMap.get(u.id) || "—"}</td>
                <td className="px-5 py-3 text-slate">{u.phone || "—"}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                    u.role === "admin" ? "bg-gold/10 text-gold" : "bg-cream text-slate"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <UserActionsMenu userId={u.id} currentRole={u.role} updateRole={updateRole} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}