"use server";
import { createClient } from "@/lib/supabase/server";
import { notify } from "@/lib/notify";
import { revalidatePath } from "next/cache";

const CUSTOMER_STATUS: Record<string, string> = {
  submitted: "in_review",
  in_review: "in_review",
  awaiting_docs: "awaiting_docs",
  completed: "completed",
  rejected: "rejected",
};

const NOTIFY_TEXT: Record<string, { title: string; message: string }> = {
  in_review: { title: "Request in review", message: "Your service request is being reviewed." },
  completed: { title: "Request completed", message: "Your service request has been completed." },
  rejected: { title: "Request rejected", message: "Your service request could not be completed. Please contact support." },
};

export async function updateRequestStatus(formData: FormData) {
  const requestId = formData.get("requestId") as string;
  const status = formData.get("status") as string;
  const adminNotes = formData.get("adminNotes") as string;
  const adminRequestNote = formData.get("adminRequestNote") as string;

  const supabase = await createClient();

  const { data: request } = await supabase
    .from("service_requests")
    .select("user_id, order_id, product_id, status")
    .eq("id", requestId)
    .single();
  if (!request) return;

  const { error } = await supabase
    .from("service_requests")
    .update({
      status,
      admin_notes: adminNotes,
      admin_request_note: status === "awaiting_docs" ? adminRequestNote : null,
    })
    .eq("id", requestId);
  if (error) return;

  const customerStatus = CUSTOMER_STATUS[status];
  if (customerStatus) {
    await supabase
      .from("user_products")
      .update({ status: customerStatus })
      .eq("order_id", request.order_id)
      .eq("product_id", request.product_id);
  }

  if (request.status !== status) {
    if (status === "awaiting_docs") {
      await notify(
        request.user_id,
        "Additional documents needed",
        adminRequestNote || "We need additional information to process your request.",
        "service_status"
      );
    } else if (NOTIFY_TEXT[status]) {
      await notify(request.user_id, NOTIFY_TEXT[status].title, NOTIFY_TEXT[status].message, "service_status");
    }
  }

  revalidatePath(`/admin/service-requests/${requestId}`);
  revalidatePath("/admin/service-requests");
}