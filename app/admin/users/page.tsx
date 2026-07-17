import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import RoleSelect from "./RoleSelect";

async function updateRole(formData: FormData) {
  "use server";
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ role: formData.get("role") })
    .eq("id", formData.get("userId"));
  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Users</h1>

      <div className="rounded-2xl bg-white border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-slate">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="px-5 py-3 text-navy font-medium">{u.full_name || "—"}</td>
                <td className="px-5 py-3 text-slate">{u.phone || "—"}</td>
                <td className="px-5 py-3">
                  <RoleSelect userId={u.id} currentRole={u.role} updateRole={updateRole} />
                </td>
                <td className="px-5 py-3 text-slate text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}