import { createClient } from "@/lib/supabase/server";
import DeleteProductButton from "./DeleteProductButton";
import { FORM_TEMPLATES } from "@/lib/service-form-templates";
import Link from "next/link";
import {
  ImageIcon,
  Package,
  Plus,
  Pencil,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Layers3,
} from "lucide-react";

const NEEDS_TEMPLATE = ["nin_service", "cac_service"];

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, type, title, price, status, thumbnail_url, metadata")
    .order("created_at", { ascending: false });

  const totalProducts = products?.length ?? 0;

  const publishedProducts =
    products?.filter((p) => p.status === "published").length ?? 0;

  const draftProducts =
    products?.filter((p) => p.status !== "published").length ?? 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Page heading */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <Layers3 size={15} />
            Store Management
          </div>

          <h1 className="font-display text-3xl font-bold text-navy">
            Products
          </h1>

          <p className="mt-2 text-sm text-slate">
            Create, manage and organise your products and services.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy/90 sm:w-auto"
        >
          <Plus size={17} />
          Add New Product
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package size={21} />
            </div>

            <span className="text-xs font-medium text-slate">All products</span>
          </div>

          <p className="mt-4 text-3xl font-bold text-navy">{totalProducts}</p>

          <p className="mt-1 text-sm text-slate">Total products</p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={21} />
            </div>

            <span className="text-xs font-medium text-slate">
              Live products
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-navy">
            {publishedProducts}
          </p>

          <p className="mt-1 text-sm text-slate">Published</p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={21} />
            </div>

            <span className="text-xs font-medium text-slate">
              Not published
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-navy">{draftProducts}</p>

          <p className="mt-1 text-sm text-slate">Draft / other status</p>
        </div>
      </div>

      {/* Product listing */}
      <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-xl font-bold text-navy">
              All Products
            </h2>

            <p className="mt-1 text-sm text-slate">
              Manage your existing products and services.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-navy">
            <Package size={14} />
            {totalProducts} {totalProducts === 1 ? "Product" : "Products"}
          </span>
        </div>

        {/* Empty state */}
        {!products || products.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cream text-slate">
              <Package size={28} />
            </div>

            <h3 className="mt-4 font-semibold text-navy">
              No products available
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-slate">
              You haven't added any products yet. Create your first product to
              get started.
            </p>

            <Link
              href="/admin/products/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy/90"
            >
              <Plus size={16} />
              Add your first product
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream/70 text-xs uppercase tracking-wider text-slate">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-5 py-4 font-semibold">Type / Form</th>
                    <th className="px-5 py-4 font-semibold">Price</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-line">
                  {products.map((p: any) => {
                    const templateKey = (p.metadata as any)?.form_template as
                      | string
                      | undefined;

                    const templateLabel = templateKey
                      ? FORM_TEMPLATES[templateKey]?.label
                      : undefined;

                    const needsTemplate = NEEDS_TEMPLATE.includes(p.type);

                    return (
                      <tr key={p.id} className="transition hover:bg-cream/30">
                        {/* Product image and title */}
                        <td className="px-6 py-4">
                          <div className="flex min-w-[220px] items-center gap-3">
                            {p.thumbnail_url ? (
                              <img
                                src={p.thumbnail_url}
                                alt={p.title}
                                className="h-12 w-12 shrink-0 rounded-xl border border-line object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cream text-slate/50">
                                <ImageIcon size={20} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="font-semibold text-navy">
                                {p.title}
                              </p>

                              <p className="mt-1 text-xs text-slate">
                                ID: {p.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Product type and form */}
                        <td className="px-5 py-4">
                          <p className="font-medium capitalize text-navy">
                            {p.type.replace(/_/g, " ")}
                          </p>

                          {needsTemplate && (
                            <div className="mt-1.5">
                              {templateLabel ? (
                                <span className="inline-flex items-center gap-1 text-xs text-green-700">
                                  <CheckCircle2 size={13} />
                                  {templateLabel}
                                </span>
                              ) : (
                                <Link
                                  href={`/admin/products/${p.id}/edit`}
                                  className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                                >
                                  <AlertCircle size={13} />
                                  No form set. Fix
                                </Link>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4 font-medium text-navy">
                          {p.type === "nin_service"
                            ? "No charge"
                            : `₦${Number(p.price).toLocaleString()}`}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              p.status === "published"
                                ? "bg-green-50 text-green-700"
                                : "bg-cream text-slate"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                p.status === "published"
                                  ? "bg-green-500"
                                  : "bg-slate-400"
                              }`}
                            />

                            {p.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy transition hover:text-gold"
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>

                            {p.type === "course" && (
                              <Link
                                href={`/admin/products/${p.id}/lessons`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold transition hover:text-navy"
                              >
                                <BookOpen size={14} />
                                Lessons
                              </Link>
                            )}

                            <DeleteProductButton
                              productId={p.id}
                              title={p.title}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile product cards */}
            <div className="space-y-3 p-4 md:hidden">
              {products.map((p: any) => {
                const templateKey = (p.metadata as any)?.form_template as
                  | string
                  | undefined;

                const templateLabel = templateKey
                  ? FORM_TEMPLATES[templateKey]?.label
                  : undefined;

                const needsTemplate = NEEDS_TEMPLATE.includes(p.type);

                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-line bg-white p-4"
                  >
                    {/* Product details */}
                    <div className="flex items-start gap-3">
                      {p.thumbnail_url ? (
                        <img
                          src={p.thumbnail_url}
                          alt={p.title}
                          className="h-16 w-16 shrink-0 rounded-xl border border-line object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-cream text-slate/50">
                          <ImageIcon size={23} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-semibold text-navy">
                          {p.title}
                        </h3>

                        <p className="mt-1 text-xs capitalize text-slate">
                          {p.type.replace(/_/g, " ")}
                        </p>

                        <span
                          className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            p.status === "published"
                              ? "bg-green-50 text-green-700"
                              : "bg-cream text-slate"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              p.status === "published"
                                ? "bg-green-500"
                                : "bg-slate-400"
                            }`}
                          />

                          {p.status}
                        </span>
                      </div>
                    </div>

                    {/* Price and request form */}
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate">
                          Price
                        </p>

                        <p className="mt-1 font-bold text-navy">
                          {p.type === "nin_service"
                            ? "No charge"
                            : `₦${Number(p.price).toLocaleString()}`}
                        </p>
                      </div>

                      {needsTemplate && (
                        <div className="text-right">
                          <p className="text-[11px] font-medium uppercase tracking-wider text-slate">
                            Request form
                          </p>

                          {templateLabel ? (
                            <p className="mt-1 max-w-[150px] text-xs font-medium text-green-700">
                              {templateLabel}
                            </p>
                          ) : (
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-700"
                            >
                              <AlertCircle size={13} />
                              Fix form
                            </Link>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mobile actions */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-cream px-3 py-2 text-xs font-semibold text-navy transition hover:bg-gold/15"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>

                      {p.type === "course" && (
                        <Link
                          href={`/admin/products/${p.id}/lessons`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gold/10 px-3 py-2 text-xs font-semibold text-gold transition hover:bg-gold/20"
                        >
                          <BookOpen size={14} />
                          Manage Lessons
                        </Link>
                      )}

                      <div className="ml-auto">
                        <DeleteProductButton productId={p.id} title={p.title} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
