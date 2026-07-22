import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { account_number, account_bank } = await req.json();

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