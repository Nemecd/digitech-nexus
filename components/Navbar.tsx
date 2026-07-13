"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/services/nin", label: "NIN Services" },
  { href: "/services/cac", label: "CAC Registration" },
  { href: "/student-placement", label: "Student Placement" },
  { href: "/courses", label: "Courses" },
  { href: "/ebooks", label: "eBooks" },
  { href: "/affiliate", label: "Affiliate" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy border-b border-gold/20">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Digitech Nexus" width={40} height={40} style={{ width: "auto", height: "auto" }}className="object-contain" />
          <span className="font-display font-semibold text-lg text-white">
            Digitech <span className="text-gold">Nexus</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7 text-sm text-white/80">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b-2 border-transparent hover:border-gold hover:text-gold transition-colors pb-1"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/80 hover:text-gold transition-colors">
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
        <div className="lg:hidden relative z-50 bg-navy border-t border-gold/10 px-6 py-6 flex flex-col gap-4 text-sm text-white/85">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="border-t border-white/10 my-1" />
          <Link href="/login" onClick={() => setOpen(false)}>
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-gold px-5 py-2.5 text-center font-semibold text-navy"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}