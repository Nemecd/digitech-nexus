"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { submitServiceRequest } from "../actions";

export default function ServiceRequestForm({
  userProductId, productId, orderId,
}: { userProductId: string; productId: string; orderId: string }) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

      await submitServiceRequest({ userProductId, productId, orderId, notes, documentPaths });
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
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
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

      <div>
        <label className="text-sm text-slate">Supporting documents</label>
        <label className="mt-1 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line py-8 cursor-pointer hover:border-gold/50 transition-colors">
          <UploadCloud size={22} className="text-slate" />
          <span className="text-xs text-slate">Click to upload files</span>
          <input type="file" multiple onChange={handleFileSelect} className="hidden" />
        </label>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-cream rounded-lg px-3 py-2">
                <span className="text-navy truncate">{f.name}</span>
                <button type="button" onClick={() => removeFile(i)}>
                  <X size={14} className="text-slate hover:text-red-500" />
                </button>
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