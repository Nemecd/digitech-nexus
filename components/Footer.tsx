import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <span className="font-display font-bold text-lg">
            DIGITECH <span className="text-gold">NEXUS</span>
          </span>
          <p className="text-cream/60 text-sm mt-3">Empowering dreams. Building futures.</p>
          <div className="flex gap-4 mt-5 text-cream/60">
  <a href="https://instagram.com/digitechnexushub" aria-label="Instagram" className="hover:text-gold transition-colors">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  </a>
  <a href="https://linkedin.com/company/digitechnexushub" aria-label="LinkedIn" className="hover:text-gold transition-colors">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5A6 6 0 0 1 16 8Z" />
      <rect x="2" y="8" width="4" height="13" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  </a>
  <a href="https://twitter.com/digitechnexushub" aria-label="Twitter/X" className="hover:text-gold transition-colors">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  </a>
  <a href="https://youtube.com/@digitechnexushub" aria-label="YouTube" className="hover:text-gold transition-colors">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <path d="M10 9l5 3-5 3V9Z" fill="currentColor" />
    </svg>
  </a>
</div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3 text-sm">Services</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link href="/services/nin">NIN Services</Link></li>
            <li><Link href="/services/cac">CAC Registration</Link></li>
            <li><Link href="/student-placement">Student Placement</Link></li>
            <li><Link href="/courses">DN Academy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link href="/affiliate">Affiliate Program</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/resources">Resources</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="text-sm text-cream/60 space-y-3">
          <div className="flex items-center gap-2"><Phone size={15} className="text-gold" /> 07039067561</div>
          <div className="flex items-center gap-2"><Mail size={15} className="text-gold" /> info@digitechnexushub.com</div>
          <div className="flex items-center gap-2"><MapPin size={15} className="text-gold" /> No. 40 Okpara Avenue, Enugu</div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-cream/60 tracking-wide">
        DREAM BIG. PLAN SMART. ACHIEVE MORE. — © {new Date().getFullYear()} Digitech Nexus
      </div>
    </footer>
  );
}