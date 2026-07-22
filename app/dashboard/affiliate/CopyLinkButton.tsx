"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-full bg-navy text-cream px-4 py-2 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center gap-1.5 flex-shrink-0"
    >
      {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
    </button>
  );
}