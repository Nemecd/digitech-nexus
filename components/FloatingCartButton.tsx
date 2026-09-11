"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart } from "lucide-react";

export default function FloatingCartButton() {
  const pathname = usePathname();
  const { count } = useCart();

  const hiddenOn = ["/cart", "/checkout", "/admin"];
  if (hiddenOn.some((p) => pathname.startsWith(p)) || count === 0) return null;

  const href = pathname.startsWith("/dashboard") ? "/dashboard/cart" : "/cart";

  return (
    <Link
      href={href}
      className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gold text-navy shadow-lg flex items-center justify-center"
    >
      <ShoppingCart size={22} />
      <span className="absolute -top-1 -right-1 bg-navy text-cream text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {count}
      </span>
    </Link>
  );
}