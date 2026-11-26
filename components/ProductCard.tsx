import Link from "next/link";
import { BookOpen, MessageCircle } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import BookServiceButton from "@/components/BookServiceButton";
import ReadMore from "@/components/ReadMore";
import { isBookingOnly, whatsappLink } from "@/lib/booking-config";

export type CardProduct = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  price: number | string;
  thumbnail_url: string | null;
};

// One card for every product listing (shop, eBooks, courses, services).
// eBooks show a book-cover frame; booking-only services show Book now + WhatsApp instead of a price.
export default function ProductCard({
  product,
  tone = "light",
  returnTo = "/shop",
}: {
  product: CardProduct;
  tone?: "light" | "dark";
  returnTo?: string;
}) {
  const dark = tone === "dark";
  const isEbook = product.type === "ebook";
  const bookingOnly = isBookingOnly(product.type);
  const href = `/product/${product.id}`;
  const price = Number(product.price);

  const shell = dark
    ? "bg-white/5 border-white/10 hover:border-gold/40"
    : "bg-white border-line shadow-sm hover:border-gold/50 hover:shadow-md";
  const titleColor = dark ? "text-cream" : "text-navy";
  const bodyColor = dark ? "text-cream/65" : "text-slate";

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border transition-all ${shell}`}>
      {isEbook ? (
        <Link href={href} className={`flex justify-center px-6 pt-6 pb-5 ${dark ? "bg-white/5" : "bg-cream"}`}>
          <div className="relative w-36 aspect-[2/3] overflow-hidden rounded-md shadow-xl ring-1 ring-black/10">
            {product.thumbnail_url ? (
              <img
                src={product.thumbnail_url}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-navy">
                <BookOpen size={30} className="text-gold/70" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent" />
          </div>
        </Link>
      ) : product.thumbnail_url ? (
        <Link href={href} className="relative block aspect-video bg-cream">
          <img src={product.thumbnail_url} alt={product.title} className="absolute inset-0 h-full w-full object-cover" />
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <h3 className={`font-display font-semibold ${titleColor}`}>
          <Link href={href} className="transition-colors hover:text-gold">
            {product.title}
          </Link>
        </h3>

        {product.description ? (
          <ReadMore
            text={product.description}
            lines={3}
            className="mt-2 flex-1"
            textClassName={`text-sm leading-6 whitespace-pre-wrap ${bodyColor}`}
          />
        ) : (
          <div className="flex-1" />
        )}

        {bookingOnly ? (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <BookServiceButton productId={product.id} returnTo={returnTo} tone={tone} />
            <a
              href={whatsappLink(`Hello Digitech Nexus, I'd like to book: ${product.title}`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                dark
                  ? "border-cream/25 text-cream hover:border-gold hover:text-gold"
                  : "border-navy/20 text-navy hover:border-gold hover:text-gold"
              }`}
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="font-display text-lg font-semibold text-gold">₦{price.toLocaleString()}</span>
            <AddToCartButton id={product.id} title={product.title} price={price} type={product.type} />
          </div>
        )}
      </div>
    </div>
  );
}
