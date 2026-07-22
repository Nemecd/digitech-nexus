import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { amount } = await req.json();
  if (!amount || amount < 100) {
    return NextResponse.json({ error: "Minimum top-up is ₦100" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const txRef = `wallet_${user.id}_${Date.now()}`;

  const flwRes = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount,
      currency: "NGN",
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/wallet`,
      customer: { email: user.email },
      customizations: { title: "Digitech Nexus", description: "Wallet top-up" },
    }),
  });

  const flwData = await flwRes.json();
  if (flwData.status !== "success") {
    return NextResponse.json({ error: flwData.message || "Could not start payment" }, { status: 500 });
  }

  return NextResponse.json({ authorization_url: flwData.data.link });
}