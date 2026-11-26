"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Loader2,
  ImageIcon,
  BookOpen,
  FileText,
  Package,
  UploadCloud,
  Sparkles,
} from "lucide-react";

import { FORM_TEMPLATES } from "@/lib/service-form-templates";
import { uploadThumbnail, uploadEbook } from "@/lib/admin-uploads";
import { isBookingOnly } from "@/lib/booking-config";
import { createProduct } from "./actions";

export default function ProductForm() {
  const [type, setType] = useState("nin_service");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  const isEbook = type === "ebook";
  const bookingOnly = isBookingOnly(type);

  const offRatio =
    isEbook && dims ? Math.abs(dims.w / dims.h - 2 / 3) > 0.07 : false;

  const relevantTemplates = Object.entries(FORM_TEMPLATES).filter(([key]) =>
    type === "nin_service"
      ? key.startsWith("nin_")
      : type === "cac_service"
        ? key.startsWith("cac_")
        : false,
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const fd = new FormData(form);

    const title = String(fd.get("title") || "").trim();
    const description = String(fd.get("description") || "").trim();
    const thumbnail = fd.get("thumbnail") as File | null;
    const ebook = fd.get("ebookFile") as File | null;
    const formTemplate = String(fd.get("formTemplate") || "");

    const price = bookingOnly ? 0 : Number(fd.get("price"));

    if (!title) {
      toast.error("Please enter a product title.");
      return;
    }

    if (!bookingOnly && (!Number.isFinite(price) || price < 0)) {
      toast.error("Please enter a valid product price.");
      return;
    }

    if ((type === "nin_service" || type === "cac_service") && !formTemplate) {
      toast.error("Please select a request form template.");
      return;
    }

    if (isEbook && (!ebook || ebook.size === 0)) {
      toast.error("Please attach the eBook PDF.");
      return;
    }

    if (isEbook && ebook && !ebook.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are accepted for eBooks.");
      return;
    }

    setLoading(true);

    try {
      const thumbnailUrl =
        thumbnail && thumbnail.size > 0
          ? await uploadThumbnail(thumbnail)
          : null;

      const fileUrl =
        isEbook && ebook && ebook.size > 0 ? await uploadEbook(ebook) : null;

      const result = await createProduct({
        type,
        title,
        description,
        price,
        thumbnailUrl,
        fileUrl,
        formTemplate: formTemplate || null,
      });

      if (!result.success) {
        throw new Error(result.error || "Could not create product.");
      }

      toast.success("Product added successfully!");

      form.reset();
      setPreview(null);
      setDims(null);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate/40 focus:border-gold focus:ring-4 focus:ring-gold/10";

  const labelClass = "block text-sm font-semibold text-navy";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 overflow-hidden rounded-3xl border border-line bg-white shadow-sm"
    >
      {/* Form heading */}
      <div className="border-b border-line bg-gradient-to-r from-navy to-navy-light px-5 py-6 text-white sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-gold">
              <Sparkles size={13} />
              Product Management
            </div>

            <h2 className="font-display text-xl font-semibold sm:text-2xl">
              Add New Product
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
              Create a new product, service, course or eBook for your customers.
            </p>
          </div>

          <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 sm:flex">
            <Package size={27} className="text-gold" />
          </div>
        </div>
      </div>

      <div className="space-y-8 p-5 sm:p-8">
        {/* Basic information */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <FileText size={18} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-navy">Basic Information</h3>
              <p className="text-xs text-slate">
                Enter the main details of your product.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Product Type</label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputClass}
              >
                <option value="nin_service">NIN Service</option>
                <option value="cac_service">CAC Service</option>
                <option value="visa_service">Visa Service</option>
                <option value="student_placement">Student Placement</option>
                <option value="course">Course</option>
                <option value="ebook">eBook</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Product Title</label>

              <input
                name="title"
                type="text"
                required
                placeholder="Enter product or service title"
                className={inputClass}
              />
            </div>

            {!bookingOnly && (
              <div>
                <label className={labelClass}>Price (₦)</label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate">
                    ₦
                  </span>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            )}

            {bookingOnly && (
              <div className="flex items-center rounded-xl border border-gold/20 bg-gold/5 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Booking-based service
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate">
                    This service has no online payment. Customers submit their
                    request through the service form.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5">
            <label className={labelClass}>Description</label>

            <textarea
              name="description"
              rows={4}
              placeholder="Describe this product or service..."
              className={`${inputClass} resize-y`}
            />

            <p className="mt-2 text-xs text-slate/70">
              Provide useful information about what customers should expect.
              Long descriptions are supported.
            </p>
          </div>
        </section>

        {/* Request form template */}
        {(type === "nin_service" || type === "cac_service") && (
          <>
            <div className="border-t border-line" />

            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <FileText size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-navy">
                    Request Form Configuration
                  </h3>
                  <p className="text-xs text-slate">
                    Choose the form customers must complete.
                  </p>
                </div>
              </div>

              <label className={labelClass}>Request Form Template</label>

              <select
                name="formTemplate"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select a request form
                </option>

                {relevantTemplates.map(([key, template]) => (
                  <option key={key} value={key}>
                    {template.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-slate/70">
                The selected template determines the information and documents
                customers will be asked to provide.
              </p>
            </section>
          </>
        )}

        <div className="border-t border-line" />

        {/* Media uploads */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <ImageIcon size={18} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-navy">Product Media</h3>
              <p className="text-xs text-slate">
                Upload an image and any required product file.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Thumbnail */}
            <div>
              <label className={labelClass}>
                {isEbook ? "Book Cover Image" : "Thumbnail Image"}
              </label>

              <label className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-cream/50 px-4 py-6 text-center transition hover:border-gold hover:bg-gold/5">
                <UploadCloud size={25} className="mb-2 text-gold" />

                <span className="text-sm font-semibold text-navy">
                  Click to upload image
                </span>

                <span className="mt-1 text-xs text-slate">
                  PNG, JPG or WebP
                </span>

                <input
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    setDims(null);
                    setPreview(file ? URL.createObjectURL(file) : null);
                  }}
                />
              </label>

              {isEbook && (
                <p className="mt-2 text-xs text-slate/70">
                  Recommended book-cover ratio: 2:3, for example 1200 × 1800
                  pixels.
                </p>
              )}

              {/* Image preview */}
              <div className="mt-4 flex items-center gap-4">
                <div
                  className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-cream ${
                    isEbook ? "aspect-[2/3] w-24" : "aspect-square w-24"
                  }`}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Product image preview"
                      onLoad={(e) =>
                        setDims({
                          w: e.currentTarget.naturalWidth,
                          h: e.currentTarget.naturalHeight,
                        })
                      }
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate/40">
                      {isEbook ? (
                        <BookOpen size={24} />
                      ) : (
                        <ImageIcon size={24} />
                      )}
                      <span className="text-[9px]">Preview</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">
                    Image Preview
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate">
                    {preview
                      ? "Your selected image is ready for upload."
                      : "Your selected image will appear here."}
                  </p>
                </div>
              </div>

              {offRatio && (
                <div className="mt-3 rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-xs leading-relaxed text-navy">
                  This image is not in the recommended 2:3 book-cover shape.
                  Some edges may be trimmed. Check the preview.
                </div>
              )}
            </div>

            {/* eBook PDF */}
            {isEbook && (
              <div>
                <label className={labelClass}>eBook File (PDF)</label>

                <label className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-cream/50 px-4 py-6 text-center transition hover:border-gold hover:bg-gold/5">
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <FileText size={23} />
                  </div>

                  <span className="text-sm font-semibold text-navy">
                    Choose eBook PDF
                  </span>

                  <span className="mt-1 text-xs text-slate">
                    PDF files only
                  </span>

                  <input
                    name="ebookFile"
                    type="file"
                    accept=".pdf,application/pdf"
                    required
                    className="sr-only"
                  />
                </label>

                <p className="mt-3 text-xs leading-relaxed text-slate/70">
                  The uploaded PDF will be stored securely and used for customer
                  downloads after purchase.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Course notice */}
        {type === "course" && (
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
            <div className="flex items-start gap-3">
              <BookOpen size={19} className="mt-0.5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-semibold text-navy">Course setup</p>
                <p className="mt-1 text-xs leading-relaxed text-slate">
                  Save this course first. You can then use the Manage Lessons
                  option in the product list to add video lessons.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-slate/70">
            Please review the information before adding this product.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Saving Product...
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Product
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
