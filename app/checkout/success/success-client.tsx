"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CheckCircle2, Loader2 } from "lucide-react";
import { getPostPurchaseDestination } from "./actions";

export default function CheckoutSuccessClient() {
  const params = useSearchParams();
  const router = useRouter();
  const transactionId = params.get("transaction_id");
  const status = params.get("status");
  const { clearCart } = useCart();
  const [pageStatus, setPageStatus] = useState<"loading" | "success" | "failed">("loading");
  const [destination, setDestination] = useState("/dashboard/products");

  useEffect(() => {
    if (status === "cancelled" || !transactionId) {
      setPageStatus("failed");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/payment/verify?transaction_id=${transactionId}`);
        const data = await res.json();

        if (data.status === "success" && data.data?.status === "successful") {
          clearCart();
          setPageStatus("success");

          const dest = await getPostPurchaseDestination(data.data.tx_ref);
          if (cancelled) return;
          setDestination(dest);
          setTimeout(() => {
            if (!cancelled) router.replace(dest);
          }, 1500);
        } else {
          setPageStatus("failed");
        }
      } catch {
        setPageStatus("failed");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId, status]);

  return (
    <section className="bg-white min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        {pageStatus === "loading" && (
          <>
            <Loader2 className="animate-spin mx-auto text-gold mb-4" size={32} />
            <p className="text-slate">Confirming your payment…</p>
          </>
        )}
        {pageStatus === "success" && (
          <>
            <CheckCircle2 className="mx-auto text-gold mb-4" size={40} />
            <h1 className="font-display text-2xl font-semibold text-navy mb-2">Payment successful!</h1>
            <p className="text-slate mb-6">Taking you to your purchase…</p>
            <Link
              href={destination}
              className="text-gold hover:underline text-sm font-semibold"
            >
              Go now
            </Link>
          </>
        )}
        {pageStatus === "failed" && (
          <>
            <p className="text-red-500 mb-4">We couldn&apos;t confirm your payment.</p>
            <Link href="/cart" className="text-gold hover:underline text-sm font-semibold">
              Return to cart
            </Link>
          </>
        )}
      </div>
    </section>
  );
}