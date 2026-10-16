import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DownloadButton from "../DownloadButton";
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";

export default async function OwnedProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ autodownload?: string }>;
}) {
  const { id } = await params;
  const { autodownload } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: item } = await supabase
    .from("user_products")
    .select("id, status, products(id, type, title, description, thumbnail_url)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!item) redirect("/dashboard/products");

  const product = item.products as any;

  if (product.type === "course") redirect(`/dashboard/courses/${product.id}`);
  if (product.type !== "ebook") redirect("/dashboard/products");

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/products" className="text-xs text-slate hover:text-gold inline-flex items-center gap-1 mb-6">
        <ArrowLeft size={14} /> My Products
      </Link>

      <div className="rounded-2xl bg-white border border-line p-6 md:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {product.thumbnail_url ? (
            <img src={product.thumbnail_url} alt={product.title} className="w-full sm:w-40 h-40 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-full sm:w-40 h-40 rounded-xl bg-cream flex items-center justify-center flex-shrink-0">
              <BookOpen size={36} className="text-slate/30" />
            </div>
          )}

          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold mb-2">
              <CheckCircle2 size={14} /> Purchased
            </p>
            <h1 className="font-display text-2xl font-semibold text-navy mb-2">{product.title}</h1>
            <p className="text-sm text-slate leading-relaxed">{product.description}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-line">
          {autodownload === "1" && (
            <p className="text-sm text-slate mb-4">
              Your download should start automatically. If it doesn&apos;t, use the button below.
            </p>
          )}
          <DownloadButton userProductId={item.id} autoStart={autodownload === "1"} large />
        </div>
      </div>
    </div>
  );
}