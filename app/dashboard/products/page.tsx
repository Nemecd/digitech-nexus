import { createClient } from "@/lib/supabase/server";
import DownloadButton from "./DownloadButton";
import Link from "next/link";

export default async function MyProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: items } = await supabase
    .from("user_products")
    .select("id, status, acquired_at, products(id, title, type)")
    .eq("user_id", user!.id)
    .order("acquired_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-6">My Products</h1>

      {items && items.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item: any) => (
            <div key={item.id} className="rounded-2xl bg-white border border-line p-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-navy">{item.products?.title}</p>
                <p className="text-xs text-slate capitalize">{item.products?.type?.replace("_", " ")} · {item.status}</p>
              </div>

              {item.products?.type === "ebook" && item.status === "active" && (
                <DownloadButton userProductId={item.id} />
              )}
              {item.products?.type === "course" && item.status === "active" && (
                <Link href={`/dashboard/courses/${item.products.id}`} className="rounded-full bg-navy text-cream px-4 py-2 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors">
                  Continue Learning
                </Link>
              )}
              {(item.status === "pending" || item.status === "in_review") && (
                <span className="text-xs px-3 py-1.5 rounded-full bg-gold/10 text-gold font-semibold">Awaiting Details</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate">Nothing here yet. <Link href="/shop" className="text-gold hover:underline">Browse the shop</Link></p>
      )}
    </div>
  );
}