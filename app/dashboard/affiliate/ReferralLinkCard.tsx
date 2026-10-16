"use client";
import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function ReferralLinkCard({ code }: { code: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const link = `${origin}/?ref=${code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy automatically. Please try again.");
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-line p-4 sm:p-6">
      <p className="text-sm font-semibold text-navy">Your sitewide referral link</p>
      <p className="text-xs text-slate mt-0.5 mb-3">
        Anyone who buys a course or eBook after clicking this link earns you commission.
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <code className="flex-1 min-w-0 rounded-lg bg-cream px-4 py-3 text-xs sm:text-sm text-navy break-all">
          {link}
        </code>
        <button
          onClick={copy}
          className="rounded-full bg-navy text-cream px-5 py-2.5 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center justify-center gap-1.5 sm:flex-shrink-0"
        >
          {copied ? (
            <>
              <Check size={14} /> Copied
            </>
          ) : (
            <>
              <Copy size={14} /> Copy link
            </>
          )}
        </button>
      </div>
    </div>
  );
}