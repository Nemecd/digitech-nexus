"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    // 1. Create the auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setLoading(false);
      return setError(signUpError.message);
    }

    const user = data.user;
    if (!user) {
      setLoading(false);
      return setError("Something went wrong creating your account. Please try again.");
    }

    // 2. Create the matching profile row
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      full_name: fullName,
      phone,
      role: "customer",
    });

    setLoading(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    // If email confirmation is enabled in Supabase, there's no session yet
    if (!data.session) {
      router.push("/login?message=Check your email to confirm your account");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Create your account</h2>
      <p className="text-muted text-sm mt-1 mb-8">
        Join Digitech Nexus to get started.
      </p>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="text-sm text-muted">Full name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-gold/60 transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-gold/60 transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-muted">Phone number</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="080..."
            className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-gold/60 transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-muted">Password</label>
          <input
            type="password"
            required
            minLength={6}
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-muted mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-gold hover:underline">Log in</Link>
      </p>
    </div>
  );
}