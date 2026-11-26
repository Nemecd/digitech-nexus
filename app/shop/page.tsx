import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Building2, Fingerprint, GraduationCap, MonitorPlay, Plane } from "lucide-react";

export const revalidate = 60;

const categoryMeta: Record<string, { label: string; note?: string; icon: any }> = {
  nin_service: { label: "NIN Services", note: "Booked with a short form. No online payment needed.", icon: Fingerprint },
  cac_service: { label: "CAC Business Registration", icon: Building2 },
  visa_service: { label: "Visa Services", icon: Plane },
  student_placement: { label: "Overseas Student Placement", icon: GraduationCap },
  course: { label: "DN Academy (Courses)", icon: MonitorPlay },
  ebook: { label: "eBooks", icon: BookOpen },
};

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, type, title, description, price, thumbnail_url")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  const grouped: Record<string, any[]> = {};
  (products ?? []).forEach((p: any) => {
    if (!grouped[p.type]) grouped[p.type] = [];
    grouped[p.type].push(p);
  });

  const categories = Object.keys(categoryMeta).filter((key) => grouped[key]?.length);

  return (
    <>
      <Navbar />

      <section className="relative bg-navy">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-cream">Browse everything we offer</h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl">
            Services, courses, and eBooks. Add what you need to your cart and check out in one go, or book a NIN
            service with a short form.
          </p>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {categories.length === 0 && (
            <p className="text-center text-slate py-20">Our catalog is being updated. Check back shortly.</p>
          )}

          {categories.map((catKey) => {
            const meta = categoryMeta[catKey];
            const items = grouped[catKey];
            return (
              <div key={catKey} className="mb-16 last:mb-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                    <meta.icon size={18} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-navy">{meta.label}</h2>
                    {meta.note && <p className="text-xs text-slate mt-0.5">{meta.note}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} returnTo="/shop" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </>
  );
}
