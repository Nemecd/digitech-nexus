"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Loader2 } from "lucide-react";
import { FORM_TEMPLATES } from "@/lib/service-form-templates";
import { uploadThumbnail, uploadEbook } from "@/lib/admin-uploads";
import { createProduct } from "./actions";

export default function ProductForm() {
  const [type, setType] = useState("nin_service");
  const [loading, setLoading] = useState(false);

  const relevantTemplates = Object.entries(FORM_TEMPLATES).filter(([key]) =>
    type === "nin_service" ? key.startsWith("nin_") : type === "cac_service" ? key.startsWith("cac_") : false
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const thumbnail = fd.get("thumbnail") as File | null;
    const ebook = fd.get("ebookFile") as File | null;

    if (type === "ebook" && (!ebook || ebook.size === 0)) {
      toast.error("Please attach the eBook PDF.");
      return;
    }

    setLoading(true);
    try {
      // Files go straight from the browser to storage; the server only gets their paths
      const thumbnailUrl = thumbnail && thumbnail.size > 0 ? await uploadThumbnail(thumbnail) : null;
      const fileUrl = type === "ebook" && ebook && ebook.size > 0 ? await uploadEbook(ebook) : null;

      const result = await createProduct({
        type,
        title: String(fd.get("title") || ""),
        description: String(fd.get("description") || ""),
        price: Number(fd.get("price")),
        thumbnailUrl,
        fileUrl,
        formTemplate: (fd.get("formTemplate") as string) || null,
      });

      if (!result.success) throw new Error(result.error || "Could not create product");

      toast.success("Product added");
      form.reset();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-line p-6 mb-10 space-y-4">
      <div className="grid md:grid-cols-5 gap-3 items-end">
        <div className="md:col-span-1">
          <label className="text-xs text-slate">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
          >
            <option value="nin_service">NIN Service</option>
            <option value="cac_service">CAC Service</option>
            <option value="visa_service">Visa Service</option>
            <option value="student_placement">Student Placement</option>
            <option value="course">Course</option>
            <option value="ebook">eBook</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-slate">Title</label>
          <input name="title" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-slate">Price (₦)</label>
          <input name="price" type="number" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-navy text-cream px-4 py-2 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Plus size={16} /> Add</>}
        </button>
      </div>

      <div>
        <label className="text-xs text-slate">Description</label>
        <textarea name="description" rows={2} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
      </div>

      {(type === "nin_service" || type === "cac_service") && (
        <div>
          <label className="text-xs text-slate">Request Form Template</label>
          <select name="formTemplate" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm bg-white">
            <option value="">Select which form this service needs</option>
            {relevantTemplates.map(([key, t]) => (
              <option key={key} value={key}>{t.label}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate">Thumbnail Image</label>
          <input name="thumbnail" type="file" accept="image/*" className="mt-1 w-full text-sm" />
        </div>

        {type === "ebook" && (
          <div>
            <label className="text-xs text-slate">eBook File (PDF)</label>
            <input name="ebookFile" type="file" accept=".pdf" className="mt-1 w-full text-sm" />
          </div>
        )}
      </div>

      {type === "course" && (
        <p className="text-xs text-slate">
          Save this course first, then use &quot;Manage Lessons&quot; in the table below to add video lessons.
        </p>
      )}
    </form>
  );
}