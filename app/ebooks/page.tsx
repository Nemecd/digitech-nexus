import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BookOpen, Download, ShieldCheck, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function EbooksPage() {
  const supabase = await createClient();
  const { data: ebooks } = await supabase
    .from("products")
    .select("id, title, description, price")
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
            Guides, templates, and resources — instant access.
          </h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl">
            Purchase once, download securely from your dashboard anytime.
          </p>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          {ebooks && ebooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((e) => (
                <div key={e.id} className="rounded-2xl bg-white border border-line p-6 shadow-sm hover:border-gold/50 hover:shadow-md transition-all flex flex-col">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
                    <BookOpen size={18} />
                  </div>
                  <h3 className="font-display font-semibold text-navy mb-2">{e.title}</h3>
                  <p className="text-sm text-slate flex-1">{e.description}</p>
                  <div className="flex items-center justify-between mt-6">
                    <span className="font-display text-lg font-semibold text-gold">
                      ₦{Number(e.price).toLocaleString()}
                    </span>
                    <AddToCartButton id={e.id} title={e.title} price={Number(e.price)} type="ebook" />
                  </div>
                </div>
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
            <Download size={16} className="text-gold" /> Every purchase unlocks a download from your dashboard — no waiting, no shipping.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}