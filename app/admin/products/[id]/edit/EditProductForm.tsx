"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateProduct } from "../../actions";
import { uploadThumbnail, uploadEbook } from "@/lib/admin-uploads";
import { isBookingOnly } from "@/lib/booking-config";
import { FORM_TEMPLATES } from "@/lib/service-form-templates";

type Product = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  price: number;
  status: string;
  thumbnail_url: string | null;
  file_url: string | null;
};

export default function EditProductForm({
  product,
  formTemplate,
}: {
  product: Product;
  formTemplate: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const router = useRouter();
  const [template, setTemplate] = useState(formTemplate ?? "");

  // Services (NIN and CAC) each use their own request form
  const templatePrefix = product.type === "nin_service" ? "nin_" : product.type === "cac_service" ? "cac_" : null;
  const relevantTemplates = templatePrefix
    ? Object.entries(FORM_TEMPLATES).filter(([key]) => key.startsWith(templatePrefix))
    : [];

  const isEbook = product.type === "ebook";
  const bookingOnly = isBookingOnly(product.type);
  const shown = preview || product.thumbnail_url;
  // A book cover is 2:3 (portrait). Warn when the image is a noticeably different shape.
  const offRatio = isEbook && dims ? Math.abs(dims.w / dims.h - 2 / 3) > 0.07 : false;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const thumbnail = fd.get("thumbnail") as File | null;
    const ebook = fd.get("ebookFile") as File | null;

    setLoading(true);
    try {
      const thumbnailUrl = thumbnail && thumbnail.size > 0 ? await uploadThumbnail(thumbnail) : null;
      const fileUrl = isEbook && ebook && ebook.size > 0 ? await uploadEbook(ebook) : null;

      const result = await updateProduct({
        productId: product.id,
        title: String(fd.get("title") || ""),
        description: String(fd.get("description") || ""),
        price: bookingOnly ? Number(product.price) : Number(fd.get("price")),
        status: String(fd.get("status") || "published"),
        thumbnailUrl,
        fileUrl,
        formTemplate: templatePrefix ? template || null : undefined,
      });

      if (!result.success) throw new Error(result.error || "Could not update product");

      toast.success("Product updated");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not update product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-line p-6 max-w-2xl space-y-4">
      <div>
        <label className="text-xs text-slate">Title</label>
        <input name="title" defaultValue={product.title} required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="text-xs text-slate">Description</label>
        <textarea name="description" defaultValue={product.description || ""} rows={4} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <p className="text-xs text-slate/70 mt-1">Long descriptions are fine. Listings show three lines with a Read more button.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {!bookingOnly && (
          <div>
            <label className="text-xs text-slate">Price (₦)</label>
            <input name="price" type="number" defaultValue={product.price} required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
          </div>
        )}
        <div>
          <label className="text-xs text-slate">Status</label>
          <select name="status" defaultValue={product.status} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm bg-white">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {bookingOnly && (
        <p className="text-xs text-slate">
          NIN services are booked with the request form, so they have no price and no online payment.
        </p>
      )}

      {templatePrefix && (
        <div>
          <label className="text-xs text-slate">Request form</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm bg-white"
          >
            <option value="">Select which form this service needs</option>
            {relevantTemplates.map(([key, t]) => (
              <option key={key} value={key}>
                {t.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate/70 mt-1">
            This is the form customers fill in for this service. Each service should have its own.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate">{isEbook ? "Book cover" : "Thumbnail Image"}</label>

          {shown && isEbook && (
            <div className="mt-2 mb-2 relative w-24 aspect-[2/3] overflow-hidden rounded-md bg-cream ring-1 ring-black/10">
              <img
                src={shown}
                alt=""
                onLoad={(e) => setDims({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}
          {shown && !isEbook && (
            <img src={shown} alt="" className="w-16 h-16 rounded-lg object-cover mt-1 mb-2" />
          )}

          <input
            name="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setDims(null);
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
            className="w-full text-sm"
          />
          <p className="text-xs text-slate/70 mt-1">
            {isEbook
              ? "Portrait book-cover image, 2:3 ratio (for example 1200 x 1800 px). Leave empty to keep the current one."
              : "Leave empty to keep the current image."}
          </p>

          {offRatio && (
            <p className="mt-2 rounded-lg bg-gold/10 px-3 py-2 text-xs text-navy">
              This image isn&apos;t a 2:3 book-cover shape, so its edges are trimmed on the site. Upload a portrait
              cover to fix it.
            </p>
          )}
        </div>

        {isEbook && (
          <div>
            <label className="text-xs text-slate">eBook File (PDF)</label>
            {product.file_url && (
              <p className="text-xs text-gold mt-1 mb-2 break-all">Current file: {product.file_url}</p>
            )}
            <input name="ebookFile" type="file" accept=".pdf" className="w-full text-sm" />
            <p className="text-xs text-slate/70 mt-1">Leave empty to keep the current file.</p>
          </div>
        )}
      </div>

      <button
        disabled={loading}
        className="rounded-full bg-navy text-cream px-6 py-2.5 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
