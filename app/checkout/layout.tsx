import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy border-b border-gold/20 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="Digitech Nexus" width={34} height={34} className="object-contain" />
            <span className="font-display font-semibold text-white text-sm">
              Digitech <span className="text-gold">Nexus</span>
            </span>
          </Link>
          <Link href="/cart" className="flex items-center gap-1.5 text-xs text-white/70 hover:text-gold transition-colors">
            <ArrowLeft size={14} /> Back to Cart
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}