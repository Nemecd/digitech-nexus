import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HeroGraphic from "@/components/HeroGraphic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-navy p-12 text-cream">
        <HeroGraphic />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-navy/70" />

        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-lg tracking-tight text-cream">
            DIGITECH <span className="text-gold">NEXUS</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-cream/70 hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>

        <div className="relative z-10 max-w-sm">
          <h1 className="font-display text-3xl font-bold leading-tight text-cream">
            Empowering dreams.<br />Building futures.
          </h1>
          <p className="mt-4 text-cream/65 text-sm">
            Courses, services, and opportunities — one platform, one login.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile-only top bar, since the left panel is hidden below lg */}
        <div className="lg:hidden w-full max-w-md flex items-center justify-between mb-8">
          <Link href="/" className="font-display font-bold text-navy">
            DIGITECH <span className="text-gold">NEXUS</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-slate hover:text-gold transition-colors">
            <ArrowLeft size={14} /> Home
          </Link>
        </div>

        <div className="w-full max-w-md relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gold/40" />
          {children}
        </div>
      </div>
    </div>
  );
}