import { createClient } from "@/lib/supabase/server";
import { becomeAffiliate, requestWithdrawal } from "./actions";
import CopyLinkButton from "./CopyLinkButton";
import BankAccountForm from "./BankAccountForm";

export default async function AffiliateDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("id, referral_code, balance, total_earned")
    .eq("user_id", user!.id)
    .single();

  if (!affiliate) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy mb-3">Affiliate Program</h1>
        <p className="text-slate mb-6 max-w-md">
          Earn a commission on every sale made through your referral link. Get started instantly.
        </p>
        <form action={becomeAffiliate}>
          <button className="rounded-full bg-navy text-cream px-6 py-3 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors">
            Become an Affiliate
          </button>
        </form>
      </div>
    );
  }

  const [{ data: linkRow }, { data: bankAccounts }, { data: commissions }, { data: withdrawals }] = await Promise.all([
    supabase.from("affiliate_links").select("clicks").eq("affiliate_id", affiliate.id).is("product_id", null).single(),
    supabase.from("affiliate_bank_accounts").select("id, bank_code, account_number, account_name").eq("affiliate_id", affiliate.id),
    supabase.from("commissions").select("id, amount, status, created_at").eq("affiliate_id", affiliate.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("withdrawals").select("id, amount, status, requested_at").eq("affiliate_id", affiliate.id).order("requested_at", { ascending: false }).limit(5),
  ]);

  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/?ref=${affiliate.referral_code}`;
  const hasBank = bankAccounts && bankAccounts.length > 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-6">Affiliate Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-white border border-line p-6">
          <p className="text-xs text-slate">Withdrawable Balance</p>
          <p className="font-display text-2xl font-semibold text-navy mt-1">₦{Number(affiliate.balance).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-white border border-line p-6">
          <p className="text-xs text-slate">Total Earned</p>
          <p className="font-display text-2xl font-semibold text-navy mt-1">₦{Number(affiliate.total_earned).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-white border border-line p-6">
          <p className="text-xs text-slate">Link Clicks</p>
          <p className="font-display text-2xl font-semibold text-navy mt-1">{linkRow?.clicks || 0}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-line p-6 mb-6">
        <p className="text-xs text-slate mb-2">Your Referral Link</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-sm text-navy bg-cream rounded-lg px-4 py-3 overflow-x-auto">{link}</code>
          <CopyLinkButton link={link} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-line p-6">
          <h3 className="font-display font-semibold text-navy mb-4">Bank Account</h3>
          {hasBank ? (
            <div className="text-sm">
              <p className="text-navy font-medium">{bankAccounts[0].account_name}</p>
              <p className="text-slate text-xs mt-1">{bankAccounts[0].account_number}</p>
            </div>
          ) : (
            <BankAccountForm />
          )}
        </div>

        <div className="rounded-2xl bg-white border border-line p-6">
          <h3 className="font-display font-semibold text-navy mb-4">Request Withdrawal</h3>
          {hasBank ? (
            <form action={requestWithdrawal} className="space-y-3">
              <input type="hidden" name="bankAccountId" value={bankAccounts[0].id} />
              <input
                name="amount"
                type="number"
                required
                max={affiliate.balance}
                placeholder={`Max ₦${Number(affiliate.balance).toLocaleString()}`}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm"
              />
              <button className="w-full rounded-full bg-gold text-navy py-2.5 text-sm font-semibold hover:bg-gold/90 transition-colors">
                Request Withdrawal
              </button>
            </form>
          ) : (
            <p className="text-sm text-slate">Add a bank account first to request withdrawals.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-line mt-6">
        <div className="px-6 py-4 border-b border-line">
          <h3 className="font-display font-semibold text-navy">Recent Withdrawals</h3>
        </div>
        <div className="divide-y divide-line">
          {withdrawals && withdrawals.length > 0 ? withdrawals.map((w) => (
            <div key={w.id} className="flex items-center justify-between px-6 py-3 text-sm">
              <span className="text-navy">₦{Number(w.amount).toLocaleString()}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-cream text-slate font-semibold capitalize">{w.status}</span>
            </div>
          )) : (
            <p className="px-6 py-6 text-sm text-slate">No withdrawal requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}