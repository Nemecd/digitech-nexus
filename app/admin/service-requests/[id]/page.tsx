import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateRequestStatus } from "./actions";
import { FileText } from "lucide-react";

export default async function AdminServiceRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("service_requests")
    .select("id, status, form_data, document_urls, admin_notes, created_at, products(title), profiles(full_name, phone)")
    .eq("id", id)
    .single();

  if (!request) return <p className="text-slate">Request not found.</p>;

  const admin = createAdminClient();
  const documentLinks = await Promise.all(
    (request.document_urls || []).map(async (path: string) => {
      const { data } = await admin.storage.from("service-documents").createSignedUrl(path, 3600);
      return { path, url: data?.signedUrl };
    })
  );

  const customer = request.profiles as any;
  const product = request.products as any;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-navy mb-1">{product?.title}</h1>
      <p className="text-slate mb-8">{customer?.full_name} · {customer?.phone}</p>

      <div className="rounded-2xl bg-white border border-line p-6 mb-6">
        <h3 className="font-display font-semibold text-navy mb-2">Details Submitted</h3>
        <p className="text-sm text-slate whitespace-pre-wrap">{(request.form_data as any)?.notes || "—"}</p>
      </div>

      <div className="rounded-2xl bg-white border border-line p-6 mb-6">
        <h3 className="font-display font-semibold text-navy mb-3">Documents</h3>
        {documentLinks.length > 0 ? (
          <div className="space-y-2">
            {documentLinks.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gold hover:underline">
                <FileText size={14} /> Document {i + 1}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate">No documents uploaded.</p>
        )}
      </div>

      <div className="rounded-2xl bg-white border border-line p-6">
        <h3 className="font-display font-semibold text-navy mb-4">Update Status</h3>
        <form action={updateRequestStatus} className="space-y-3">
          <input type="hidden" name="requestId" value={request.id} />
          <select name="status" defaultValue={request.status} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm bg-white">
            <option value="submitted">Submitted</option>
            <option value="in_review">In Review</option>
            <option value="awaiting_docs">Awaiting Documents</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <textarea
            name="adminNotes"
            defaultValue={request.admin_notes || ""}
            rows={3}
            placeholder="Internal notes (optional)"
            className="w-full rounded-lg border border-line px-3 py-2.5 text-sm"
          />
          <button className="w-full rounded-full bg-navy text-cream py-2.5 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors">
            Update Status
          </button>
        </form>
      </div>
    </div>
  );
}