"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link2, Copy, Check, Loader2, BookOpen, MonitorPlay, MousePointerClick } from "lucide-react";
import { getOrCreateProductLink } from "./actions";

type Product = { id: string; title: string; type: string; price: number | string; thumbnail_url: string | null };
type ExistingLink = { code: string; clicks: number };

export default function ProductLinksList({
  products,
  existingLinks,
  commissionRate,
}: {
  products: Product[];
  existingLinks: Record<string, ExistingLink>;
  commissionRate: number;
}) {
  const [codes, setCodes] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(existingLinks).map(([id, l]) => [id, l.code]))
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleGetLink(productId: string) {
    setLoadingId(productId);
    try {
      const code = await getOrCreateProductLink(productId);
      setCodes((prev) => ({ ...prev, [productId]: code }));
    } catch {
      toast.error("Could not create the link. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCopy(productId: string, code: string) {
    const url = `${window.location.origin}/product/${productId}?ref=${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(productId);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Could not copy automatically. Please try again.");
    }
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {products.map((p) => {
        const code = codes[p.id];
        const clicks = existingLinks[p.id]?.clicks ?? 0;
        const price = Number(p.price);
        const earn = (price * commissionRate) / 100;
        const isEbook = p.type === "ebook";
        const Icon = isEbook ? BookOpen : MonitorPlay;

        return (
          <div
            key={p.id}
            className="flex sm:flex-col rounded-2xl bg-white border border-line overflow-hidden hover:border-gold/50 hover:shadow-md transition-all"
          >
            {/* Thumbnail */}
            <div className="relative w-28 sm:w-full sm:aspect-video flex-shrink-0 bg-cream">
              {p.thumbnail_url ? (
                <img src={p.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon size={28} className="text-slate/30" />
                </div>
              )}
              <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-navy/85 text-cream">
                {isEbook ? "eBook" : "Course"}
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col">
              <h3 className="font-display font-semibold text-navy text-sm sm:text-base line-clamp-2">{p.title}</h3>
              <p className="text-xs text-slate mt-0.5">₦{price.toLocaleString()}</p>

              <span className="mt-2 self-start rounded-full bg-gold/10 text-gold text-xs font-semibold px-2.5 py-1">
                Earn ₦{earn.toLocaleString()} per sale
              </span>

              <div className="mt-auto pt-3">
                {code ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(p.id, code)}
                      className="flex-1 rounded-full bg-navy text-cream px-3 py-2 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      {copiedId === p.id ? (
                        <>
                          <Check size={13} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy link
                        </>
                      )}
                    </button>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] text-slate whitespace-nowrap"
                      title="Clicks on your link"
                    >
                      <MousePointerClick size={12} /> {clicks}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleGetLink(p.id)}
                    disabled={loadingId === p.id}
                    className="w-full rounded-full border border-gold text-gold px-3 py-2 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {loadingId === p.id ? <Loader2 size={13} className="animate-spin" /> : <Link2 size={13} />}
                    {loadingId === p.id ? "Generating…" : "Get link"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}