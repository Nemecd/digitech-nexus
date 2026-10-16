import { createClient } from "@/lib/supabase/server";
import { becomeAffiliate, requestWithdrawal } from "./actions";
import ReferralLinkCard from "./ReferralLinkCard";
import ProductLinksList from "./ProductLinksList";
import BankAccountForm from "./BankAccountForm";
import SubmitButton from "@/components/SubmitButton";

const naira = (n: number | string) => `₦${Number(n).toLocaleString()}`;
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "credited" || status === "paid"
      ? "bg-gold/10 text-gold"
      : status === "failed"
      ? "bg-red-50 text-red-500"
      : "bg-cream text-slate";
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${styles}`}>{status}</span>
  );
}

type Row = { id: string; amount: number; status: string; date: string };

function ActivityCard({
  title,
  rows,
  emptyText,
  prefix = "",
}: {
  title: string;
  rows: Row[];
  emptyText: string;
  prefix?: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-line overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-line">
        <h3 className="font-display font-semibold text-navy">{title}</h3>
      </div>
      {rows.length > 0 ? (
        <div className="divide-y divide-line">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy">
                  {prefix}
                  {naira(r.amount)}
                </p>
                <p className="text-xs text-slate">{formatDate(r.date)}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      ) : (
        <p className="px-4 sm:px-6 py-8 text-sm text-slate text-center">{emptyText}</p>
      )}
    </div>
  );
}

export default async function AffiliateDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("id, referral_code, balance, total_earned, commission_rate")
    .eq("user_id", user!.id)
    .single();

  if (!affiliate) {
    return (
      <div className="max-w-md">
        <h1 className="font-display text-2xl font-semibold text-navy mb-3">Affiliate Program</h1>
        <p className="text-slate mb-6">
          Earn 30% commission on every course and eBook sold through your links. Get started instantly.
        </p>
        <form action={becomeAffiliate}>
          <SubmitButton
            pendingText="Setting up your account…"
            spinnerSize={16}
            className="rounded-full bg-navy text-cream px-6 py-3 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors"
          >
            Become an Affiliate
          </SubmitButton>
        </form>
      </div>
    );
  }

  const rate = Number(affiliate.commission_rate);
  const balance = Number(affiliate.balance);

  const [
    { data: links },
    { data: products },
    { data: bankAccounts },
    { data: commissions },
    { data: withdrawals },
  ] = await Promise.all([
    supabase.from("affiliate_links").select("product_id, code, clicks").eq("affiliate_id", affiliate.id),
    supabase
      .from("products")
      .select("id, title, type, price, thumbnail_url")
      .in("type", ["course", "ebook"])
      .eq("status", "published")
      .order("created_at", { ascending: false }),
    supabase
      .from("affiliate_bank_accounts")
      .select("id, account_number, account_name")
      .eq("affiliate_id", affiliate.id),
    supabase
      .from("commissions")
      .select("id, amount, status, created_at")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("withdrawals")
      .select("id, amount, status, requested_at")
      .eq("affiliate_id", affiliate.id)
      .order("requested_at", { ascending: false })
      .limit(5),
  ]);

  const sitewide = links?.find((l) => !l.product_id);
  const totalClicks = links?.reduce((sum, l) => sum + (l.clicks || 0), 0) || 0;

  const existingLinks: Record<string, { code: string; clicks: number }> = {};
  links?.forEach((l) => {
    if (l.product_id) existingLinks[l.product_id] = { code: l.code, clicks: l.clicks || 0 };
  });

  const bank = bankAccounts?.[0] ?? null;

  const commissionRows: Row[] = (commissions || []).map((c) => ({
    id: c.id,
    amount: Number(c.amount),
    status: c.status,
    date: c.created_at,
  }));
  const withdrawalRows: Row[] = (withdrawals || []).map((w) => ({
    id: w.id,
    amount: Number(w.amount),
    status: w.status,
    date: w.requested_at,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-navy">Affiliate Dashboard</h1>
        <p className="text-sm text-slate mt-1">
          Earn {rate}% commission on every course or eBook sold through your links.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="col-span-2 lg:col-span-1 rounded-2xl bg-navy p-5 sm:p-6">
          <p className="text-xs text-cream/60">Withdrawable balance</p>
          <p className="font-display text-3xl font-semibold text-gold mt-1">{naira(balance)}</p>
        </div>
        <div className="rounded-2xl bg-white border border-line p-4 sm:p-6">
          <p className="text-xs text-slate">Total earned</p>
          <p className="font-display text-xl sm:text-2xl font-semibold text-navy mt-1 break-words">
            {naira(affiliate.total_earned)}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-line p-4 sm:p-6">
          <p className="text-xs text-slate">Link clicks</p>
          <p className="font-display text-xl sm:text-2xl font-semibold text-navy mt-1">
            {totalClicks.toLocaleString()}
          </p>
        </div>
      </div>

      <ReferralLinkCard code={sitewide?.code ?? affiliate.referral_code} />

      {/* Product links */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-navy">Product links</h2>
        <p className="text-sm text-slate mt-1 mb-4">
          Every course and eBook gets its own link that opens straight on that product. You earn {rate}% of the
          price when someone buys through it. Services like NIN and CAC don&apos;t earn commission.
        </p>
        {products && products.length > 0 ? (
          <ProductLinksList products={products} existingLinks={existingLinks} commissionRate={rate} />
        ) : (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-slate">
            No courses or eBooks available to promote yet.
          </p>
        )}
      </section>

      {/* Bank account + withdrawal */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-8">
        <div className="rounded-2xl bg-white border border-line p-4 sm:p-6">
          <h3 className="font-display font-semibold text-navy mb-4">Bank account</h3>
          {bank ? (
            <div className="text-sm">
              <p className="text-navy font-medium">{bank.account_name}</p>
              <p className="text-slate text-xs mt-1">{bank.account_number}</p>
              <p className="text-slate/70 text-xs mt-3">Withdrawals are paid into this account.</p>
            </div>
          ) : (
            <BankAccountForm />
          )}
        </div>

        <div className="rounded-2xl bg-white border border-line p-4 sm:p-6">
          <h3 className="font-display font-semibold text-navy mb-4">Request withdrawal</h3>
          {bank ? (
            <form action={requestWithdrawal} className="space-y-3">
              <input type="hidden" name="bankAccountId" value={bank.id} />
              <input
                name="amount"
                type="number"
                required
                min="1"
                step="any"
                max={balance}
                disabled={balance <= 0}
                placeholder={balance > 0 ? `Up to ${naira(balance)}` : "No balance to withdraw yet"}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm disabled:bg-cream disabled:text-slate"
              />
              <SubmitButton
                disabled={balance <= 0}
                pendingText="Submitting…"
                className="w-full rounded-full bg-gold text-navy py-2.5 text-sm font-semibold hover:bg-gold/90 transition-colors"
              >
                Request withdrawal
              </SubmitButton>
            </form>
          ) : (
            <p className="text-sm text-slate">Add a bank account first to request withdrawals.</p>
          )}
        </div>
      </div>

      {/* Activity */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <ActivityCard
          title="Recent commissions"
          rows={commissionRows}
          prefix="+"
          emptyText="No commissions yet. Share a link to get started."
        />
        <ActivityCard title="Recent withdrawals" rows={withdrawalRows} emptyText="No withdrawal requests yet." />
      </div>
    </div>
  );
}