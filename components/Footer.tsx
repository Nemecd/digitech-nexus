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
          <p className="text-cream/60 text-sm mt-3">
            Empowering dreams. Building futures.
          </p>
          <div className="flex gap-4 mt-5 text-cream/60">
            <div className="flex gap-4 mt-5 text-muted">
              <a
                href="https://www.facebook.com/share/1EgiSpvkUS/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-gold transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/digitechnexushub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-gold transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@digitechnexushub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:text-gold transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 4a4 4 0 0 0 4 4v3a7 7 0 0 1-4-1.3V15a5 5 0 1 1-5-5c.3 0 .7 0 1 .1v3.1a2 2 0 1 0 1 1.8V4z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3 text-sm">Services</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>
              <Link href="/services/nin">NIN Services</Link>
            </li>
            <li>
              <Link href="/services/cac">CAC Registration</Link>
            </li>
            <li>
              <Link href="/student-placement">Student Placement</Link>
            </li>
            <li>
              <Link href="/courses">DN Academy</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>
              <Link href="/affiliate">Affiliate Program</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/resources">Resources</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="text-sm text-cream/60 space-y-3">
          <div className="flex items-center gap-2">
            <Phone size={15} className="text-gold" /> 07039067561
          </div>
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-gold" /> info@digitechnexushub.com
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-gold" /> No. 40 Okpara Avenue,
            Enugu
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-cream/60 tracking-wide">
        DREAM BIG. PLAN SMART. ACHIEVE MORE. — © {new Date().getFullYear()}{" "}
        Digitech Nexus
      </div>
    </footer>
  );
}
