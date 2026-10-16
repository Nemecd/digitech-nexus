await requireAdmin();
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import UserActionsMenu from "./UserActionsMenu";
import { requireAdmin } from "@/lib/auth";

async function updateRole(formData: FormData): Promise<{ success: boolean; error?: string }> {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: formData.get("role") })
    .eq("id", formData.get("userId"));

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, created_at")
    .order("created_at", { ascending: false });

  const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = new Map(authData?.users.map((u) => [u.id, u.email]) || []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Users</h1>

      <div className="rounded-2xl bg-white border border-line overflow-x-auto">
        <table className="responsive-table w-full text-sm">
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
                <td data-label="Name" className="px-5 py-3 text-navy font-medium">{u.full_name || "—"}</td>
                <td data-label="Email" className="px-5 py-3 text-slate">{emailMap.get(u.id) || "—"}</td>
                <td data-label="Phone" className="px-5 py-3 text-slate">{u.phone || "—"}</td>
                <td data-label="Role" className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                      u.role === "admin" ? "bg-gold/10 text-gold" : "bg-cream text-slate"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td data-label="Joined" className="px-5 py-3 text-slate text-xs">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td data-label="" className="px-5 py-3 text-right">
                  <UserActionsMenu userId={u.id} currentRole={u.role} updateRole={updateRole} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!users || users.length === 0) && (
          <p className="px-5 py-10 text-center text-sm text-slate">No users yet.</p>
        )}
      </div>
    </div>
  );
}