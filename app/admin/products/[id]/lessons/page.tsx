import { createClient } from "@/lib/supabase/server";
import { addLesson, deleteLesson } from "./actions";
import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";

export default async function ManageLessonsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("title").eq("id", id).single();
  const { data: lessons } = await supabase
    .from("course_lessons")
    .select("id, title, video_url, duration_minutes, order_index")
    .eq("product_id", id)
    .order("order_index", { ascending: true });

  return (
    <div>
      <Link href="/admin/products" className="text-xs text-slate hover:text-gold inline-flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back to Products
      </Link>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Lessons — {product?.title}</h1>

      <form action={addLesson} className="rounded-2xl bg-white border border-line p-6 mb-8 grid md:grid-cols-5 gap-3 items-end">
        <input type="hidden" name="productId" value={id} />
        <div className="md:col-span-2">
          <label className="text-xs text-slate">Lesson Title</label>
          <input name="title" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-slate">Video URL (YouTube unlisted link)</label>
          <input name="videoUrl" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate">Duration (min)</label>
          <input name="duration" type="number" className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-slate">Order</label>
          <input name="orderIndex" type="number" defaultValue={(lessons?.length || 0) + 1} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
        <button className="rounded-lg bg-navy text-cream px-4 py-2 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors md:col-span-5">
          Add Lesson
        </button>
      </form>

      <div className="rounded-2xl bg-white border border-line divide-y divide-line">
        {lessons && lessons.length > 0 ? lessons.map((l) => (
          <div key={l.id} className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <PlayCircle size={18} className="text-navy" />
              <div>
                <p className="text-sm font-medium text-navy">{l.title}</p>
                <p className="text-xs text-slate">{l.duration_minutes ? `${l.duration_minutes} min` : "—"}</p>
              </div>
            </div>
            <form action={deleteLesson}>
              <input type="hidden" name="productId" value={id} />
              <input type="hidden" name="lessonId" value={l.id} />
              <button className="text-xs text-red-500 hover:underline">Delete</button>
            </form>
          </div>
        )) : (
          <p className="px-6 py-8 text-sm text-slate text-center">No lessons added yet.</p>
        )}
      </div>
    </div>
  );
}