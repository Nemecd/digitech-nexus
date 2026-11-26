import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Download, ShieldCheck } from "lucide-react";

export const revalidate = 60;

export default async function EbooksPage() {
  const supabase = await createClient();
  const { data: ebooks } = await supabase
    .from("products")
    .select("id, type, title, description, price, thumbnail_url")
    .eq("type", "ebook")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  return (
    <>
      <Navbar />

      <section className="relative bg-navy">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-14">
          <p className="text-xs text-cream/60 mb-3">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link> / eBooks
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
            <BookOpen size={14} /> EBOOK MARKETPLACE
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 text-cream max-w-2xl">
            Guides, templates, and resources, with instant access.
          </h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl">
            Purchase once, download securely from your dashboard anytime.
          </p>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          {ebooks && ebooks.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {ebooks.map((e, i) => (
                <Reveal key={e.id} delay={i * 60}>
                  <ProductCard product={e} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center rounded-2xl border border-line bg-white p-12 max-w-lg mx-auto">
              <p className="text-slate">Our eBook catalog is being updated. Check back shortly.</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-2 text-gold text-xs font-semibold mb-3">
            <ShieldCheck size={14} /> SECURE, INSTANT ACCESS
          </div>
          <p className="text-cream/70 max-w-xl mx-auto flex items-center justify-center gap-2">
            <Download size={16} className="text-gold flex-shrink-0" /> Every purchase unlocks a download from your
            dashboard. No waiting, no shipping.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
