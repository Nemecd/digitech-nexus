import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Users, Link2, Wallet, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AffiliatePage() {
  const steps = [
    { icon: Users, title: "Register as an affiliate", desc: "Sign up and get your unique referral code instantly." },
    { icon: Link2, title: "Share your referral link", desc: "Promote any product or service using your personal link." },
    { icon: BarChart3, title: "Track your earnings", desc: "See clicks, sales, and commissions in real time on your dashboard." },
    { icon: Wallet, title: "Withdraw anytime", desc: "Request a payout of your earned commission whenever you're ready." },
  ];

  const perks = [
    "Earn commission on every sale via your link",
    "Real-time referral tracking dashboard",
    "No cap on how much you can earn",
    "Fast withdrawal processing",
    "Marketing materials provided",
    "Dedicated affiliate support",
  ];

  return (
    <>
      <Navbar />

      <section className="relative bg-navy">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold mx-auto">
            <Users size={14} /> AFFILIATE PROGRAM
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 text-cream max-w-2xl mx-auto">
            Earn by sharing what you already believe in.
          </h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl mx-auto">
            Refer people to our services, courses, and eBooks — earn a commission on every sale, tracked and paid out through your own dashboard.
          </p>
          <Link href="/register" className="mt-8 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy inline-flex items-center gap-2 hover:bg-gold/90 transition-colors">
            Become an Affiliate <ArrowRight size={16} />
          </Link>
        </div>
      </section>

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

      <section className="relative bg-navy border-y border-gold/10">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-cream mb-10 text-center">What You Get</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {perks.map((perk) => (
              <div key={perk} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-gold flex-shrink-0 mt-0.5" />
                <p className="text-cream/85 text-sm">{perk}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="rounded-3xl bg-navy p-12 text-center">
            <h2 className="font-display text-3xl font-semibold mb-3 text-cream">Start earning today</h2>
            <p className="text-cream/70 mb-8 max-w-lg mx-auto">
              Registration is free — get your referral link the moment you sign up.
            </p>
            <Link href="/register" className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy inline-flex items-center gap-2 hover:bg-gold/90 transition-colors">
              Become an Affiliate <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}