
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Wallet,
  Bell,
  User,
  ShieldCheck,
  Users,
  ShoppingCart,
} from "lucide-react";
import DashboardMobileNav from "@/components/DashboardMobileNav";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "My Products", icon: Package },
    // { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/affiliate", label: "Affiliate", icon: Users },
    { href: "/dashboard/cart", label: "Cart", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden flex bg-cream">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col fixed inset-y-0 left-0 z-40 w-60 h-screen bg-navy text-cream p-6 overflow-y-auto">

        <div className="font-display font-semibold text-lg mb-1">
          Digitech <span className="text-gold">Nexus</span>
        </div>

        <p className="text-xs text-cream/50 mb-8">
          {profile?.full_name || "Welcome"}
        </p>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream/80 hover:bg-white/10 hover:text-gold transition-colors"
            >
              <l.icon size={17} />
              {l.label}
            </Link>
          ))}
        </nav>

        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gold border border-gold/30 hover:bg-gold/10 transition-colors mt-4"
          >
            <ShieldCheck size={17} />
            Admin Panel
          </Link>
        )}

        <div className="mt-4">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-60 md:h-screen md:overflow-hidden">

        <DashboardMobileNav
          fullName={profile?.full_name || ""}
          isAdmin={profile?.role === "admin"}
        />

        <main className="flex-1 min-h-0 p-4 sm:p-6 md:p-8 overflow-x-auto md:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
