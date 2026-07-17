"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return setError(error.message);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);
    toast.success("Success! Taking you to your dashboard…");
    router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Welcome back</h2>
      <p className="text-muted text-sm mt-1 mb-8">
        Log in to continue to your dashboard.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-sm text-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg bg-navy-card bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-gold/60 transition-colors"
          />
        </div>
        <div>
          <label className="text-sm text-muted">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-gold/60 transition-colors"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-[#2B7FE0] to-[#1AA3E8] py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-muted mt-6">
        Don't have an account?{" "}
        <Link href="/register" className="text-gold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
