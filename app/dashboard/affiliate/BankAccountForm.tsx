"use client";
import { useState, useEffect } from "react";
import { addBankAccount } from "./actions";

export default function BankAccountForm() {
  const [banks, setBanks] = useState<{ code: string; name: string }[]>([]);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/flutterwave/banks")
      .then((res) => res.json())
      .then((data) => setBanks(data.data || []));
  }, []);

  useEffect(() => {
    if (bankCode && accountNumber.length === 10) {
      setResolving(true);
      setAccountName("");
      setError("");
      fetch("/api/flutterwave/resolve-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_number: accountNumber,
          account_bank: bankCode,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") setAccountName(data.data.account_name);
          else setError("Could not verify account. Check the details.");
        })
        .finally(() => setResolving(false));
    }
  }, [bankCode, accountNumber]);

  return (
    <form action={addBankAccount} className="space-y-3">
      <select
        name="bankCode"
        required
        value={bankCode}
        onChange={(e) => setBankCode(e.target.value)}
        className="w-full rounded-lg border border-line px-3 py-2.5 text-sm bg-white"
      >
        <option value="">Select bank</option>
        {banks.map((b, i) => (
          <option key={`${b.code}-${i}`} value={b.code}>
            {b.name}
          </option>
        ))}
      </select>

      <input
        name="accountNumber"
        required
        maxLength={10}
        placeholder="Account number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        className="w-full rounded-lg border border-line px-3 py-2.5 text-sm"
      />

      <input type="hidden" name="accountName" value={accountName} />

      {resolving && <p className="text-xs text-slate">Verifying account…</p>}
      {accountName && (
        <p className="text-xs text-gold font-semibold">✓ {accountName}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        disabled={!accountName}
        className="w-full rounded-full bg-navy text-cream py-2.5 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors disabled:opacity-50"
      >
        Save Bank Account
      </button>
    </form>
  );
}
