import { createClient } from "@/lib/supabase/server";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import TopUpForm from "./TopUpForm";

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("wallet_balance").eq("id", user!.id).single();
  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select("id, amount, type, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-6">Wallet</h1>

      <div className="rounded-2xl bg-navy p-8 text-cream mb-8">
        <p className="text-xs text-cream/60">Current Balance</p>
        <p className="font-display text-4xl font-semibold text-gold mt-1">
          ₦{Number(profile?.wallet_balance || 0).toLocaleString()}
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-line p-6 mb-8 max-w-sm">
        <h3 className="font-display font-semibold text-navy mb-4">Top Up Wallet</h3>
        <TopUpForm />
      </div>

      <div className="rounded-2xl bg-white border border-line">
        <div className="px-6 py-4 border-b border-line">
          <h3 className="font-display font-semibold text-navy">Transaction History</h3>
        </div>
        <div className="divide-y divide-line">
          {transactions && transactions.length > 0 ? transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-3">
                {t.type === "topup" ? (
                  <ArrowDownCircle size={18} className="text-gold" />
                ) : (
                  <ArrowUpCircle size={18} className="text-slate" />
                )}
                <div>
                  <p className="text-sm text-navy capitalize">{t.type}</p>
                  <p className="text-xs text-slate">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${t.type === "topup" ? "text-gold" : "text-navy"}`}>
                {t.type === "topup" ? "+" : "-"}₦{Number(t.amount).toLocaleString()}
              </span>
            </div>
          )) : (
            <p className="px-6 py-6 text-sm text-slate">No transactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}