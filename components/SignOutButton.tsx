"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className={className || "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream/80 hover:bg-white/10 hover:text-gold transition-colors"}
    >
      <LogOut size={17} /> Sign Out
    </button>
  );
}