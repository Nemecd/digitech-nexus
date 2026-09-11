"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
import AddToCartButton from "@/components/AddToCartButton";

export default function CheckoutPage() {
  const { items, total, addItem } = useCart();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login?redirect=/checkout");
      else setEmail(data.user.email || "");
    });
  }, [router]);

  useEffect(() => {
    fetch("/api/products/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ excludeIds: items.map((i) => i.id) }),
    })
      .then((res) => res.json())
      .then((data) => setSuggestions(data.products || []));
  }, [items]);

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      window.location.href = data.authorization_url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-slate">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <>
      <section className="bg-white min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="font-display text-3xl font-semibold text-navy mb-8">Checkout</h1>

          <div className="rounded-2xl border border-line divide-y divide-line mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-5">
                <div>
                  <p className="font-medium text-navy">{item.title}</p>
                  <p className="text-xs text-slate">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold text-navy">₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <span className="text-slate">Total</span>
            <span className="font-display text-2xl font-semibold text-navy">₦{total.toLocaleString()}</span>
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button
            onClick={handlePay}
            disabled={loading || !email}
            className="w-full rounded-full bg-navy text-cream py-3.5 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors disabled:opacity-50"
          >
            {loading ? "Redirecting to payment…" : `Pay ₦${total.toLocaleString()} with Flutterwave`}
          </button>

          {suggestions.length > 0 && (
            <div className="mt-14 pt-10 border-t border-line">
              <h2 className="font-display text-lg font-semibold text-navy mb-5">You might also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestions.map((s) => (
                  <div key={s.id} className="rounded-xl border border-line p-4">
                    <p className="text-sm font-medium text-navy line-clamp-1">{s.title}</p>
                    <p className="text-xs text-slate capitalize mb-3">{s.type.replace("_", " ")}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gold">₦{Number(s.price).toLocaleString()}</span>
                      <AddToCartButton id={s.id} title={s.title} price={Number(s.price)} type={s.type} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

    </>
  );
}