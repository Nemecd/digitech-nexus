import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Wallet, Package, Clock, ArrowRight } from "lucide-react";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, wallet_balance")
    .eq("id", user!.id)
    .single();

  const { data: userProducts } = await supabase
    .from("user_products")
    .select("id, status, acquired_at, products(title, type)")
    .eq("user_id", user!.id)
    .order("acquired_at", { ascending: false })
    .limit(5);

  const pendingCount = userProducts?.filter((p) => p.status === "pending" || p.status === "in_review").length || 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">
        Welcome back, {profile?.full_name?.split(" ")[0] || "there"}
      </h1>
      <p className="text-slate mt-1">Here's what's happening with your account.</p>

      {/* Quick stats */}
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="rounded-2xl bg-white border border-line p-6">
          <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-3">
            <Wallet size={18} />
          </div>
          <p className="text-xs text-slate">Wallet Balance</p>
          <p className="font-display text-2xl font-semibold text-navy mt-1">
            ₦{Number(profile?.wallet_balance || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-line p-6">
          <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-3">
            <Package size={18} />
          </div>
          <p className="text-xs text-slate">Total Products</p>
          <p className="font-display text-2xl font-semibold text-navy mt-1">{userProducts?.length || 0}</p>
        </div>

        <div className="rounded-2xl bg-white border border-line p-6">
          <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-3">
            <Clock size={18} />
          </div>
          <p className="text-xs text-slate">Pending Requests</p>
          <p className="font-display text-2xl font-semibold text-navy mt-1">{pendingCount}</p>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl bg-white border border-line mt-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-display font-semibold text-navy">Recent Activity</h2>
          <Link href="/dashboard/products" className="text-xs text-gold hover:underline inline-flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {userProducts && userProducts.length > 0 ? (
          <div className="divide-y divide-line">
            {userProducts.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-navy">{p.products?.title}</p>
                  <p className="text-xs text-slate mt-0.5">{p.products?.type?.replace("_", " ")}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold/10 text-gold font-semibold capitalize">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate">You haven't purchased or requested anything yet.</p>
            <Link href="/" className="text-gold hover:underline text-sm font-semibold mt-2 inline-block">
              Explore services →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}