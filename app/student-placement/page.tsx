import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { GraduationCap, FileCheck, UploadCloud, Bell, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function StudentPlacementPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("products")
    .select("id, title, description, price")
    .eq("type", "student_placement")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  const steps = [
    { icon: GraduationCap, title: "Choose a package", desc: "Pick the counselling or placement package that fits your goal." },
    { icon: UploadCloud, title: "Submit details & documents", desc: "Share your academic records and requirements." },
    { icon: FileCheck, title: "We guide the process", desc: "From university selection to visa support, we handle it with you." },
    { icon: Bell, title: "Get notified", desc: "Track your application progress on your dashboard." },
  ];

  return (
    <>
      <Navbar />

      <section className="relative bg-navy">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-14">
          <p className="text-xs text-cream/60 mb-3">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link> / Student Placement
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
            <GraduationCap size={14} /> OVERSEAS STUDENT PLACEMENT
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 text-cream max-w-2xl">
            Your path to studying abroad, guided end to end.
          </h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl">
            Course counselling, university selection, scholarships, visa support, and pre-departure guidance — all in one place.
          </p>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-navy mb-10 text-center">Available Packages</h2>

          {services && services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="rounded-2xl bg-white border border-line p-6 shadow-sm hover:border-gold/50 hover:shadow-md transition-all flex flex-col">
                  <h3 className="font-display font-semibold text-navy mb-2">{s.title}</h3>
                  <p className="text-sm text-slate flex-1">{s.description}</p>
                  <div className="flex items-center justify-between mt-6">
                    <span className="font-display text-lg font-semibold text-gold">
                      ₦{Number(s.price).toLocaleString()}
                    </span>
                    <Link
                      href="/register"
                      className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-cream hover:bg-gold hover:text-navy transition-colors inline-flex items-center gap-1"
                    >
                      Request <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center rounded-2xl border border-line bg-white p-12 max-w-lg mx-auto">
              <p className="text-slate">Our placement packages are being updated. Reach out and we&apos;ll get you sorted directly.</p>
              <Link href="/contact" className="text-gold hover:underline text-sm font-semibold mt-4 inline-block">
                Contact us →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-cream mb-12 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 text-gold flex items-center justify-center mx-auto mb-4">
                  <step.icon size={20} />
                </div>
                <p className="text-xs text-gold font-semibold mb-1">STEP {i + 1}</p>
                <h4 className="font-display font-semibold mb-1.5 text-cream">{step.title}</h4>
                <p className="text-sm text-cream/65">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="rounded-3xl bg-navy p-12 text-center">
            <h2 className="font-display text-3xl font-semibold mb-3 text-cream">Ready to start your journey abroad?</h2>
            <p className="text-cream/70 mb-8 max-w-lg mx-auto">
              Create an account to request a package, upload documents, and track your application.
            </p>
            <Link href="/register" className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy inline-flex items-center gap-2 hover:bg-gold/90 transition-colors">
              Create Account <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}