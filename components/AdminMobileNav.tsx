"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Package, ShoppingCart, Users, DollarSign, Send, FileText, Mail } from "lucide-react";
import SignOutButton from "./SignOutButton";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/commissions", label: "Commissions", icon: DollarSign },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: Send },
  { href: "/admin/service-requests", label: "Service Requests", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="sticky top-0 z-40 flex items-center justify-between bg-navy text-cream px-5 py-3">
        <span className="font-display font-semibold text-sm">
          Digitech <span className="text-gold">Admin</span>
        </span>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-navy/98 flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="font-display font-semibold text-cream">
              Digitech <span className="text-gold">Admin</span>
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={22} className="text-cream" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-cream/85 hover:bg-white/10 hover:text-gold transition-colors"
              >
                <l.icon size={18} /> {l.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4">
            <SignOutButton className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-cream/85 hover:bg-white/10 hover:text-gold transition-colors" />
          </div>
        </div>
      )}
    </div>
  );
}