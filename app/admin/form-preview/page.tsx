"use client";
import { useState } from "react";
import { FORM_TEMPLATES } from "@/lib/service-form-templates";
import ServiceRequestForm from "@/app/dashboard/service-requests/[id]/ServiceRequestForm";

export default function FormPreviewPage() {
  const [selected, setSelected] = useState("");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-1">Form Preview</h1>
      <p className="text-slate mb-6">Preview any service request form without a real purchase.</p>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="rounded-lg border border-line px-4 py-2.5 text-sm bg-white mb-8 w-full max-w-sm"
      >
        <option value="">Select a form to preview…</option>
        {Object.entries(FORM_TEMPLATES).map(([key, t]) => (
          <option key={key} value={key}>{t.label}</option>
        ))}
      </select>

      {selected && (
        <div className="rounded-2xl bg-white border border-line p-6 max-w-lg">
          <ServiceRequestForm
            userProductId="preview"
            productId="preview"
            orderId="preview"
            formTemplate={selected}
            previewMode
          />
        </div>
      )}
    </div>
  );
}