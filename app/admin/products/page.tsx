import { createClient } from "@/lib/supabase/server";
import ProductForm from "./ProductForm";
import DeleteProductButton from "./DeleteProductButton";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, type, title, price, status, thumbnail_url")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Products</h1>

      <ProductForm />

      <div className="rounded-2xl bg-white border border-line overflow-x-auto">
        <table className="responsive-table w-full text-sm">
          <thead className="bg-cream text-left text-slate">
            <tr>
              <th className="px-5 py-3 font-medium"></th>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="mobile-hidden px-5 py-3">
                  {p.thumbnail_url ? (
                    <img src={p.thumbnail_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center">
                      <ImageIcon size={16} className="text-slate/50" />
                    </div>
                  )}
                </td>
                <td data-label="Title" className="px-5 py-3 text-navy font-medium">{p.title}</td>
                <td data-label="Type" className="px-5 py-3 text-slate">{p.type}</td>
                <td data-label="Price" className="px-5 py-3 text-slate">₦{Number(p.price).toLocaleString()}</td>
                <td data-label="Status" className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      p.status === "published" ? "bg-gold/10 text-gold" : "bg-cream text-slate"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td data-label="" className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-xs text-navy hover:text-gold hover:underline font-semibold"
                  >
                    Edit
                  </Link>
                  {p.type === "course" && (
                    <Link
                      href={`/admin/products/${p.id}/lessons`}
                      className="text-xs text-gold hover:underline font-semibold"
                    >
                      Manage Lessons
                    </Link>
                  )}
                  <DeleteProductButton productId={p.id} title={p.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!products || products.length === 0) && (
          <p className="px-5 py-10 text-center text-sm text-slate">No products yet.</p>
        )}
      </div>
    </div>
  );
}