import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Building2, FileCheck, UploadCloud, Bell, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function CacServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("products")
    .select("id, title, description, price")
    .eq("type", "cac_service")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  const steps = [
    { icon: Building2, title: "Choose a service", desc: "Select the CAC registration or filing service you need." },
    { icon: UploadCloud, title: "Submit details & documents", desc: "Fill the request form and upload required business documents." },
    { icon: FileCheck, title: "We process your filing", desc: "Our team handles the registration or filing with the relevant authorities." },
    { icon: Bell, title: "Get notified", desc: "Track progress and receive updates on your dashboard." },
  ];

  return (
    <>
      <Navbar />

      <section className="relative bg-navy">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-14">
          <p className="text-xs text-cream/60 mb-3">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link> / CAC Registration
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
            <Building2 size={14} /> CAC BUSINESS REGISTRATION
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 text-cream max-w-2xl">
            Register and grow your business, the right way.
          </h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl">
            Business name registration, company incorporation, NGO registration, and post-incorporation filings — handled from start to finish.
          </p>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-navy mb-10 text-center">Available Services</h2>

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
              <p className="text-slate">Our CAC service list is being updated. Reach out and we&apos;ll get you sorted directly.</p>
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
            <h2 className="font-display text-3xl font-semibold mb-3 text-cream">Ready to register your business?</h2>
            <p className="text-cream/70 mb-8 max-w-lg mx-auto">
              Create an account to request a service, upload documents, and track your status — all in one dashboard.
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