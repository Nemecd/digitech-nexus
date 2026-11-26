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
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="relative w-32 sm:w-36 aspect-[2/3] flex-shrink-0 overflow-hidden rounded-md bg-navy shadow-xl ring-1 ring-black/10">
            {product.thumbnail_url ? (
              <img src={product.thumbnail_url} alt={product.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen size={32} className="text-gold/70" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent" />
          </div>

          <div className="text-center sm:text-left">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold mb-2">
              <CheckCircle2 size={14} /> Purchased
            </p>
            <h1 className="font-display text-2xl font-semibold text-navy mb-2">{product.title}</h1>
            <p className="text-sm text-slate leading-relaxed whitespace-pre-wrap">{product.description}</p>
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
