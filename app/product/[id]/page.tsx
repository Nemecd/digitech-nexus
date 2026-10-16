import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { BookOpen, MonitorPlay } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, type, title, description, price, thumbnail_url")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (!product) notFound();

  const FallbackIcon = product.type === "ebook" ? BookOpen : MonitorPlay;

  return (
    <>
      <Navbar />
      <section className="bg-white min-h-[70vh]">
        <div className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-start">
          {product.thumbnail_url ? (
            <img src={product.thumbnail_url} alt={product.title} className="w-full rounded-2xl object-cover aspect-square" />
          ) : (
            <div className="w-full rounded-2xl bg-cream flex items-center justify-center aspect-square">
              <FallbackIcon size={48} className="text-slate/30" />
            </div>
          )}

          <div>
            <span className="text-xs font-semibold text-gold uppercase tracking-wide">{product.type}</span>
            <h1 className="font-display text-3xl font-semibold text-navy mt-2 mb-4">{product.title}</h1>
            <p className="text-slate leading-relaxed mb-8">{product.description}</p>

            <div className="flex items-center justify-between rounded-2xl border border-line p-5">
              <span className="font-display text-2xl font-semibold text-gold">
                ₦{Number(product.price).toLocaleString()}
              </span>
              <AddToCartButton id={product.id} title={product.title} price={Number(product.price)} type={product.type} />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}