"use client";
import { useState } from "react";

import toast from "react-hot-toast";
import { updateProfile } from "./action";

export default function ProfileForm({ fullName, phone }: { fullName: string; phone: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs text-slate">Full Name</label>
        <input name="fullName" defaultValue={fullName} required className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="text-xs text-slate">Phone Number</label>
        <input name="phone" defaultValue={phone} required className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm" />
      </div>
      <button disabled={loading} className="rounded-full bg-navy text-cream px-6 py-2.5 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors disabled:opacity-50">
        {loading ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}