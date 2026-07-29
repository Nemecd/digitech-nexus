"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const serviceLinks = [
  { href: "/services/nin", label: "NIN Services" },
  { href: "/services/cac", label: "CAC Registration" },
  { href: "/student-placement", label: "Student Placement" },
];

const learnLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/ebooks", label: "eBooks" },
];

const topLevelLinks = [
  { href: "/affiliate", label: "Affiliate" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 border-b-2 border-transparent hover:border-gold hover:text-gold transition-colors pb-1">
        {label} <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-2 w-56">
          <div className="rounded-xl bg-navy border border-gold/15 shadow-lg overflow-hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-gold transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileLearnOpen, setMobileLearnOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-navy border-b border-gold/20">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Digitech Nexus"
            width={40}
            height={40}
            style={{ width: "auto", height: "auto" }}
            className="object-contain"
          />
          <span className="font-display font-semibold text-lg text-white">
            Digitech <span className="text-gold">Nexus</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7 text-sm text-white/80">
          <NavDropdown label="Services" links={serviceLinks} />
          <NavDropdown label="Learn" links={learnLinks} />
          {topLevelLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b-2 border-transparent hover:border-gold hover:text-gold transition-colors pb-1"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-white/80 hover:text-gold transition-colors"
          >
            <ShoppingCart size={19} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-navy text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/login"
            className="text-sm text-white/80 hover:text-gold transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy border border-gold hover:bg-transparent hover:text-gold transition-colors"
          >
            Get Started
          </Link>
        </div>

        <button
          className="lg:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden relative z-50 bg-navy border-t border-gold/10 px-6 py-6 flex flex-col gap-1 text-sm text-white/85">
          {/* Services group */}
          <button
            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            className="flex items-center justify-between py-2"
          >
            Services{" "}
            <ChevronDown
              size={14}
              className={
                mobileServicesOpen
                  ? "rotate-180 transition-transform"
                  : "transition-transform"
              }
            />
          </button>
          {mobileServicesOpen && (
            <div className="pl-4 flex flex-col gap-1 mb-2">
              {serviceLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-1.5 text-white/70"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {/* Learn group */}
          <button
            onClick={() => setMobileLearnOpen(!mobileLearnOpen)}
            className="flex items-center justify-between py-2"
          >
            Learn{" "}
            <ChevronDown
              size={14}
              className={
                mobileLearnOpen
                  ? "rotate-180 transition-transform"
                  : "transition-transform"
              }
            />
          </button>
          {mobileLearnOpen && (
            <div className="pl-4 flex flex-col gap-1 mb-2">
              {learnLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-1.5 text-white/70"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {topLevelLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2"
            >
              {l.label}
            </Link>
          ))}

          <div className="border-t border-white/10 my-2" />

          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 py-2"
          >
            <ShoppingCart size={16} /> Cart {count > 0 && `(${count})`}
          </Link>
          <Link href="/login" onClick={() => setOpen(false)} className="py-2">
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-gold px-5 py-2.5 text-center font-semibold text-navy mt-2"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
