import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fulfillOrder } from "@/lib/order-fulfillment";

export async function POST(req: Request) {
  const signature = req.headers.get("verif-hash");

  if (!signature || signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = await req.json();
  const supabase = createAdminClient();

  if (event.event === "transfer.completed") {
  const transferId = String(event.data.id);
  const transferStatus = event.data.status; // 'SUCCESSFUL' | 'FAILED'

  const { data: withdrawal } = await supabase
    .from("withdrawals")
    .select("id, affiliate_id, amount, status")
    .eq("transfer_reference", transferId)
    .single();

  if (withdrawal && withdrawal.status === "processing") {
    if (transferStatus === "SUCCESSFUL") {
      await supabase.from("withdrawals").update({ status: "paid" }).eq("id", withdrawal.id);
    } else {
      // Flutterwave accepted it but the transfer itself failed — refund the affiliate
      await supabase.from("withdrawals").update({ status: "failed" }).eq("id", withdrawal.id);
      const { data: affiliate } = await supabase.from("affiliates").select("balance").eq("id", withdrawal.affiliate_id).single();
      if (affiliate) {
        await supabase.from("affiliates").update({ balance: Number(affiliate.balance) + Number(withdrawal.amount) }).eq("id", withdrawal.affiliate_id);
      }
    }
  }
  return NextResponse.json({ received: true });
}

  if (event.event === "charge.completed" && event.data.status === "successful") {
    // Re-verify directly with Flutterwave rather than trusting the webhook body alone
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${event.data.id}/verify`,
      { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` } }
    );
    const verified = await verifyRes.json();

       if (verified.data?.status !== "successful") {
      return NextResponse.json({ received: true });
    }

    if (verified.data.currency !== "NGN") {
      return NextResponse.json({ received: true });
    }

    const txRef = verified.data.tx_ref;

    if (txRef.startsWith("wallet_")) {
      const userId = txRef.split("_")[1];
      const amount = verified.data.amount;

      const { data: existing } = await supabase
        .from("wallet_transactions")
        .select("id")
        .eq("reference", txRef)
        .single();

      if (!existing) {
        const { data: profile } = await supabase.from("profiles").select("wallet_balance").eq("id", userId).single();
        await supabase.from("profiles").update({ wallet_balance: Number(profile?.wallet_balance || 0) + amount }).eq("id", userId);
        await supabase.from("wallet_transactions").insert({ user_id: userId, amount, type: "topup", reference: txRef });
        await supabase.from("notifications").insert({
          user_id: userId,
          title: "Wallet funded",
          message: `₦${amount.toLocaleString()} added to your wallet.`,
          type: "order",
        });
      }
      return NextResponse.json({ received: true });
    }

    await fulfillOrder(txRef, String(event.data.id), verified.data.amount);
  }

  return NextResponse.json({ received: true });
}