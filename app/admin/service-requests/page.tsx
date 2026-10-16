import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminServiceRequestsPage() {
  const supabase = await createClient();
  const { data: requests, error } = await supabase
    .from("service_requests")
    .select("id, status, created_at, products(title, type), profiles!service_requests_user_id_fkey(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Service Requests</h1>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-6 text-sm text-red-600">
          Could not load requests: {error.message}
        </div>
      )}

      <div className="rounded-2xl bg-white border border-line overflow-x-auto">
        <table className="responsive-table w-full text-sm">
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
                <td data-label="Customer" className="px-5 py-3 text-navy font-medium">
                  {r.profiles?.full_name || "—"}
                </td>
                <td data-label="Service" className="px-5 py-3 text-slate">{r.products?.title}</td>
                <td data-label="Status" className="px-5 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold font-semibold capitalize">
                    {r.status.replace("_", " ")}
                  </span>
                </td>
                <td data-label="Submitted" className="px-5 py-3 text-slate text-xs">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td data-label="" className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/service-requests/${r.id}`}
                    className="text-xs text-gold hover:underline font-semibold"
                  >
                    Review →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests?.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-slate">No service requests yet.</p>
        )}
      </div>
    </div>
  );
}