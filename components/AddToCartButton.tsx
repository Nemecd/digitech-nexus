"use client";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({
  id, title, price, type,
}: { id: string; title: string; price: number; type: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id, title, price, type });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-cream hover:bg-gold hover:text-navy transition-colors inline-flex items-center gap-1.5"
    >
      {added ? <><Check size={14} /> Added</> : <><ShoppingCart size={14} /> Add to Cart</>}
    </button>
  );
}