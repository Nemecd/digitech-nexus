"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { submitServiceRequest } from "../actions";
import { UploadCloud, X, Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { FORM_TEMPLATES, AnyField, RepeatableGroupField } from "@/lib/service-form-templates";

function isGroupField(f: AnyField): f is RepeatableGroupField {
  return f.type === "group";
}

export default function ServiceRequestForm({
  userProductId, productId, orderId, formTemplate, previewMode = false,
}: { userProductId: string; productId: string; orderId: string; formTemplate: string | null; previewMode?: boolean })  {
  const template = formTemplate ? FORM_TEMPLATES[formTemplate] : null;

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [groupValues, setGroupValues] = useState<Record<string, Record<string, string>[]>>(() => {
    const initial: Record<string, Record<string, string>[]> = {};
    template?.fields.forEach((f) => {
      if (isGroupField(f)) {
        initial[f.name] = Array.from({ length: f.minItems }, () => ({}));
      }
    });
    return initial;
  });
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  }
  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }
  function setField(name: string, value: string) {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  }
  function setGroupItemField(groupName: string, index: number, fieldName: string, value: string) {
    setGroupValues((prev) => {
      const items = [...(prev[groupName] || [])];
      items[index] = { ...items[index], [fieldName]: value };
      return { ...prev, [groupName]: items };
    });
  }
  function addGroupItem(groupName: string) {
    setGroupValues((prev) => ({ ...prev, [groupName]: [...(prev[groupName] || []), {}] }));
  }
  function removeGroupItem(groupName: string, index: number) {
    setGroupValues((prev) => ({
      ...prev,
      [groupName]: (prev[groupName] || []).filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
      if (previewMode) {
    toast.success("Preview only — nothing was submitted.");
    return;
  }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const documentPaths: string[] = [];
      for (const file of files) {
        const path = `${user.id}/${userProductId}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from("service-documents").upload(path, file);
        if (error) throw new Error(`Failed to upload ${file.name}`);
        documentPaths.push(path);
      }

      const formData = template
        ? { ...fieldValues, ...groupValues }
        : { notes };

      await submitServiceRequest({ userProductId, productId, orderId, formData, documentPaths });
      toast.success("Request submitted successfully");
      router.push("/dashboard/products");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      {template ? (
        template.fields.map((f) => {
          if (isGroupField(f)) {
            const items = groupValues[f.name] || [];
            return (
              <div key={f.name}>
                <label className="text-sm text-slate font-medium">{f.label}</label>
                <div className="space-y-4 mt-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-line p-4 relative">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-navy">{f.itemLabel} {idx + 1}</p>
                        {items.length > f.minItems && (
                          <button
                            type="button"
                            onClick={() => removeGroupItem(f.name, idx)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {f.fields.map((sub) => (
                          <div key={sub.name}>
                            <label className="text-xs text-slate">{sub.label}</label>
                            {sub.type === "select" ? (
                              <select
                                required
                                value={item[sub.name] || ""}
                                onChange={(e) => setGroupItemField(f.name, idx, sub.name, e.target.value)}
                                className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm bg-white"
                              >
                                <option value="">Select…</option>
                                {sub.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                              </select>
                            ) : (
                              <input
                                type={sub.type}
                                required
                                value={item[sub.name] || ""}
                                onChange={(e) => setGroupItemField(f.name, idx, sub.name, e.target.value)}
                                className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addGroupItem(f.name)}
                  className="mt-3 text-xs text-gold font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <Plus size={14} /> Add another {f.itemLabel}
                </button>
              </div>
            );
          }

          return (
            <div key={f.name}>
              <label className="text-sm text-slate">{f.label}</label>
              {f.type === "select" ? (
                <select
                  required
                  value={fieldValues[f.name] || ""}
                  onChange={(e) => setField(f.name, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line px-4 py-3 text-sm bg-white"
                >
                  <option value="">Select…</option>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type}
                  required
                  value={fieldValues[f.name] || ""}
                  onChange={(e) => setField(f.name, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line px-4 py-3 text-sm"
                />
              )}
            </div>
          );
        })
      ) : (
        <div>
          <label className="text-sm text-slate">Additional details</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            required
            placeholder="Tell us anything relevant to your request…"
            className="mt-1 w-full rounded-lg border border-line px-4 py-3 text-sm"
          />
        </div>
      )}

      <div>
        <label className="text-sm text-slate">Supporting documents</label>
        <p className="text-xs text-slate/70 mt-1 mb-2">{template?.fileHint || "Upload anything relevant to your request."}</p>
        <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line py-8 cursor-pointer hover:border-gold/50 transition-colors">
          <UploadCloud size={22} className="text-slate" />
          <span className="text-xs text-slate">Click to upload files</span>
          <input type="file" multiple onChange={handleFileSelect} className="hidden" />
        </label>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-cream rounded-lg px-3 py-2">
                <span className="text-navy truncate">{f.name}</span>
                <button type="button" onClick={() => removeFile(i)}><X size={14} className="text-slate hover:text-red-500" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-navy text-cream py-3.5 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : "Submit Request"}
      </button>
    </form>
  );
}