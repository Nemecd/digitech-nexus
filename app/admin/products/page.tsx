import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "./actions";
import ProductForm from "./ProductForm";
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
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">
        Products
      </h1>

      <ProductForm />

      <div className="rounded-2xl bg-white border border-line overflow-hidden">
        <table className="w-full text-sm">
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
                <td className="px-5 py-3">
                  {p.thumbnail_url ? (
                    <img
                      src={p.thumbnail_url}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center">
                      <ImageIcon size={16} className="text-slate/50" />
                    </div>
                  )}
                </td>
                <td className="px-5 py-3 text-navy font-medium">{p.title}</td>
                <td className="px-5 py-3 text-slate">{p.type}</td>
                <td className="px-5 py-3 text-slate">
                  ₦{Number(p.price).toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold font-semibold">
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right space-x-3">
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
                  <form action={deleteProduct} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button className="text-xs text-red-500 hover:underline">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
