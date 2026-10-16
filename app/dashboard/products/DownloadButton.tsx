"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { getDownloadUrl } from "./actions";

export default function DownloadButton({
  userProductId,
  autoStart = false,
  large = false,
}: {
  userProductId: string;
  autoStart?: boolean;
  large?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const started = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleDownload() {
    setLoading(true);
    setError("");
    try {
      const url = await getDownloadUrl(userProductId);
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || "Could not start download");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoStart && !started.current) {
      started.current = true;
      handleDownload();
      router.replace(pathname); // strip ?autodownload=1 so a refresh doesn't re-trigger it
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`rounded-full bg-navy text-cream font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center gap-2 disabled:opacity-50 ${
          large ? "px-7 py-3.5 text-sm" : "px-4 py-2 text-xs"
        }`}
      >
        {loading ? <Loader2 size={large ? 16 : 14} className="animate-spin" /> : <Download size={large ? 16 : 14} />}
        Download
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}