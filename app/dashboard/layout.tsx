import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LayoutDashboard, Package, Wallet, Bell, User, ShieldCheck } from "lucide-react";
import DashboardMobileNav from "@/components/DashboardMobileNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "My Products", icon: Package },
    { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-60 bg-navy text-cream flex-shrink-0 p-6 hidden md:flex md:flex-col">
        <div className="font-display font-semibold text-lg mb-1">
          Digitech <span className="text-gold">Nexus</span>
        </div>
        <p className="text-xs text-cream/50 mb-8">{profile?.full_name || "Welcome"}</p>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream/80 hover:bg-white/10 hover:text-gold transition-colors"
            >
              <l.icon size={17} /> {l.label}
            </Link>
          ))}
        </nav>

        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gold border border-gold/30 hover:bg-gold/10 transition-colors mt-4"
          >
            <ShieldCheck size={17} /> Admin Panel
          </Link>
        )}
      </aside>

      <div className="flex-1 flex flex-col">
        <DashboardMobileNav fullName={profile?.full_name || ""} isAdmin={profile?.role === "admin"} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}