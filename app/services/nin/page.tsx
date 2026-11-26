import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import { whatsappLink } from "@/lib/booking-config";
import { ArrowRight, Bell, ClipboardList, FileCheck, Fingerprint, MessageCircle, UploadCloud } from "lucide-react";

export const revalidate = 60;

export default async function NinServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("products")
    .select("id, type, title, description, price, thumbnail_url")
    .eq("type", "nin_service")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  const steps = [
    { icon: ClipboardList, title: "Choose a service", desc: "Pick the NIN service you need from the list below." },
    { icon: UploadCloud, title: "Fill in the form", desc: "Answer a few short questions and upload any documents asked for." },
    { icon: FileCheck, title: "We handle it", desc: "Our team processes your request and keeps you updated." },
    { icon: Bell, title: "Get notified", desc: "Follow the progress from your dashboard, or message us any time." },
  ];

  const generalChat = whatsappLink("Hello Digitech Nexus, I need help with a NIN service.");

  return (
    <>
      <Navbar />

      <section className="relative bg-navy">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-14">
          <p className="text-xs text-cream/60 mb-3">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link> / NIN Services
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
            <Fingerprint size={14} /> NIN SERVICES · NO ONLINE PAYMENT NEEDED
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 text-cream max-w-2xl">
            Book your NIN service in minutes.
          </h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl">
            Pick a service, fill in the short form, and our team takes it from there. Prefer to talk it through? Chat
            with us on WhatsApp.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="#services"
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold/90 transition-colors inline-flex items-center gap-2"
            >
              See services <ArrowRight size={16} />
            </a>
            <a
              href={generalChat}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cream/25 px-6 py-3 text-sm font-semibold text-cream hover:border-gold hover:text-gold transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="relative bg-white scroll-mt-20">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-navy mb-3 text-center">Available services</h2>
          <p className="text-sm text-slate text-center mb-10 max-w-lg mx-auto">
            You&apos;ll be asked to log in or create an account first, so you can track your request from your dashboard.
          </p>

          {services && services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {services.map((s, i) => (
                <Reveal key={s.id} delay={i * 60}>
                  <ProductCard product={s} returnTo="/services/nin" />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center rounded-2xl border border-line bg-white p-12 max-w-lg mx-auto">
              <p className="text-slate">Our NIN service list is being updated. Message us and we&apos;ll sort you out directly.</p>
              <a
                href={generalChat}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline text-sm font-semibold mt-4 inline-block"
              >
                Chat on WhatsApp →
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-cream mb-12 text-center">How it works</h2>
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
          <div className="rounded-3xl bg-navy p-10 sm:p-12 text-center">
            <h2 className="font-display text-3xl font-semibold mb-3 text-cream">Not sure which service you need?</h2>
            <p className="text-cream/70 mb-8 max-w-lg mx-auto">
              Tell us what you&apos;re trying to do on WhatsApp and we&apos;ll point you to the right one.
            </p>
            <a
              href={generalChat}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy inline-flex items-center gap-2 hover:bg-gold/90 transition-colors"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
