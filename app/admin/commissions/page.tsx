import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function creditCommission(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const commissionId = formData.get("commissionId") as string;
  const affiliateId = formData.get("affiliateId") as string;
  const amount = Number(formData.get("amount"));

  const { data: affiliate } = await supabase.from("affiliates").select("balance, total_earned").eq("id", affiliateId).single();
  if (!affiliate) return;

  await supabase.from("affiliates").update({
    balance: Number(affiliate.balance) + amount,
    total_earned: Number(affiliate.total_earned) + amount,
  }).eq("id", affiliateId);

  await supabase.from("commissions").update({ status: "credited" }).eq("id", commissionId);
  revalidatePath("/admin/commissions");
}

export default async function AdminCommissionsPage() {
  const supabase = await createClient();
  const { data: commissions } = await supabase
    .from("commissions")
    .select("id, amount, status, created_at, affiliates(id, referral_code, profiles(full_name))")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Commissions</h1>
      <div className="rounded-2xl bg-white border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-slate">
            <tr>
              <th className="px-5 py-3 font-medium">Affiliate</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {commissions?.map((c: any) => (
              <tr key={c.id} className="border-t border-line">
                <td className="px-5 py-3 text-navy font-medium">
                  {c.affiliates?.profiles?.full_name} <span className="text-xs text-slate">({c.affiliates?.referral_code})</span>
                </td>
                <td className="px-5 py-3 text-slate">₦{Number(c.amount).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    c.status === "credited" ? "bg-gold/10 text-gold" : "bg-cream text-slate"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  {c.status === "pending" && (
                    <form action={creditCommission}>
                      <input type="hidden" name="commissionId" value={c.id} />
                      <input type="hidden" name="affiliateId" value={c.affiliates.id} />
                      <input type="hidden" name="amount" value={c.amount} />
                      <button className="text-xs text-gold hover:underline font-semibold">Credit</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}