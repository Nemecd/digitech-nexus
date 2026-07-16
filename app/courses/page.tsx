import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MonitorPlay, PlayCircle, Award, Users, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("products")
    .select("id, title, description, price, metadata")
    .eq("type", "course")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  const perks = [
    { icon: PlayCircle, title: "Video Lessons", desc: "Learn at your own pace with structured video content." },
    { icon: Award, title: "Certificates", desc: "Earn a certificate on completion of every course." },
    { icon: Users, title: "Community", desc: "Join discussions with fellow students." },
  ];

  return (
    <>
      <Navbar />

      <section className="relative bg-navy">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-14">
          <p className="text-xs text-cream/60 mb-3">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link> / Courses
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
            <MonitorPlay size={14} /> DN ACADEMY
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 text-cream max-w-2xl">
            Practical courses to build real skills.
          </h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl">
            From NIN & CAC masterclasses to digital skills and business growth training.
          </p>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-navy mb-10 text-center">All Courses</h2>

          {courses && courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <div key={c.id} className="rounded-2xl bg-white border border-line p-6 shadow-sm hover:border-gold/50 hover:shadow-md transition-all flex flex-col">
                  <h3 className="font-display font-semibold text-navy mb-2">{c.title}</h3>
                  <p className="text-sm text-slate flex-1">{c.description}</p>
                  <div className="flex items-center justify-between mt-6">
                    <span className="font-display text-lg font-semibold text-gold">
                      ₦{Number(c.price).toLocaleString()}
                    </span>
                    <AddToCartButton id={c.id} title={c.title} price={Number(c.price)} type="course" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center rounded-2xl border border-line bg-white p-12 max-w-lg mx-auto">
              <p className="text-slate">Our course catalog is being updated. Check back shortly.</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-cream mb-12 text-center">What You Get</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {perks.map((p) => (
              <div key={p.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 text-gold flex items-center justify-center mx-auto mb-4">
                  <p.icon size={20} />
                </div>
                <h4 className="font-display font-semibold mb-1.5 text-cream">{p.title}</h4>
                <p className="text-sm text-cream/65">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="rounded-3xl bg-navy p-12 text-center">
            <h2 className="font-display text-3xl font-semibold mb-3 text-cream">Start learning today</h2>
            <p className="text-cream/70 mb-8 max-w-lg mx-auto">
              Add a course to your cart and get lifetime access once you check out.
            </p>
            <Link href="/shop" className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy inline-flex items-center gap-2 hover:bg-gold/90 transition-colors">
              Browse Shop <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}