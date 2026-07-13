import type { Metadata } from "next";
import { fraunces, inter, plexMono } from "./fonts";
import "./globals.css";
import AnimatedBlobs from "@/components/AnimatedBlobs";

export const metadata: Metadata = {
  title: "Digitech Nexus",
  description: "Empowering dreams. Building futures.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body suppressHydrationWarning className="font-body bg-cream text-ink">
        
        <AnimatedBlobs />
  <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

