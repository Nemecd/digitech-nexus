import { createClient } from "@/lib/supabase/server";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, total_amount, payment_status, payment_method, created_at, profiles(full_name), order_items(quantity, products(title))")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Orders</h1>

      <div className="rounded-2xl bg-white border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-slate">
            <tr>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o: any) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-5 py-3 text-navy font-medium">{o.profiles?.full_name || "—"}</td>
                <td className="px-5 py-3 text-slate">
                  {o.order_items?.map((i: any) => i.products?.title).join(", ")}
                </td>
                <td className="px-5 py-3 text-slate">₦{Number(o.total_amount).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    o.payment_status === "paid" ? "bg-gold/10 text-gold" : "bg-red-50 text-red-500"
                  }`}>
                    {o.payment_status}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}