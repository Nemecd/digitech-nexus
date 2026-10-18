"use client";
import { useState, useTransition } from "react";
import { Loader2, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteReview, submitReview } from "./actions";

export default function ReviewForm({
  productId,
  existingRating,
  existingComment,
}: {
  productId: string;
  existingRating: number;
  existingComment: string;
}) {
  const [rating, setRating] = useState(existingRating);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existingComment);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      toast.error("Please choose a star rating");
      return;
    }
    startTransition(async () => {
      const result = await submitReview(productId, rating, comment);
      if (result.success) {
        toast.success(existingRating ? "Review updated" : "Thanks for your review!");
      } else {
        toast.error(result.error || "Could not save your review");
      }
    });
  }

  const shown = hover || rating;

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-4 sm:p-5">
      <p className="text-sm font-semibold text-navy mb-3">
        {existingRating ? "Update your review" : "Leave a review"}
      </p>

      <div className="flex gap-1 mb-3" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="p-0.5"
          >
            <Star size={24} className={n <= shown ? "fill-gold text-gold" : "text-line"} />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="What did you think? (optional)"
        className="w-full rounded-lg border border-line px-3 py-2.5 text-sm"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-full bg-navy text-cream px-5 py-2.5 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center gap-2 disabled:opacity-60"
      >
        {pending && <Loader2 size={14} className="animate-spin" />}
        {existingRating ? "Update review" : "Submit review"}
      </button>
    </form>
  );
}

export function DeleteReviewButton({ reviewId, productId }: { reviewId: string; productId: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Delete this review?")) return;
    startTransition(async () => {
      const result = await deleteReview(reviewId, productId);
      if (!result.success) toast.error(result.error || "Could not delete review");
      else toast.success("Review deleted");
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      aria-label="Delete review"
      className="text-red-400 hover:text-red-500 disabled:opacity-50"
    >
      {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}
