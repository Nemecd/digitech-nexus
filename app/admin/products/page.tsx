import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Plus } from "lucide-react";

async function createProduct(formData: FormData) {
  "use server";
  const supabase = await createClient();

  await supabase.from("products").insert({
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    status: "published",
  });

  revalidatePath("/admin/products");
}

async function deleteProduct(formData: FormData) {
  "use server";
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", formData.get("id"));
  revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, type, title, price, status")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Products</h1>

      {/* Quick-add form */}
      <form action={createProduct} className="rounded-2xl bg-white border border-line p-6 mb-10 grid md:grid-cols-5 gap-3 items-end">
        <div className="md:col-span-1">
          <label className="text-xs text-slate">Type</label>
          <select name="type" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm">
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
        <button type="submit" className="rounded-lg bg-navy text-cream px-4 py-2 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center justify-center gap-1.5">
          <Plus size={16} /> Add
        </button>
        <div className="md:col-span-5">
          <label className="text-xs text-slate">Description</label>
          <textarea name="description" rows={2} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
      </form>

      {/* Products table */}
      <div className="rounded-2xl bg-white border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-slate">
            <tr>
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
                <td className="px-5 py-3 text-navy font-medium">{p.title}</td>
                <td className="px-5 py-3 text-slate">{p.type}</td>
                <td className="px-5 py-3 text-slate">₦{Number(p.price).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gold/10 text-gold font-semibold">{p.status}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="text-xs text-red-500 hover:underline">Delete</button>
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