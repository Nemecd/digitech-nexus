import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.flutterwave.com/v3/banks/NG", {
    headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}