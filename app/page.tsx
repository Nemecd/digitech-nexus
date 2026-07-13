import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsPanel from "@/components/StatsPanel";
import Reveal from "@/components/Reveal";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import HeroGraphic from "@/components/HeroGraphic";
import {
  Fingerprint, Building2, GraduationCap, BookOpen, MonitorPlay, Users,
  ShieldCheck, Handshake, Wallet, Zap, Target, ArrowRight, Plane,
} from "lucide-react";

const services = [
  { icon: Fingerprint, title: "NIN Enrolment & Related Services", items: ["New NIN Enrolment", "NIN Modification", "NIN Retrieval", "NIN Validation", "NIN Slip Reprint"] },
  { icon: Building2, title: "CAC Business Registration", items: ["Business Name Registration", "Company Registration (Ltd)", "NGO Registration", "Post-Incorporation Filings", "Annual Returns"] },
  { icon: GraduationCap, title: "Overseas Student Placement", items: ["Career & Course Counselling", "University Selection", "Scholarship Guidance", "Visa Application Support", "Pre-Departure Orientation"] },
  { icon: BookOpen, title: "eBooks Sales", items: ["Premium eBooks", "Study Guides", "Business Templates", "Professional Documents"] },
  { icon: MonitorPlay, title: "DN Academy (Courses & Training)", items: ["NIN & CAC Masterclass", "Study Abroad Masterclass", "Digital Skills Training", "Business Growth Courses"] },
  { icon: Users, title: "Affiliate Program", items: ["Earn Commissions on Referrals", "Partner Rewards & Bonuses", "Referral Tracking Dashboard", "Dedicated Affiliate Support"] },
];

const whyChoose = [
  { icon: Users, title: "Expert Team", desc: "Experienced professionals dedicated to your success." },
  { icon: Handshake, title: "End-to-End Support", desc: "We guide you from start to success and beyond." },
  { icon: ShieldCheck, title: "Trusted & Reliable", desc: "Proudly trusted by thousands of clients across Nigeria." },
  { icon: Wallet, title: "Affordable Prices", desc: "Quality services at competitive rates." },
  { icon: Zap, title: "Fast & Efficient", desc: "Timely service delivery you can count on." },
  { icon: Target, title: "Focused On Results", desc: "We are committed to your growth and success." },
];

const stats = [
  { value: 15, suffix: "+", label: "Countries" },
  { value: 500, suffix: "+", label: "Happy Clients" },
  { value: 10000, suffix: "+", label: "Services Delivered" },
  { value: 98, suffix: "%", label: "Satisfaction" },
];

const destinations = ["🇬🇧 United Kingdom", "🇨🇦 Canada", "🇺🇸 United States", "🇦🇺 Australia", "🇪🇺 Europe", "🇮🇪 Ireland", "🇳🇿 New Zealand"];

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO — navy, animated SVG graphic + floating blobs */}
      <section className="relative overflow-hidden bg-navy">
        
        <HeroGraphic />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
              TRUSTED · RELIABLE · RESULTS DRIVEN
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold mt-6 leading-[1.05] text-cream">
              Your global future <em className="text-gold not-italic">starts here.</em>
            </h1>
            <p className="text-cream/70 text-lg mt-5 max-w-md">
              One platform for identity, business, education & digital success.
              Whatever your goal, we&apos;re here to help you achieve more.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/register" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold/90 transition-colors inline-flex items-center gap-2">
                Get Started <ArrowRight size={16} />
              </Link>
              <Link href="/services/nin" className="rounded-full border border-cream/25 px-6 py-3 text-sm font-semibold text-cream hover:border-gold hover:text-gold transition-colors">
                Explore Services
              </Link>
            </div>
          </div>

          <StatsPanel stats={stats} />
        </div>
      </section>

      {/* CORE SERVICES — white */}
      <section className="relative bg-white">
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-gold/10 text-gold text-xs font-semibold px-4 py-1.5 tracking-wide">
              OUR CORE SERVICES
            </span>
            <h2 className="font-display text-3xl font-semibold text-navy mt-4">
              Everything you need, in one place
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="rounded-2xl bg-white border border-line p-6 shadow-sm hover:border-gold/50 hover:shadow-md transition-all h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/15 text-gold text-xs font-bold">
                      {i + 1}
                    </span>
                    <s.icon size={22} className="text-navy" />
                  </div>
                  <h3 className="font-display font-semibold mb-3 text-navy">{s.title}</h3>
                  <ul className="space-y-1.5 text-sm text-slate">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-gold mt-0.5">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US — navy */}
      <section className="relative bg-navy border-y border-gold/10">
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-gold/10 text-gold text-xs font-semibold px-4 py-1.5 tracking-wide">
              WHY CHOOSE DIGITECH NEXUS?
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChoose.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 text-gold flex items-center justify-center mx-auto mb-4">
                    <w.icon size={20} />
                  </div>
                  <h4 className="font-display font-semibold mb-1.5 text-cream">{w.title}</h4>
                  <p className="text-sm text-cream/65">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STUDY DESTINATIONS — white */}
      <section className="relative bg-white">
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <Reveal>
            <div className="rounded-3xl bg-navy p-10 text-center">
              <div className="flex items-center justify-center gap-2 text-gold text-xs font-semibold tracking-wide mb-6">
                <Plane size={14} /> STUDY DESTINATIONS
              </div>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-cream/85">
                {destinations.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA — navy, glass card */}
      <section className="relative bg-navy">
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <Reveal>
            <div className="rounded-3xl bg-white/8 backdrop-blur-md border border-white/15 p-12 text-center">
              <h2 className="font-display text-3xl font-semibold mb-3 text-cream">
                Dream big. Plan smart. <span className="text-gold">Achieve more.</span>
              </h2>
              <p className="text-cream/70 mb-8 max-w-lg mx-auto">
                Join thousands who&apos;ve trusted Digitech Nexus with their identity, business, and future.
              </p>
              <Link
                href="/register"
                className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy inline-flex items-center gap-2 hover:bg-gold/90 transition-colors"
              >
                Get Started Today <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}