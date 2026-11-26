import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import StatsPanel from "@/components/StatsPanel";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Eye,
  Fingerprint,
  Globe,
  GraduationCap,
  Heart,
  Lightbulb,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

const stats = [
  { value: 15, suffix: "+", label: "Countries" },
  { value: 500, suffix: "+", label: "Happy Clients" },
  { value: 10000, suffix: "+", label: "Services Delivered" },
  { value: 98, suffix: "%", label: "Satisfaction" },
];

const pillars = [
  {
    icon: Fingerprint,
    title: "Identity",
    desc: "NIN services handled for you",
  },
  { icon: Building2, title: "Business", desc: "CAC registration and filings" },
  {
    icon: GraduationCap,
    title: "Education",
    desc: "Study abroad with DNT Edutravel",
  },
  {
    icon: BookOpen,
    title: "Learning",
    desc: "Courses, eBooks and digital skills",
  },
];

const values = [
  { icon: Award, label: "Excellence" },
  { icon: Lightbulb, label: "Innovation" },
  { icon: ShieldCheck, label: "Integrity" },
  { icon: Users, label: "Accessibility" },
  { icon: TrendingUp, label: "Growth" },
  { icon: Globe, label: "Global Perspective" },
  { icon: Heart, label: "Customer Success" },
];

const credentials = [
  "B.Sc. Soil Science, University of Nigeria, Nsukka (Second Class Upper)",
  "Award of Academic Excellence, 2016",
  "President, Soil Science Students' Association, 2017",
  "Founder & CEO of DNT Edutravel Nig. Ltd, a British Council certified Education Travel Agent",
  "Author of 36 SSCE Success Master Keys, approved by the Enugu State Ministry of Education for secondary schools",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
              ABOUT US
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 leading-[1.1] text-cream">
              Empowering dreams.{" "}
              <span className="text-gold">Building futures.</span>
            </h1>
            <p className="text-cream/70 text-lg mt-5 max-w-lg">
              Digitech Nexus is an innovative education and digital solutions
              company committed to empowering individuals, businesses, and
              organizations through technology, knowledge, and global
              opportunities.
            </p>
          </div>
          <StatsPanel stats={stats} />
        </div>
      </section>

      {/* Who we are */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-block rounded-full bg-gold/10 text-gold text-xs font-semibold px-4 py-1.5 tracking-wide">
                WHO WE ARE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy mt-4 leading-tight">
                One platform for identity, business, education and{" "}
                <span className="text-gold">digital growth.</span>
              </h2>
              <div className="mt-5 space-y-4 text-slate leading-relaxed">
                <p>
                  Founded by Odugu Chinonso Jacob, Digitech Nexus is a one-stop
                  platform for identity management, business registration,
                  international education, digital learning, and professional
                  development. We simplify complex processes and give our
                  clients practical solutions that help them learn, grow, and
                  succeed.
                </p>
                <p>
                  Through our services and brands, including DNT Edutravel Nig.
                  Ltd, NIN services, CAC business registration, eBooks and
                  courses, an affiliate program, and digital skills training,
                  we&apos;ve supported hundreds of clients with trusted,
                  affordable, results-driven solutions.
                </p>
                <p>
                  We believe everyone deserves access to opportunities that can
                  transform their future. Whether you&apos;re starting a
                  business, pursuing international education, building digital
                  skills, or advancing your career, we guide you every step of
                  the way with integrity, excellence, and personalized support.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="h-full rounded-2xl border border-line bg-white p-5 shadow-sm hover:border-gold/50 hover:shadow-md transition-all">
                  <div className="w-11 h-11 rounded-full bg-navy text-gold flex items-center justify-center mb-4">
                    <p.icon size={20} />
                  </div>
                  <p className="font-display font-semibold text-navy">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate mt-1 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-5">
                <Eye size={22} />
              </div>
              <p className="text-xs font-semibold tracking-[0.2em] text-gold">
                OUR VISION
              </p>
              <p className="font-display text-xl sm:text-2xl text-cream mt-3 leading-snug">
                To become Africa&apos;s leading digital empowerment platform,
                connecting people with the knowledge, tools, and global
                opportunities they need to build successful futures.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-5">
                <Target size={22} />
              </div>
              <p className="text-xs font-semibold tracking-[0.2em] text-gold">
                OUR MISSION
              </p>
              <p className="font-display text-xl sm:text-2xl text-cream mt-3 leading-snug">
                To deliver innovative, reliable, and affordable solutions that
                empower individuals and businesses through education,
                technology, entrepreneurship, and digital transformation.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="relative bg-white">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-gold/10 text-gold text-xs font-semibold px-4 py-1.5 tracking-wide">
              WHAT WE STAND FOR
            </span>
            <h2 className="font-display text-3xl font-semibold text-navy mt-4">
              Our core values
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {values.map((v, i) => (
              <Reveal key={v.label} delay={i * 60}>
                <div className="w-40 sm:w-44 rounded-2xl border border-line bg-white p-5 text-center shadow-sm hover:border-gold/50 hover:shadow-md transition-all">
                  <div className="w-11 h-11 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-3">
                    <v.icon size={20} />
                  </div>
                  <p className="text-sm font-semibold text-navy">{v.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="relative overflow-hidden bg-navy border-y border-gold/10">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold px-4 py-1.5 tracking-[0.18em]">
                THE PERSON BEHIND THE VISION
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-cream mt-5">
                Meet the <span className="text-gold">Founder!</span>
              </h2>
              <p className="text-cream/65 mt-4 leading-relaxed">
                A journey shaped by education, entrepreneurship, technology, and a commitment to creating opportunities for others.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/10">
              <div className="grid lg:grid-cols-12">
                <div className="lg:col-span-4 bg-gradient-to-br from-gold/15 via-white/[0.03] to-transparent p-8 sm:p-10 flex flex-col items-center text-center justify-center lg:border-r border-white/10">
                  <div className="w-28 h-28 rounded-full bg-gold/10 ring-1 ring-gold/50 text-gold flex items-center justify-center shadow-lg shadow-gold/10">
                    <UserRound size={50} strokeWidth={1.4} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-cream mt-6">
                    Odugu Chinonso Jacob
                  </h3>
                  <p className="text-sm text-gold font-medium mt-2">
                    Founder & Entrepreneur
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-cream/75">
                      Digitech Nexus
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-cream/75">
                      DTN Edutravel Nig. Ltd
                    </span>
                  </div>
                  <div className="mt-8 w-full border-t border-white/10 pt-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-gold/80">
                      Academic background
                    </p>
                    <p className="text-sm text-cream/80 mt-2 leading-relaxed">
                      Soil Science graduate
                    </p>
                    <p className="text-xs text-cream/55 mt-1">
                      University of Nigeria, Nsukka
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-8 p-8 sm:p-10">
                  <div className="space-y-5 text-cream/75 leading-7 text-sm sm:text-base text-justify">
                    <p>
                      I am <span className="text-cream font-semibold">Odugu Chinonso Jacob</span>, a Soil Science graduate of the University of Nigeria, Nsukka, an entrepreneur, writer, and passionate education advocate committed to creating opportunities through technology, innovation, and knowledge.
                    </p>
                    <p>
                      I am the Founder of <span className="text-gold font-semibold">Digitech Nexus</span>, a technology-driven enterprise focused on digital solutions, technology education, business development, and digital empowerment. I am also the Founder of <span className="text-gold font-semibold">DTN Edutravel Nig. Ltd</span>, an education and international student placement company dedicated to connecting aspiring students with global educational opportunities.
                    </p>
                    <p>
                      As a writer and advocate for educational advancement, I authored <span className="text-cream font-semibold italic">36 SSCE Success Master Keys</span>, a comprehensive guide to academic excellence.
                    </p>
                    <p>
                      My interests span entrepreneurship, technology, education, digital transformation, leadership, and human capacity development.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-8">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-3">
                        <BookOpen size={19} />
                      </div>
                      <h4 className="font-display font-semibold text-cream">
                        Writer & Education Advocate
                      </h4>
                      <p className="text-xs text-cream/60 leading-relaxed mt-2">
                        Author of 36 SSCE Success Master Keys, promoting learning and academic excellence.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-3">
                        <Lightbulb size={19} />
                      </div>
                      <h4 className="font-display font-semibold text-cream">
                        Entrepreneur & Innovator
                      </h4>
                      <p className="text-xs text-cream/60 leading-relaxed mt-2">
                        Building ventures around technology, business development, and global education opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-gold/20 bg-gold/[0.07] p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-gold text-xs font-semibold tracking-[0.16em] uppercase mb-3">
                      <Target size={16} />
                      My mission
                    </div>
                    <p className="text-cream/85 leading-relaxed text-sm sm:text-base text-justify">
                      I strongly believe that knowledge creates possibilities, technology expands opportunities, and purposeful entrepreneurship can transform lives and communities. My mission is simple: to build meaningful ventures, empower people with knowledge and skills, and contribute to a future where opportunities are accessible to more people.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="rounded-3xl bg-navy p-10 sm:p-12 text-center">
            <h2 className="font-display text-3xl font-semibold mb-3 text-cream">
              Ready to start your journey?
            </h2>
            <p className="text-cream/70 mb-8 max-w-lg mx-auto">
              Join the people who trust Digitech Nexus with their identity,
              business, education, and future.
            </p>
            <Link
              href="/register"
              className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy inline-flex items-center gap-2 hover:bg-gold/90 transition-colors"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
