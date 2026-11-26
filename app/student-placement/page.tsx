import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bell,
  Compass,
  FileCheck,
  GraduationCap,
  Plane,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

export const revalidate = 60;

const APPLYBOARD_URL = "https://www.applyboard.com/partners/2054090/intake-form";

export default async function StudentPlacementPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("products")
    .select("id, type, title, description, price, thumbnail_url")
    .eq("type", "student_placement")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  const steps = [
    { icon: GraduationCap, title: "Free consultation", desc: "We assess your goals, budget, and academic background to recommend the right path." },
    { icon: UploadCloud, title: "Submit documents", desc: "Upload transcripts, certificates, and required documentation securely." },
    { icon: FileCheck, title: "Admission & visa support", desc: "We guide your application, admission, and visa process end to end." },
    { icon: Bell, title: "Relocation support", desc: "From pre-departure orientation to settling in, we stay with you." },
  ];

  const journey = [
    { icon: Compass, title: "Choose", desc: "The right country, university and course for you" },
    { icon: GraduationCap, title: "Apply", desc: "Secure your admission" },
    { icon: FileCheck, title: "Visa", desc: "Get your visa processed" },
    { icon: Plane, title: "Relocate", desc: "Travel and settle into your new environment" },
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
          <p className="text-cream/60 text-sm mt-3 max-w-xl">
            Prefer to speak with us first? Book a consultation. Ready to apply directly through our partner network? Use ApplyBoard.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/register"
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold/90 transition-colors inline-flex items-center gap-2"
            >
              Book a Free Consultation <ArrowRight size={16} />
            </Link>

            <a
              href={APPLYBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cream/25 px-6 py-3 text-sm font-semibold text-cream hover:border-gold hover:text-gold transition-colors inline-flex items-center gap-2"
            >
              Apply via ApplyBoard <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* About DNT Edutravel */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-navy/5 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-block rounded-full bg-gold/10 text-gold text-xs font-semibold px-4 py-1.5 tracking-wide">
                ABOUT DNT EDUTRAVEL
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy mt-4 leading-tight">
                Studying abroad should feel <span className="text-gold">exciting</span>, not overwhelming.
              </h2>

              <div className="mt-5 space-y-4 text-slate leading-relaxed">
                <p>
                  DNT Edutravel Nig. Ltd was founded to help Nigerian and African students access quality international
                  education with confidence.
                </p>
                <p>
                  We guide you personally through the whole journey: choosing the right country, university and course,
                  securing admission, processing your visa, and supporting you as you relocate and settle into your new
                  environment.
                </p>
                <p>We simplify every step, so you can make informed decisions with the support you need to succeed.</p>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
                  <div className="w-11 h-11 rounded-full bg-navy text-gold flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">British Council certified</p>
                    <p className="text-xs text-slate">Education Travel Agent</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
                  <div className="w-11 h-11 rounded-full bg-navy text-gold flex items-center justify-center flex-shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">ApplyBoard partner</p>
                    <p className="text-xs text-slate">Strategic partnership</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="rounded-3xl bg-navy p-7 sm:p-9 shadow-xl">
                <p className="text-xs font-semibold tracking-[0.2em] text-gold">YOUR JOURNEY WITH US</p>
                <ol className="relative mt-6 space-y-6">
                  <div className="absolute left-[19px] top-5 bottom-5 w-px bg-white/15" />
                  {journey.map((step, i) => (
                    <li key={step.title} className="relative flex items-start gap-4">
                      <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-navy ring-2 ring-gold/60 text-gold">
                        <step.icon size={18} />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-xs text-gold/80 font-semibold">STEP {i + 1}</p>
                        <p className="font-display text-lg font-semibold text-cream leading-tight">{step.title}</p>
                        <p className="text-sm text-cream/65 mt-0.5">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services / packages */}
      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-cream mb-10 text-center">Available Packages</h2>

          {services && services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {services.map((s) => (
                <ProductCard key={s.id} product={s} tone="dark" />
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

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy inline-flex items-center gap-2 hover:bg-gold/90 transition-colors"
              >
                Book Free Consultation <ArrowRight size={16} />
              </Link>
              <a
                href={APPLYBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cream/25 px-7 py-3 text-sm font-semibold text-cream hover:border-gold hover:text-gold transition-colors inline-flex items-center gap-2"
              >
                Apply via ApplyBoard <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
