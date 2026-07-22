import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, DollarSign, Send, FileText } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/commissions", label: "Commissions", icon: DollarSign },
{ href: "/admin/withdrawals", label: "Withdrawals", icon: Send },
{ href: "/admin/service-requests", label: "Service Requests", icon: FileText },
  ];

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-60 bg-navy text-cream flex-shrink-0 p-6">
        <div className="font-display font-semibold text-lg mb-10">
          Digitech <span className="text-gold">Admin</span>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream/80 hover:bg-white/10 hover:text-gold transition-colors"
            >
              <l.icon size={17} /> {l.label}
            </Link>
          ))}
          <SignOutButton />
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}