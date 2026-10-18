"use client";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-navy text-cream px-5 py-2 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center gap-2"
    >
      <Printer size={14} /> Print / Save as PDF
    </button>
  );
}
