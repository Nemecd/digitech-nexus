import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PlayCircle, CheckCircle2 } from "lucide-react";

export default async function CourseViewerPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: ownership } = await supabase
    .from("user_products")
    .select("id, progress")
    .eq("user_id", user.id)
    .eq("product_id", params.id)
    .eq("status", "active")
    .single();

  if (!ownership) redirect("/dashboard/products");

  const { data: product } = await supabase.from("products").select("title").eq("id", params.id).single();
  const { data: lessons } = await supabase
    .from("course_lessons")
    .select("id, title, video_url, duration_minutes")
    .eq("product_id", params.id)
    .order("order_index", { ascending: true });

  const completed: string[] = (ownership.progress as any)?.completedLessons || [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-1">{product?.title}</h1>
      <p className="text-slate mb-8">{completed.length} of {lessons?.length || 0} lessons completed</p>

      <div className="space-y-3">
        {lessons?.map((lesson) => (
          <div key={lesson.id} className="rounded-xl bg-white border border-line p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {completed.includes(lesson.id) ? (
                <CheckCircle2 size={18} className="text-gold" />
              ) : (
                <PlayCircle size={18} className="text-navy" />
              )}
              <div>
                <p className="text-sm font-medium text-navy">{lesson.title}</p>
                {lesson.duration_minutes && <p className="text-xs text-slate">{lesson.duration_minutes} min</p>}
              </div>
            </div>
            <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline font-semibold">
              Watch →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}