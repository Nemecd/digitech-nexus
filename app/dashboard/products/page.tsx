
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DownloadButton from "./DownloadButton";
import Link from "next/link";
import { Package, CheckCircle2 } from "lucide-react";

export default async function MyProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: items, error } = await supabase
    .from("user_products")
    .select("id, status, acquired_at, products(id, title, type)")
    .eq("user_id", user.id)
    .order("acquired_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-navy">
          My Products
        </h1>
        <p className="text-sm text-slate mt-1">
          View and manage your purchases and service requests.
        </p>
      </div>

      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item: any) => {
            const product = item.products;
            const status = item.status?.toLowerCase() || "unknown";
            const productType = product?.type || "";
            const productTitle = product?.title?.trim();

            const isService = [
              "nin_service",
              "cac_service",
              "visa_service",
              "student_placement",
            ].includes(productType);

            return (
              <div
                key={item.id}
                className="w-full min-w-0 rounded-2xl bg-white border border-line p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product information */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                    <Package size={19} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy text-sm sm:text-base leading-snug break-words">
                      {productTitle || "Product information unavailable"}
                    </p>

                    <p className="text-xs text-slate mt-1 capitalize">
                      {productType
                        ? productType.replace(/_/g, " ")
                        : "Product"}{" "}
                      <span className="mx-1">·</span>
                      {status.replace(/_/g, " ")}
                    </p>
                  </div>

                  {/* Status indicator */}
                  {status === "completed" && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 rounded-full px-3 py-1.5">
                      <CheckCircle2 size={13} />
                      Completed
                    </span>
                  )}

                  {status === "active" && (
                    <span className="shrink-0 text-xs font-semibold text-green-700 bg-green-50 rounded-full px-3 py-1.5">
                      Active
                    </span>
                  )}
                </div>

                {/* Product actions */}
                <div className="mt-4 pt-3 border-t border-line/70 flex flex-wrap items-center gap-2">
                  {productType === "ebook" && status === "active" && (
                    <DownloadButton userProductId={item.id} />
                  )}

                  {productType === "course" && status === "active" && (
                    <Link
                      href={`/dashboard/courses/${product?.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-navy text-cream px-4 py-2.5 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors"
                    >
                      Continue Learning
                    </Link>
                  )}

                  {(status === "pending" || status === "in_review") && (
                    <span className="text-xs px-3 py-2 rounded-full bg-gold/10 text-gold font-semibold">
                      Awaiting Details
                    </span>
                  )}

                  {isService && status === "pending" && (
                    <Link
                      href={`/dashboard/service-requests/${item.id}`}
                      className="flex-1 sm:flex-none text-center rounded-full bg-gold text-navy px-4 py-2.5 text-xs font-semibold hover:bg-gold/90 transition-colors"
                    >
                      Complete Your Request
                    </Link>
                  )}

                  {status === "in_review" && (
                    <span className="text-xs px-3 py-2 rounded-full bg-cream text-slate font-semibold">
                      Under Review
                    </span>
                  )}

                  {status === "completed" && (
                    <span className="text-xs text-slate">
                      Your request has been completed.
                    </span>
                  )}

                  {status === "awaiting_docs" && (
                    <Link
                      href={`/dashboard/service-requests/${item.id}/resubmit`}
                      className="w-full sm:w-auto text-center rounded-full bg-gold text-navy px-4 py-2.5 text-xs font-semibold hover:bg-gold/90 transition-colors"
                    >
                      Documents Needed
                    </Link>
                  )}

                  {status === "active" &&
                    productType !== "ebook" &&
                    productType !== "course" && (
                      <span className="text-xs text-slate">
                        This product is active.
                      </span>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center rounded-2xl border border-line bg-white p-8 sm:p-12">
          <div className="w-14 h-14 mx-auto rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
            <Package size={25} />
          </div>

          <p className="text-slate mb-5 text-sm">
            You haven&apos;t purchased or requested anything yet.
          </p>

          <Link
            href="/shop"
            className="rounded-full bg-navy text-cream px-6 py-3 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors inline-block"
          >
            Browse the Shop
          </Link>
        </div>
      )}
    </div>
  );
}
