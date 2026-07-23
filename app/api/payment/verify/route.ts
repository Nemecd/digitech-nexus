import { NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/order-fulfillment";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get("transaction_id");
  if (!transactionId) return NextResponse.json({ error: "Missing transaction_id" }, { status: 400 });

  const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
  });
  const data = await res.json();

  if (data.status === "success" && data.data?.status === "successful") {
    const orderId = data.data.tx_ref;
    if (!orderId.startsWith("wallet_")) {
      await fulfillOrder(orderId, String(data.data.id), data.data.amount);
    }
  }

  return NextResponse.json(data);
}