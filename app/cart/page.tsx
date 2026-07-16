"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  return (
    <>
      <Navbar />
      <section className="relative bg-white min-h-[60vh]">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
          <h1 className="font-display text-3xl font-semibold text-navy mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-line">
              <p className="text-slate mb-4">Your cart is empty.</p>
              <Link href="/shop" className="text-gold font-semibold hover:underline">
                Browse the shop →
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-line divide-y divide-line">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-5">
                    <div>
                      <p className="font-medium text-navy">{item.title}</p>
                      <p className="text-xs text-slate capitalize">{item.type.replace("_", " ")}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border border-line rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={14} className="text-slate" />
                        </button>
                        <span className="text-sm w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={14} className="text-slate" />
                        </button>
                      </div>

                      <span className="font-semibold text-navy w-24 text-right">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>

                      <button onClick={() => removeItem(item.id)} aria-label="Remove">
                        <Trash2 size={16} className="text-red-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8">
                <span className="text-slate">Total</span>
                <span className="font-display text-2xl font-semibold text-navy">
                  ₦{total.toLocaleString()}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 w-full rounded-full bg-navy text-cream py-3.5 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}