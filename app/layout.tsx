import type { Metadata } from "next";
import { fraunces, inter, plexMono } from "./fonts";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digitech Nexus",
  description: "Empowering dreams. Building futures.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body suppressHydrationWarning className="font-body bg-cream text-ink">
        <AnimatedBlobs />
        <div className="relative z-10">
          <CartProvider>{children}</CartProvider>
        </div>
      </body>
    </html>
  );
}