"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "../../actions";
import toast from "react-hot-toast";

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

export default function EditProductForm({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.set("productId", product.id);
    formData.set("type", product.type);
    try {
      await updateProduct(formData);
      toast.success("Product updated");
      router.push("/admin/products");
    } catch {
      toast.error("Could not update product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="rounded-2xl bg-white border border-line p-6 max-w-2xl space-y-4">
      <div>
        <label className="text-xs text-slate">Title</label>
        <input name="title" defaultValue={product.title} required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="text-xs text-slate">Description</label>
        <textarea name="description" defaultValue={product.description || ""} rows={3} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate">Price (₦)</label>
          <input name="price" type="number" defaultValue={product.price} required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate">Status</label>
          <select name="status" defaultValue={product.status} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm bg-white">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate">Thumbnail Image</label>
          {product.thumbnail_url && (
            <img src={product.thumbnail_url} alt="" className="w-16 h-16 rounded-lg object-cover mt-1 mb-2" />
          )}
          <input name="thumbnail" type="file" accept="image/*" className="w-full text-sm" />
          <p className="text-xs text-slate/70 mt-1">Leave empty to keep the current image.</p>
        </div>

        {product.type === "ebook" && (
          <div>
            <label className="text-xs text-slate">eBook File (PDF)</label>
            {product.file_url && (
              <p className="text-xs text-gold mt-1 mb-2">Current file: {product.file_url}</p>
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