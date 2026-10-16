import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: affiliate } = await supabase.from("affiliates").select("id").eq("user_id", user.id).single();
  if (!affiliate) return NextResponse.json({ error: "Not an affiliate" }, { status: 403 });

  const { account_number, account_bank } = await req.json();
  if (!/^\d{10}$/.test(String(account_number)) || !account_bank) {
    return NextResponse.json({ error: "Invalid account details" }, { status: 400 });
  }

  const res = await fetch("https://api.flutterwave.com/v3/accounts/resolve", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account_number, account_bank }),
  });
  const data = await res.json();
  return NextResponse.json(data);
}