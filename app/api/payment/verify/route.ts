import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get("transaction_id");
  if (!transactionId) return NextResponse.json({ error: "Missing transaction_id" }, { status: 400 });

  const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}