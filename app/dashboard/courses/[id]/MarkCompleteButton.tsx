"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import { setLessonComplete } from "./actions";

export default function MarkCompleteButton({
  lessonId,
  completed,
  nextHref,
}: {
  lessonId: string;
  completed: boolean;
  nextHref: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      const result = await setLessonComplete(lessonId, !completed);
      if (!result.success) {
        toast.error(result.error || "Could not save your progress");
        return;
      }
      if (!completed && nextHref) {
        router.push(nextHref);
      } else {
        router.refresh();
      }
    });
  }

  if (completed) {
    return (
      <button
        onClick={handleClick}
        disabled={pending}
        className="rounded-full border border-gold/50 text-gold px-5 py-2.5 text-xs font-semibold hover:bg-gold/10 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 flex-shrink-0"
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
        Completed (tap to undo)
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-full bg-navy text-cream px-5 py-2.5 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 flex-shrink-0"
    >
      {pending && <Loader2 size={14} className="animate-spin" />}
      {nextHref ? "Mark complete & continue" : "Mark complete"}
    </button>
  );
}
