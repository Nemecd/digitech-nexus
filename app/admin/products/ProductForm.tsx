"use client";
import { useState } from "react";
import { createProduct } from "./actions";
import { Plus } from "lucide-react";

export default function ProductForm() {
  const [type, setType] = useState("nin_service");

  return (
    <form action={createProduct} className="rounded-2xl bg-white border border-line p-6 mb-10 space-y-4">
      <div className="grid md:grid-cols-5 gap-3 items-end">
        <div className="md:col-span-1">
          <label className="text-xs text-slate">Type</label>
          <select
            name="type"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
          >
            <option value="nin_service">NIN Service</option>
            <option value="cac_service">CAC Service</option>
            <option value="visa_service">Visa Service</option>
            <option value="student_placement">Student Placement</option>
            <option value="course">Course</option>
            <option value="ebook">eBook</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-slate">Title</label>
          <input name="title" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-slate">Price (₦)</label>
          <input name="price" type="number" required className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="rounded-lg bg-navy text-cream px-4 py-2 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors inline-flex items-center justify-center gap-1.5">
          <Plus size={16} /> Add
        </button>
      </div>

      <div>
        <label className="text-xs text-slate">Description</label>
        <textarea name="description" rows={2} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate">Thumbnail Image</label>
          <input name="thumbnail" type="file" accept="image/*" className="mt-1 w-full text-sm" />
        </div>

        {type === "ebook" && (
          <div>
            <label className="text-xs text-slate">eBook File (PDF)</label>
            <input name="ebookFile" type="file" accept=".pdf" className="mt-1 w-full text-sm" />
          </div>
        )}
      </div>

      {type === "course" && (
        <p className="text-xs text-slate">
          Save this course first, then use &quot;Manage Lessons&quot; in the table below to add video lessons.
        </p>
      )}
    </form>
  );
}