"use client";
import { useState } from "react";

export default function TopUpForm() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTopUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.authorization_url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleTopUp} className="space-y-3">
      <input
        type="number"
        required
        min={100}
        placeholder="Amount (₦)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        disabled={loading}
        className="w-full rounded-full bg-navy text-cream py-2.5 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Top Up"}
      </button>
    </form>
  );
}