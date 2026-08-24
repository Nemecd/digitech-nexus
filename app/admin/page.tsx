import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShoppingCart, Users, Package, FileText, DollarSign, Send, ArrowRight } from "lucide-react";

export default async function AdminOverview() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalProducts },
    { data: paidOrders },
    { count: pendingRequests },
    { count: pendingWithdrawals },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("orders").select("total_amount").eq("payment_status", "paid"),
    supabase.from("service_requests").select("id", { count: "exact", head: true }).in("status", ["submitted", "in_review"]),
    supabase.from("withdrawals").select("id", { count: "exact", head: true }).eq("status", "requested"),
    supabase
      .from("orders")
      .select("id, total_amount, payment_status, created_at, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const totalRevenue = paidOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

  const stats = [
    { label: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign, href: "/admin/orders" },
    { label: "Total Users", value: totalUsers || 0, icon: Users, href: "/admin/users" },
    { label: "Published Products", value: totalProducts || 0, icon: Package, href: "/admin/products" },
    { label: "Pending Requests", value: pendingRequests || 0, icon: FileText, href: "/admin/service-requests" },
    { label: "Pending Withdrawals", value: pendingWithdrawals || 0, icon: Send, href: "/admin/withdrawals" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-1">Overview</h1>
      <p className="text-slate mb-8">A snapshot of what&apos;s happening across the platform.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl bg-white border border-line p-6 hover:border-gold/50 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-3">
              <s.icon size={18} />
            </div>
            <p className="text-xs text-slate">{s.label}</p>
            <p className="font-display text-2xl font-semibold text-navy mt-1">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-line">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-display font-semibold text-navy">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-gold hover:underline inline-flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="divide-y divide-line">
            {recentOrders.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between px-6 py-3.5">
                <div>
                  <p className="text-sm font-medium text-navy">{o.profiles?.full_name || "—"}</p>
                  <p className="text-xs text-slate">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-navy">₦{Number(o.total_amount).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    o.payment_status === "paid" ? "bg-gold/10 text-gold" : "bg-cream text-slate"
                  }`}>
                    {o.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-6 py-10 text-sm text-slate text-center">No orders yet.</p>
        )}
      </div>
    </div>
  );
}