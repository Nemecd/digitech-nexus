import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import ReviewForm, { DeleteReviewButton } from "./ReviewForm";
import { ArrowRight, BookOpen, MonitorPlay, PlayCircle, Star, UserRound } from "lucide-react";

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(value) ? "fill-gold text-gold" : "text-line"} />
      ))}
    </span>
  );
}

// "Chinedu Okafor" -> "Chinedu O." so reviews never show full names
function displayName(full: string | null) {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Verified buyer";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, type, title, description, price, thumbnail_url, metadata")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (!product) notFound();

  const isCourse = product.type === "course";
  const isEbook = product.type === "ebook";
  const meta = (product.metadata ?? {}) as { instructor_name?: string; instructor_bio?: string };

  const { data: { user } } = await supabase.auth.getUser();

  let ownedId: string | null = null;
  let isAdmin = false;
  if (user) {
    const [{ data: owned }, { data: profile }] = await Promise.all([
      supabase
        .from("user_products")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", id)
        .in("status", ["active", "completed"])
        .limit(1),
      supabase.from("profiles").select("role").eq("id", user.id).single(),
    ]);
    ownedId = owned && owned.length > 0 ? (owned[0].id as string) : null;
    isAdmin = profile?.role === "admin";
  }
  const owned = isCourse || isEbook ? ownedId : null;

  // Titles and durations only. Video links are never read here.
  const admin = createAdminClient();
  const { data: lessons } = isCourse
    ? await admin
        .from("course_lessons")
        .select("id, title, duration_minutes")
        .eq("product_id", id)
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: true })
    : { data: null };

  const { data: reviewRows } = await supabase
    .from("product_reviews")
    .select("id, user_id, rating, comment, created_at")
    .eq("product_id", id)
    .order("created_at", { ascending: false })
    .limit(200);

  const reviews = reviewRows ?? [];
  const reviewerIds = Array.from(new Set(reviews.map((r: any) => r.user_id as string)));
  const { data: reviewers } =
    reviewerIds.length > 0
      ? await admin.from("profiles").select("id, full_name").in("id", reviewerIds)
      : { data: [] as any[] };
  const nameOf = new Map<string, string>(
    (reviewers ?? []).map((p: any): [string, string] => [p.id, displayName(p.full_name)])
  );

  const average = reviews.length
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;
  const myReview = user ? reviews.find((r: any) => r.user_id === user.id) : null;

  const FallbackIcon = isEbook ? BookOpen : MonitorPlay;
  const lessonList = lessons ?? [];
  const totalMinutes = lessonList.reduce((sum: number, l: any) => sum + (l.duration_minutes || 0), 0);

  return (
    <>
      <Navbar />
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 items-start">
            {product.thumbnail_url ? (
              <img src={product.thumbnail_url} alt={product.title} className="w-full rounded-2xl object-cover aspect-square" />
            ) : (
              <div className="w-full rounded-2xl bg-cream flex items-center justify-center aspect-square">
                <FallbackIcon size={48} className="text-slate/30" />
              </div>
            )}

            <div>
              <span className="text-xs font-semibold text-gold uppercase tracking-wide">{product.type.replace("_", " ")}</span>
              <h1 className="font-display text-3xl font-semibold text-navy mt-2 mb-3">{product.title}</h1>

              {reviews.length > 0 && (isCourse || isEbook) && (
                <div className="flex items-center gap-2 text-sm text-slate mb-3">
                  <Stars value={average} />
                  <span className="font-semibold text-navy">{average.toFixed(1)}</span>
                  <span>({reviews.length})</span>
                </div>
              )}

              {meta.instructor_name && (
                <p className="text-sm text-slate mb-3 inline-flex items-center gap-1.5">
                  <UserRound size={14} className="text-gold" /> Taught by {meta.instructor_name}
                </p>
              )}

              <p className="text-slate leading-relaxed mb-8 whitespace-pre-wrap">{product.description}</p>

              {owned ? (
                <div className="rounded-2xl border border-gold/40 bg-gold/5 p-5">
                  <p className="text-sm font-semibold text-navy mb-3">You own this {isCourse ? "course" : "eBook"}</p>
                  <Link
                    href={isCourse ? `/dashboard/courses/${product.id}` : `/dashboard/products/${owned}`}
                    className="rounded-full bg-navy text-cream px-5 py-2.5 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center gap-2"
                  >
                    {isCourse ? "Continue learning" : "Open & download"} <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-line p-5">
                  <span className="font-display text-2xl font-semibold text-gold">
                    ₦{Number(product.price).toLocaleString()}
                  </span>
                  <AddToCartButton id={product.id} title={product.title} price={Number(product.price)} type={product.type} />
                </div>
              )}
            </div>
          </div>

          {isCourse && lessonList.length > 0 && (
            <section className="mt-12">
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
                <h2 className="font-display text-xl font-semibold text-navy">What&apos;s inside</h2>
                <p className="text-xs text-slate">
                  {lessonList.length} lessons{totalMinutes > 0 ? ` · ${totalMinutes} min` : ""}
                </p>
              </div>
              <div className="rounded-2xl border border-line divide-y divide-line">
                {lessonList.map((l: any, i: number) => (
                  <div key={l.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <PlayCircle size={16} className="text-slate/50 flex-shrink-0" />
                      <p className="text-sm text-navy">
                        {i + 1}. {l.title}
                      </p>
                    </div>
                    {l.duration_minutes ? (
                      <span className="text-xs text-slate flex-shrink-0">{l.duration_minutes} min</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {meta.instructor_name && (
            <section className="mt-12">
              <h2 className="font-display text-xl font-semibold text-navy mb-3">About the instructor</h2>
              <div className="rounded-2xl border border-line p-5 flex gap-4">
                <div className="w-11 h-11 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                  <UserRound size={20} />
                </div>
                <div>
                  <p className="font-semibold text-navy">{meta.instructor_name}</p>
                  {meta.instructor_bio && (
                    <p className="text-sm text-slate mt-1 leading-relaxed whitespace-pre-wrap">{meta.instructor_bio}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {(isCourse || isEbook) && (
            <section className="mt-12">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <h2 className="font-display text-xl font-semibold text-navy">Reviews</h2>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate">
                    <Stars value={average} />
                    <span className="font-semibold text-navy">{average.toFixed(1)}</span>
                    <span>({reviews.length})</span>
                  </div>
                )}
              </div>

              {owned && (
                <div className="mb-5">
                  <ReviewForm
                    productId={product.id}
                    existingRating={myReview?.rating ?? 0}
                    existingComment={myReview?.comment ?? ""}
                  />
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-sm text-slate">
                  No reviews yet.{owned ? "" : " People who buy this can leave the first one."}
                </p>
              ) : (
                <div className="space-y-3">
                  {reviews.slice(0, 10).map((r: any) => (
                    <div key={r.id} className="rounded-xl border border-line p-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Stars value={r.rating} size={13} />
                          <span className="text-sm font-medium text-navy">{nameOf.get(r.user_id) || "Verified buyer"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate">
                            {new Date(r.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          {isAdmin && <DeleteReviewButton reviewId={r.id} productId={product.id} />}
                        </div>
                      </div>
                      {r.comment && <p className="text-sm text-slate mt-2 whitespace-pre-wrap">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
