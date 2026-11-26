import { ArrowRight } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";
import { startBooking } from "@/app/book/actions";

export default function BookServiceButton({
  productId,
  returnTo = "/services/nin",
  label = "Book now",
  tone = "light",
}: {
  productId: string;
  returnTo?: string;
  label?: string;
  tone?: "light" | "dark";
}) {
  const style =
    tone === "dark"
      ? "bg-gold text-navy hover:bg-gold/90"
      : "bg-navy text-cream hover:bg-gold hover:text-navy";

  return (
    <form action={startBooking}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <SubmitButton
        pendingText="Opening form…"
        className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors gap-1.5 ${style}`}
      >
        {label} <ArrowRight size={14} />
      </SubmitButton>
    </form>
  );
}
