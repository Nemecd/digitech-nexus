"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Package, Wallet, Bell, User, ShieldCheck } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "My Products", icon: Package },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardMobileNav({
  fullName,
  isAdmin,
}: {
  fullName: string;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="sticky top-0 z-40 flex items-center justify-between bg-navy text-cream px-5 py-3">
        <div>
          <span className="font-display font-semibold text-sm">
            Digitech <span className="text-gold">Nexus</span>
          </span>
          <p className="text-xs text-cream/50">{fullName || "Welcome"}</p>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-navy/98 flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="font-display font-semibold text-cream">
              Digitech <span className="text-gold">Nexus</span>
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

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gold border border-gold/30 hover:bg-gold/10 transition-colors mt-4"
              >
                <ShieldCheck size={18} /> Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}