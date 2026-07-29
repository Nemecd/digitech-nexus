import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Target, Eye, Award, Lightbulb, ShieldCheck, Users2, TrendingUp, Globe2, ArrowRight, BookOpen, Heart } from "lucide-react";

const values = [
  { icon: Award, label: "Excellence" },
  { icon: Lightbulb, label: "Innovation" },
  { icon: ShieldCheck, label: "Integrity" },
  { icon: Users2, label: "Accessibility" },
  { icon: TrendingUp, label: "Growth" },
  { icon: Globe2, label: "Global Perspective" },
  { icon: Heart, label: "Customer Success" },
];;

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <section className="relative bg-navy">
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold mx-auto">
            ABOUT US
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 text-cream">
            Empowering dreams. <span className="text-gold">Building futures.</span>
          </h1>
          <p className="text-cream/70 text-lg mt-5 max-w-2xl mx-auto">
            Digitech Nexus is an innovative education and digital solutions company committed to empowering individuals, businesses, and organizations through technology, knowledge, and global opportunities.
          </p>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
          <p className="text-slate text-lg leading-relaxed">
            Founded by Odugu Chinonso Jacob, Digitech Nexus serves as a one-stop platform for identity management, business registration, international education, digital learning, and professional development. We simplify complex processes and provide practical solutions that help our clients learn, grow, and succeed.
          </p>
          <p className="text-slate text-lg leading-relaxed mt-4">
            Through our specialized brands and services — including DNT Edutravel Nig. Ltd, DTN Academy, NIN services, CAC business registration, eBook sales, an affiliate program, and digital skills training — we've supported hundreds of clients with trusted, affordable, results-driven solutions.
          </p>
          <p className="text-slate text-lg leading-relaxed mt-4">
            At Digitech Nexus, we believe everyone deserves access to opportunities that can transform their future. Whether you&apos;re starting a business, pursuing international education, building digital skills, or advancing your career, our team is committed to guiding you every step of the way with integrity, excellence, and personalized support.
          </p>
        </div>
      </section>

      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <div className="w-11 h-11 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
              <Eye size={20} />
            </div>
            <h3 className="font-display text-xl font-semibold text-cream mb-2">Our Vision</h3>
            <p className="text-cream/70 text-sm leading-relaxed">
              To become Africa&apos;s leading digital empowerment platform, connecting people with the knowledge, tools, and global opportunities they need to build successful futures.
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <div className="w-11 h-11 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
              <Target size={20} />
            </div>
            <h3 className="font-display text-xl font-semibold text-cream mb-2">Our Mission</h3>
            <p className="text-cream/70 text-sm leading-relaxed">
              To deliver innovative, reliable, and affordable solutions that empower individuals and businesses through education, technology, entrepreneurship, and digital transformation.
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-navy mb-12 text-center">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.label} className="flex items-center gap-3 rounded-xl border border-line px-5 py-4">
                <v.icon size={18} className="text-gold flex-shrink-0" />
                <span className="text-navy font-medium text-sm">{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <span className="inline-block rounded-full bg-gold/10 text-gold text-xs font-semibold px-4 py-1.5 tracking-wide">
              MEET THE FOUNDER
            </span>
            <h2 className="font-display text-3xl font-semibold text-cream mt-4">Odugu Chinonso Jacob</h2>
            <p className="text-gold text-sm mt-1">Founder, Digitech Nexus & DNT Edutravel Nig. Ltd</p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 space-y-4 text-cream/75 text-sm leading-relaxed">
            <p>
              Odugu Chinonso Jacob is a Nigerian education entrepreneur, digital innovation advocate, author, and international education consultant dedicated to empowering people through knowledge, technology, and global opportunities.
            </p>
            <p>
              He holds a B.Sc. in Soil Science with Second Class Upper Honours from the University of Nigeria, Nsukka, where he received the Award of Academic Excellence in 2016 and served as President of the Soil Science Students&apos; Association in 2017.
            </p>
            <p>
              He is also the Founder and CEO of DNT Edutravel Nig. Ltd, certified by the British Council as an Education Travel Agent, with strategic partnerships including ApplyBoard.
            </p>
            <div className="flex items-start gap-3 pt-2">
              <BookOpen size={18} className="text-gold flex-shrink-0 mt-0.5" />
              <p>
                As an author, he wrote <em className="text-cream not-italic font-medium">36 SSCE Success Master Keys</em>, an educational guide approved by the Enugu State Ministry of Education for use in secondary schools.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="rounded-3xl bg-navy p-12 text-center">
            <h2 className="font-display text-3xl font-semibold mb-3 text-cream">Ready to start your journey?</h2>
            <p className="text-cream/70 mb-8 max-w-lg mx-auto">
              Join thousands who&apos;ve trusted Digitech Nexus with their identity, business, education, and future.
            </p>
            <Link href="/register" className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy inline-flex items-center gap-2 hover:bg-gold/90 transition-colors">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}