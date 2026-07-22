import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminServiceRequestsPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("service_requests")
    .select("id, status, created_at, products(title, type), profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Service Requests</h1>
      <div className="rounded-2xl bg-white border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-slate">
            <tr>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Submitted</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((r: any) => (
              <tr key={r.id} className="border-t border-line">
                <td className="px-5 py-3 text-navy font-medium">{r.profiles?.full_name}</td>
                <td className="px-5 py-3 text-slate">{r.products?.title}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold font-semibold capitalize">{r.status}</span>
                </td>
                <td className="px-5 py-3 text-slate text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/service-requests/${r.id}`} className="text-xs text-gold hover:underline font-semibold">
                    Review →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}