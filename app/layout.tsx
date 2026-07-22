import type { Metadata } from "next";
import { fraunces, inter, plexMono } from "./fonts";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ReferralCapture from "@/components/ReferralCapture";

export const metadata: Metadata = {
  title: "Digitech Nexus",
  description: "Empowering dreams. Building futures.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body suppressHydrationWarning className="font-body bg-cream text-ink">
        <AnimatedBlobs />
        <div className="relative z-10">
          <CartProvider>{children}</CartProvider>
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#15417E",
              color: "#FAF8F3",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#D98C1F", secondary: "#FAF8F3" },
            },
          }}
        />
        <ReferralCapture />
      </body>
    </html>
  );
}
