import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { createClient } from "@/lib/supabase/server";
import {
  Fingerprint,
  Building2,
  GraduationCap,
  BookOpen,
  MonitorPlay,
  Plane,
} from "lucide-react";

export const revalidate = 60;

const categoryMeta: Record<string, { label: string; icon: any }> = {
  nin_service: { label: "NIN Services", icon: Fingerprint },
  cac_service: { label: "CAC Business Registration", icon: Building2 },
  visa_service: { label: "Visa Services", icon: Plane },
  student_placement: {
    label: "Overseas Student Placement",
    icon: GraduationCap,
  },
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

  const grouped: Record<string, typeof products> = {};
  products?.forEach((p) => {
    if (!grouped[p.type]) grouped[p.type] = [];
    grouped[p.type]!.push(p);
  });

  const categories = Object.keys(categoryMeta).filter(
    (key) => grouped[key]?.length,
  );

  return (
    <>
      <Navbar />

      <section className="relative bg-navy">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-cream">
            Browse everything we offer
          </h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl">
            Services, courses, and eBooks — add what you need to your cart and
            check out in one go.
          </p>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {categories.length === 0 && (
            <p className="text-center text-slate py-20">
              Our catalog is being updated — check back shortly.
            </p>
          )}

          {categories.map((catKey) => {
            const meta = categoryMeta[catKey];
            const items = grouped[catKey]!;
            return (
              <div key={catKey} className="mb-16 last:mb-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                    <meta.icon size={18} />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-navy">
                    {meta.label}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((p: any) => (
                    <div
                      key={p.id}
                      className="rounded-2xl bg-white border border-line p-6 shadow-sm hover:border-gold/50 hover:shadow-md transition-all flex flex-col"
                    >
                      {p.thumbnail_url ? (
                        <img
                          src={p.thumbnail_url}
                          alt={p.title}
                          className="w-full h-36 object-cover rounded-xl mb-4"
                        />
                      ) : (
                        <div className="w-full h-36 rounded-xl bg-cream flex items-center justify-center mb-4">
                          <meta.icon size={28} className="text-slate/40" />
                        </div>
                      )}
                      <h3 className="font-display font-semibold text-navy mb-2">
                        {p.title}
                      </h3>
                      <p className="text-sm text-slate flex-1">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between mt-6">
                        <span className="font-display text-lg font-semibold text-gold">
                          ₦{Number(p.price).toLocaleString()}
                        </span>
                        <AddToCartButton
                          id={p.id}
                          title={p.title}
                          price={Number(p.price)}
                          type={p.type}
                        />
                      </div>
                    </div>
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
