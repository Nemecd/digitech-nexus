import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award, CheckCircle2, Circle, ExternalLink, PlayCircle } from "lucide-react";
import { getEmbedUrl } from "@/lib/video";
import SubmitButton from "@/components/SubmitButton";
import MarkCompleteButton from "./MarkCompleteButton";
import { claimCertificate } from "./actions";

export default async function CourseViewerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { id } = await params;
  const { lesson: lessonParam } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // limit(1) so a student who bought the course twice can still open it
  const { data: owned } = await supabase
    .from("user_products")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", id)
    .eq("status", "active")
    .limit(1);
  if (!owned || owned.length === 0) redirect("/dashboard/products");

  const [{ data: product }, { data: lessons }, { data: progress }, { data: certificate }] = await Promise.all([
    supabase.from("products").select("title, metadata").eq("id", id).single(),
    supabase
      .from("course_lessons")
      .select("id, title, video_url, duration_minutes, order_index")
      .eq("product_id", id)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id).eq("product_id", id),
    supabase.from("course_certificates").select("id").eq("user_id", user.id).eq("product_id", id).maybeSingle(),
  ]);

  const list = lessons ?? [];
  const completedIds = new Set((progress ?? []).map((p: any) => p.lesson_id as string));
  const doneCount = list.filter((l: any) => completedIds.has(l.id)).length;
  const percent = list.length ? Math.round((doneCount / list.length) * 100) : 0;
  const allDone = list.length > 0 && doneCount === list.length;

  // Resume: the lesson in the link, otherwise the first one not finished yet
  const requested = list.find((l: any) => l.id === lessonParam);
  const current = requested ?? list.find((l: any) => !completedIds.has(l.id)) ?? list[0] ?? null;
  const currentIndex = current ? list.findIndex((l: any) => l.id === current.id) : -1;
  const prev = currentIndex > 0 ? list[currentIndex - 1] : null;
  const next = currentIndex >= 0 ? list[currentIndex + 1] ?? null : null;
  const embedUrl = current ? getEmbedUrl(current.video_url) : null;
  const instructor = (product?.metadata as any)?.instructor_name as string | undefined;

  const lessonHref = (lessonId: string) => `/dashboard/courses/${id}?lesson=${lessonId}`;

  return (
    <div>
      <Link href="/dashboard/products" className="text-xs text-slate hover:text-gold inline-flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> My Products
      </Link>

      <h1 className="font-display text-2xl font-semibold text-navy">{product?.title}</h1>
      {instructor && <p className="text-sm text-slate mt-1">Instructor: {instructor}</p>}

      <div className="mt-5 rounded-2xl bg-white border border-line p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-slate mb-2">
          <span>
            {doneCount} of {list.length} lessons completed
          </span>
          <span className="font-semibold text-navy">{percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-cream overflow-hidden">
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {allDone && (
        <div className="mt-5 rounded-2xl bg-navy p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award size={26} className="text-gold flex-shrink-0" />
            <div>
              <p className="font-display font-semibold text-cream">You&apos;ve completed this course</p>
              <p className="text-xs text-cream/65">Your certificate of completion is ready.</p>
            </div>
          </div>
          {certificate ? (
            <Link
              href={`/certificate/${certificate.id}`}
              className="rounded-full bg-gold text-navy px-5 py-2.5 text-xs font-semibold text-center hover:bg-gold/90 transition-colors"
            >
              View certificate
            </Link>
          ) : (
            <form action={claimCertificate}>
              <input type="hidden" name="productId" value={id} />
              <SubmitButton
                pendingText="Preparing…"
                className="w-full rounded-full bg-gold text-navy px-5 py-2.5 text-xs font-semibold hover:bg-gold/90 transition-colors"
              >
                Get my certificate
              </SubmitButton>
            </form>
          )}
        </div>
      )}

      {!current ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-10 text-center">
          <p className="text-slate">Lessons for this course are being added. Check back soon.</p>
        </div>
      ) : (
        <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 min-w-0">
            <div className="rounded-2xl overflow-hidden bg-navy aspect-video">
              {embedUrl ? (
                <iframe
                  key={current.id}
                  src={embedUrl}
                  title={current.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="text-cream/70 text-sm">This video can&apos;t be played inside the page.</p>
                  <a
                    href={current.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gold text-navy px-5 py-2 text-xs font-semibold inline-flex items-center gap-2"
                  >
                    Open video <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-slate">
                  Lesson {currentIndex + 1} of {list.length}
                </p>
                <h2 className="font-display text-lg font-semibold text-navy">{current.title}</h2>
              </div>
              <MarkCompleteButton
                lessonId={current.id}
                completed={completedIds.has(current.id)}
                nextHref={next ? lessonHref(next.id) : null}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              {prev ? (
                <Link href={lessonHref(prev.id)} className="text-slate hover:text-gold transition-colors">
                  &larr; Previous lesson
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={lessonHref(next.id)} className="text-slate hover:text-gold transition-colors">
                  Next lesson &rarr;
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>

          <aside className="rounded-2xl bg-white border border-line overflow-hidden">
            <p className="px-4 py-3 text-xs font-semibold text-navy border-b border-line">Lessons</p>
            <div className="divide-y divide-line max-h-[28rem] overflow-y-auto">
              {list.map((l: any, i: number) => {
                const done = completedIds.has(l.id);
                const active = l.id === current.id;
                return (
                  <Link
                    key={l.id}
                    href={lessonHref(l.id)}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      active ? "bg-gold/10" : "hover:bg-cream"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 size={17} className="text-gold mt-0.5 flex-shrink-0" />
                    ) : active ? (
                      <PlayCircle size={17} className="text-navy mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle size={17} className="text-slate/40 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm text-navy ${active ? "font-semibold" : ""}`}>
                        {i + 1}. {l.title}
                      </p>
                      {l.duration_minutes ? <p className="text-xs text-slate">{l.duration_minutes} min</p> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
