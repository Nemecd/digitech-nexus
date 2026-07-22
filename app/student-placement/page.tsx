import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { GraduationCap, FileCheck, UploadCloud, Bell, ArrowRight, ShieldCheck, Plane, Award } from "lucide-react";

export const revalidate = 60;

export default async function StudentPlacementPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("products")
    .select("id, title, description, price, thumbnail_url")
    .eq("type", "student_placement")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  const steps = [
    { icon: GraduationCap, title: "Free consultation", desc: "We assess your goals, budget, and academic background to recommend the right path." },
    { icon: UploadCloud, title: "Submit documents", desc: "Upload transcripts, certificates, and required documentation securely." },
    { icon: FileCheck, title: "Admission & visa support", desc: "We guide your application, admission, and visa process end to end." },
    { icon: Bell, title: "Relocation support", desc: "From pre-departure orientation to settling in, we stay with you." },
  ];

  const destinations = ["🇬🇧 United Kingdom", "🇨🇦 Canada", "🇺🇸 United States", "🇦🇺 Australia", "🇪🇺 Europe", "🇮🇪 Ireland", "🇳🇿 New Zealand"];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-navy">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-14">
          <p className="text-xs text-cream/60 mb-3">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link> / Student Placement
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
            <Plane size={14} /> DNT EDUTRAVEL NIG. LTD
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 text-cream max-w-2xl">
            Study abroad with confidence and clarity.
          </h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl">
            A trusted education travel and student recruitment agency helping Nigerian and African students access quality international education — from choosing a university to relocating and settling in.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/register" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold/90 transition-colors inline-flex items-center gap-2">
              Book a Free Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Credibility strip */}
      <section className="relative bg-white border-b border-line">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          <div className="flex items-center gap-2 text-navy text-sm font-medium">
            <ShieldCheck size={18} className="text-gold" /> British Council Certified Education Agent
          </div>
          <div className="flex items-center gap-2 text-navy text-sm font-medium">
            <Award size={18} className="text-gold" /> Strategic Partnership with ApplyBoard
          </div>
        </div>
      </section>

      {/* About DNT */}
      <section className="relative bg-white">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <span className="inline-block rounded-full bg-gold/10 text-gold text-xs font-semibold px-4 py-1.5 tracking-wide mb-4">
            ABOUT DNT EDUTRAVEL
          </span>
          <p className="text-slate text-lg leading-relaxed">
            DNT Edutravel Nig. Ltd was founded to help Nigerian and African students access quality international education with confidence. We provide personalized guidance throughout the entire study abroad journey — from choosing the right country, university, and course, to securing admission, processing visas, and supporting students as they relocate and settle into their new environment.
          </p>
          <p className="text-slate text-lg leading-relaxed mt-4">
            We believe studying abroad should be exciting, not overwhelming — so we simplify every step, ensuring you make informed decisions with the support you need to succeed.
          </p>
        </div>
      </section>

      {/* Services / packages */}
      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-cream mb-10 text-center">Available Packages</h2>

          {services && services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-gold/40 transition-colors flex flex-col">
                  {s.thumbnail_url ? (
                    <img src={s.thumbnail_url} alt={s.title} className="w-full h-36 object-cover rounded-xl mb-4" />
                  ) : (
                    <div className="w-full h-36 rounded-xl bg-cream flex items-center justify-center mb-4">
                      <GraduationCap size={28} className="text-slate/40" />
                    </div>
                  )}
                  <h3 className="font-display font-semibold text-cream mb-2">{s.title}</h3>
                  <p className="text-sm text-cream/65 flex-1">{s.description}</p>
                  <div className="flex items-center justify-between mt-6">
                    <span className="font-display text-lg font-semibold text-gold">
                      ₦{Number(s.price).toLocaleString()}
                    </span>
                    <Link
                      href="/register"
                      className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy hover:bg-gold/90 transition-colors inline-flex items-center gap-1"
                    >
                      <AddToCartButton id={s.id} title={s.title} price={Number(s.price)} type="nin_service" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center rounded-2xl border border-white/10 bg-white/5 p-12 max-w-lg mx-auto">
              <p className="text-cream/70">Our placement packages are being updated. Book a consultation and we&apos;ll guide you directly.</p>
              <Link href="/register" className="text-gold hover:underline text-sm font-semibold mt-4 inline-block">
                Book a consultation →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-navy mb-12 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
                  <step.icon size={20} />
                </div>
                <p className="text-xs text-gold font-semibold mb-1">STEP {i + 1}</p>
                <h4 className="font-display font-semibold mb-1.5 text-navy">{step.title}</h4>
                <p className="text-sm text-slate">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-2 text-gold text-xs font-semibold tracking-wide mb-6">
            <Plane size={14} /> STUDY DESTINATIONS
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-cream/85">
            {destinations.map((d) => (
              <span key={d} className="hover:text-gold transition-colors cursor-default">{d}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="rounded-3xl bg-navy p-12 text-center">
            <h2 className="font-display text-3xl font-semibold mb-3 text-cream">
              Helping students study abroad <span className="text-gold">with confidence and clarity.</span>
            </h2>
            <p className="text-cream/70 mb-8 max-w-lg mx-auto">
              Create an account to book a free consultation and start your journey with DNT Edutravel.
            </p>
            <Link href="/register" className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy inline-flex items-center gap-2 hover:bg-gold/90 transition-colors">
              Book Free Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}