import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";
import { addLesson, deleteLesson, moveLesson, saveInstructor, updateLesson } from "./actions";

const inputClass = "w-full rounded-lg border border-line px-3 py-2 text-sm bg-white";

export default async function ManageLessonsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("title, metadata").eq("id", id).single();
  const { data: lessons } = await supabase
    .from("course_lessons")
    .select("id, title, video_url, duration_minutes, order_index")
    .eq("product_id", id)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  const list = lessons ?? [];
  const meta = (product?.metadata ?? {}) as { instructor_name?: string; instructor_bio?: string };

  return (
    <div className="max-w-4xl">
      <Link href="/admin/products" className="text-xs text-slate hover:text-gold inline-flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back to Products
      </Link>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Course: {product?.title}</h1>

      {/* Instructor */}
      <form action={saveInstructor} className="rounded-2xl bg-white border border-line p-4 sm:p-6 mb-6 space-y-3">
        <input type="hidden" name="productId" value={id} />
        <h2 className="font-display font-semibold text-navy">Instructor</h2>
        <div>
          <label className="text-xs text-slate">Name</label>
          <input name="instructorName" defaultValue={meta.instructor_name ?? ""} className={`mt-1 ${inputClass}`} />
        </div>
        <div>
          <label className="text-xs text-slate">Short bio (shown on the course page)</label>
          <textarea name="instructorBio" rows={3} defaultValue={meta.instructor_bio ?? ""} className={`mt-1 ${inputClass}`} />
        </div>
        <SubmitButton
          pendingText="Saving…"
          className="rounded-lg bg-navy text-cream px-4 py-2 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors"
        >
          Save instructor
        </SubmitButton>
      </form>

      {/* Add lesson */}
      <form action={addLesson} className="rounded-2xl bg-white border border-line p-4 sm:p-6 mb-8 space-y-3">
        <input type="hidden" name="productId" value={id} />
        <h2 className="font-display font-semibold text-navy">Add a lesson</h2>
        <div className="grid md:grid-cols-6 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs text-slate">Lesson title</label>
            <input name="title" required className={`mt-1 ${inputClass}`} />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-slate">Video link (YouTube or Vimeo)</label>
            <input name="videoUrl" required placeholder="https://youtu.be/..." className={`mt-1 ${inputClass}`} />
          </div>
          <div>
            <label className="text-xs text-slate">Minutes</label>
            <input name="duration" type="number" min="0" className={`mt-1 ${inputClass}`} />
          </div>
        </div>
        <p className="text-xs text-slate/80">
          New lessons go to the end of the list. Use the arrows below to reorder. For YouTube, upload as Unlisted and
          make sure embedding is allowed, otherwise the video will not play inside the page.
        </p>
        <SubmitButton
          pendingText="Adding…"
          className="rounded-lg bg-navy text-cream px-4 py-2 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors"
        >
          Add lesson
        </SubmitButton>
      </form>

      {/* Lessons */}
      <h2 className="font-display font-semibold text-navy mb-3">Lessons ({list.length})</h2>
      <div className="space-y-3">
        {list.map((l: any, i: number) => (
          <div key={l.id} className="rounded-2xl bg-white border border-line p-4">
            <div className="flex items-start gap-3">
              <span className="mt-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">
                {i + 1}
              </span>

              <form action={updateLesson} className="grid flex-1 min-w-0 gap-2 md:grid-cols-6">
                <input type="hidden" name="productId" value={id} />
                <input type="hidden" name="lessonId" value={l.id} />
                <input name="title" defaultValue={l.title} required className={`md:col-span-2 ${inputClass}`} />
                <input name="videoUrl" defaultValue={l.video_url} required className={`md:col-span-2 ${inputClass}`} />
                <input
                  name="duration"
                  type="number"
                  min="0"
                  defaultValue={l.duration_minutes ?? ""}
                  placeholder="Min"
                  className={inputClass}
                />
                <SubmitButton
                  pendingText="Saving…"
                  className="rounded-lg bg-navy text-cream px-3 py-2 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors"
                >
                  Save
                </SubmitButton>
              </form>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2 border-t border-line pt-3">
              <form action={moveLesson}>
                <input type="hidden" name="productId" value={id} />
                <input type="hidden" name="lessonId" value={l.id} />
                <input type="hidden" name="direction" value="up" />
                <SubmitButton
                  disabled={i === 0}
                  aria-label="Move up"
                  className="rounded-lg border border-line p-2 text-slate hover:text-gold transition-colors"
                >
                  <ArrowUp size={14} />
                </SubmitButton>
              </form>
              <form action={moveLesson}>
                <input type="hidden" name="productId" value={id} />
                <input type="hidden" name="lessonId" value={l.id} />
                <input type="hidden" name="direction" value="down" />
                <SubmitButton
                  disabled={i === list.length - 1}
                  aria-label="Move down"
                  className="rounded-lg border border-line p-2 text-slate hover:text-gold transition-colors"
                >
                  <ArrowDown size={14} />
                </SubmitButton>
              </form>
              <form action={deleteLesson}>
                <input type="hidden" name="productId" value={id} />
                <input type="hidden" name="lessonId" value={l.id} />
                <SubmitButton pendingText="Deleting…" className="px-2 text-xs text-red-500 hover:underline">
                  Delete
                </SubmitButton>
              </form>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-slate">
            No lessons yet. Add the first one above.
          </p>
        )}
      </div>
    </div>
  );
}
