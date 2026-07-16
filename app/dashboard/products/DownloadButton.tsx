"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { getDownloadUrl } from "./actions";

export default function DownloadButton({ userProductId }: { userProductId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setLoading(true);
    setError("");
    try {
      const url = await getDownloadUrl(userProductId);
      window.open(url, "_blank");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="rounded-full bg-navy text-cream px-4 py-2 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Download
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}