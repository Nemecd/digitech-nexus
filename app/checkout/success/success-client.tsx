"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function CheckoutSuccessClient() {
  const params = useSearchParams();
  const reference = params.get("reference");
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/payment/verify?reference=${reference}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data.status === "success") {
          setStatus("success");
          clearCart();
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [reference]);

  return (
    <>
      <Navbar />
      <section className="bg-white min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="animate-spin mx-auto text-gold mb-4" size={32} />
              <p className="text-slate">Confirming your payment…</p>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle2 className="mx-auto text-gold mb-4" size={40} />
              <h1 className="font-display text-2xl font-semibold text-navy mb-2">Payment successful!</h1>
              <p className="text-slate mb-6">Your order is confirmed. Check your dashboard for details.</p>
              <Link href="/dashboard/products" className="rounded-full bg-navy text-cream px-6 py-3 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors inline-block">
                Go to My Products
              </Link>
            </>
          )}
          {status === "failed" && (
            <>
              <p className="text-red-500 mb-4">We couldn&apos;t confirm your payment.</p>
              <Link href="/cart" className="text-gold hover:underline text-sm font-semibold">Return to cart</Link>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}