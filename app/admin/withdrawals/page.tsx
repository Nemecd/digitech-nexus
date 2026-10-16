import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import SubmitButton from "@/components/SubmitButton";

async function approveWithdrawal(formData: FormData) {
  "use server";
  const withdrawalId = formData.get("withdrawalId") as string;
  const supabase = await createClient();

  // Claim it first so a repeat click can never start a second transfer
  const { data: withdrawal } = await supabase
    .from("withdrawals")
    .update({ status: "processing" })
    .eq("id", withdrawalId)
    .eq("status", "requested")
    .select("id, amount, affiliate_id, affiliate_bank_accounts(bank_code, account_number)")
    .single();

  if (!withdrawal) return;

  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("balance")
    .eq("id", withdrawal.affiliate_id)
    .single();

  if (!affiliate || Number(affiliate.balance) < Number(withdrawal.amount)) {
    await supabase.from("withdrawals").update({ status: "failed" }).eq("id", withdrawalId);
    revalidatePath("/admin/withdrawals");
    return;
  }

  const bank = withdrawal.affiliate_bank_accounts as any;

  const transferRes = await fetch("https://api.flutterwave.com/v3/transfers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_bank: bank.bank_code,
      account_number: bank.account_number,
      amount: withdrawal.amount,
      currency: "NGN",
      narration: "Digitech Nexus affiliate payout",
      reference: `wd_${withdrawal.id}`,
    }),
  });

  const transferData = await transferRes.json();

  if (transferData.status === "success") {
    await supabase
      .from("withdrawals")
      .update({
        transfer_reference: String(transferData.data.id),
        processed_at: new Date().toISOString(),
      })
      .eq("id", withdrawalId);

    await supabase
      .from("affiliates")
      .update({ balance: Number(affiliate.balance) - Number(withdrawal.amount) })
      .eq("id", withdrawal.affiliate_id);
  } else {
    await supabase.from("withdrawals").update({ status: "failed" }).eq("id", withdrawalId);
  }

  revalidatePath("/admin/withdrawals");
}

async function rejectWithdrawal(formData: FormData) {
  "use server";
  const supabase = await createClient();
  await supabase
    .from("withdrawals")
    .update({ status: "failed" })
    .eq("id", formData.get("withdrawalId"))
    .eq("status", "requested");
  revalidatePath("/admin/withdrawals");
}

export default async function AdminWithdrawalsPage() {
  const supabase = await createClient();
  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("id, amount, status, requested_at, affiliates(referral_code, profiles(full_name))")
    .order("requested_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Withdrawals</h1>

      <div className="rounded-2xl bg-white border border-line overflow-x-auto">
        <table className="responsive-table w-full text-sm">
          <thead className="bg-cream text-left text-slate">
            <tr>
              <th className="px-5 py-3 font-medium">Affiliate</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Requested</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {withdrawals?.map((w: any) => (
              <tr key={w.id} className="border-t border-line">
                <td data-label="Affiliate" className="px-5 py-3 text-navy font-medium">
                  {w.affiliates?.profiles?.full_name}{" "}
                  <span className="text-xs text-slate">({w.affiliates?.referral_code})</span>
                </td>
                <td data-label="Amount" className="px-5 py-3 text-slate">
                  ₦{Number(w.amount).toLocaleString()}
                </td>
                <td data-label="Status" className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      w.status === "paid"
                        ? "bg-gold/10 text-gold"
                        : w.status === "failed"
                        ? "bg-red-50 text-red-500"
                        : "bg-cream text-slate"
                    }`}
                  >
                    {w.status}
                  </span>
                </td>
                <td data-label="Requested" className="px-5 py-3 text-slate text-xs">
                  {new Date(w.requested_at).toLocaleDateString()}
                </td>
                <td data-label="" className="px-5 py-3 text-right space-x-3">
                  {w.status === "requested" && (
                    <>
                      <form action={approveWithdrawal} className="inline">
                        <input type="hidden" name="withdrawalId" value={w.id} />
                        <SubmitButton
                          pendingText="Paying…"
                          className="text-xs text-gold hover:underline font-semibold"
                        >
                          Approve &amp; Pay
                        </SubmitButton>
                      </form>
                      <form action={rejectWithdrawal} className="inline">
                        <input type="hidden" name="withdrawalId" value={w.id} />
                        <SubmitButton
                          pendingText="Rejecting…"
                          className="text-xs text-red-500 hover:underline font-semibold"
                        >
                          Reject
                        </SubmitButton>
                      </form>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!withdrawals || withdrawals.length === 0) && (
          <p className="px-5 py-10 text-center text-sm text-slate">No withdrawal requests yet.</p>
        )}
      </div>
    </div>
  );
}