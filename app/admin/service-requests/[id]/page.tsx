import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateRequestStatus } from "./actions";
import { FileText } from "lucide-react";

export default async function AdminServiceRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("service_requests")
    .select(
      "id, status, form_data, document_urls, admin_notes, admin_request_note, created_at, products(title), profiles(full_name, phone)",
    )
    .eq("id", id)
    .single();

  if (!request) return <p className="text-slate">Request not found.</p>;

  const { data: updates } = await supabase
    .from("service_request_updates")
    .select("id, notes, document_urls, created_at")
    .eq("service_request_id", id)
    .order("created_at", { ascending: true });

  const admin = createAdminClient();

  const documentLinks = await Promise.all(
    (request.document_urls || []).map(async (path: string) => {
      const { data } = await admin.storage
        .from("service-documents")
        .createSignedUrl(path, 3600);
      return { path, url: data?.signedUrl };
    }),
  );

  const updateLinks = await Promise.all(
    (updates || []).map(async (u) => ({
      ...u,
      links: await Promise.all(
        (u.document_urls || []).map(async (path: string) => {
          const { data } = await admin.storage
            .from("service-documents")
            .createSignedUrl(path, 3600);
          return { path, url: data?.signedUrl };
        }),
      ),
    })),
  );

  const customer = request.profiles as any;
  const product = request.products as any;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-navy mb-1">
        {product?.title}
      </h1>
      <p className="text-slate mb-8">
        {customer?.full_name} · {customer?.phone}
      </p>

      <div className="rounded-2xl bg-white border border-line p-6 mb-6">
        <h3 className="font-display font-semibold text-navy mb-3">
          Details Submitted
        </h3>
        {request.form_data &&
        Object.keys(request.form_data as any).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(request.form_data as Record<string, any>).map(
              ([key, value]) => {
                if (Array.isArray(value)) {
                  return (
                    <div key={key}>
                      <p className="text-xs font-semibold text-gold uppercase tracking-wide mb-2">
                        {key.replace(/_/g, " ")}
                      </p>
                      <div className="space-y-3">
                        {value.map(
                          (item: Record<string, string>, i: number) => (
                            <div key={i} className="rounded-lg bg-cream p-3">
                              <p className="text-xs font-semibold text-navy mb-1.5">
                                #{i + 1}
                              </p>
                              <dl className="space-y-1">
                                {Object.entries(item).map(([k, v]) => (
                                  <div
                                    key={k}
                                    className="flex justify-between text-xs"
                                  >
                                    <dt className="text-slate capitalize">
                                      {k.replace(/_/g, " ")}
                                    </dt>
                                    <dd className="text-navy font-medium">
                                      {v || "—"}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:justify-between text-sm border-b border-line/50 pb-2"
                  >
                    <dt className="text-slate capitalize">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="text-navy font-medium">{value || "—"}</dd>
                  </div>
                );
              },
            )}
          </div>
        ) : (
          <p className="text-sm text-slate">No details submitted.</p>
        )}
      </div>

      {updateLinks.length > 0 && (
        <div className="rounded-2xl bg-white border border-line p-6 mb-6">
          <h3 className="font-display font-semibold text-navy mb-4">
            Customer Resubmissions
          </h3>
          <div className="space-y-5">
            {updateLinks.map((u, idx) => (
              <div
                key={u.id}
                className={idx > 0 ? "pt-4 border-t border-line" : ""}
              >
                <p className="text-xs text-slate mb-1">
                  {new Date(u.created_at).toLocaleString()}
                </p>
                {u.notes && (
                  <p className="text-sm text-slate mb-2">{u.notes}</p>
                )}
                {u.links.map((d, i) => (
                  <a
                    key={i}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gold hover:underline"
                  >
                    <FileText size={14} /> Document {i + 1}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-line p-6">
        <h3 className="font-display font-semibold text-navy mb-4">
          Update Status
        </h3>
        <form action={updateRequestStatus} className="space-y-3">
          <input type="hidden" name="requestId" value={request.id} />
          <select
            name="status"
            defaultValue={request.status}
            className="w-full rounded-lg border border-line px-3 py-2.5 text-sm bg-white"
          >
            <option value="submitted">Submitted</option>
            <option value="in_review">In Review</option>
            <option value="awaiting_docs">Awaiting Documents</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <div>
            <label className="text-xs text-slate">
              Note to customer (shown if status is &quot;Awaiting
              Documents&quot;)
            </label>
            <textarea
              name="adminRequestNote"
              defaultValue={request.admin_request_note || ""}
              rows={2}
              placeholder="e.g. Please upload a clearer photo of your ID card"
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm mt-1"
            />
          </div>
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
