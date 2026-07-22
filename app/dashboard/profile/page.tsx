import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";
export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("full_name, phone, role").eq("id", user!.id).single();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-6">Profile</h1>

      <div className="rounded-2xl bg-white border border-line p-6 max-w-md">
        <div className="mb-6">
          <p className="text-xs text-slate">Email</p>
          <p className="text-sm text-navy mt-0.5">{user!.email}</p>
        </div>

        <ProfileForm fullName={profile?.full_name || ""} phone={profile?.phone || ""} />
      </div>
    </div>
  );
}