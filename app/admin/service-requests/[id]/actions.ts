"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateRequestStatus(formData: FormData) {
  const requestId = formData.get("requestId") as string;
  const status = formData.get("status") as string;
  const adminNotes = formData.get("adminNotes") as string;
  const adminRequestNote = formData.get("adminRequestNote") as string;

  const supabase = await createClient();

  const { data: request } = await supabase
    .from("service_requests")
    .select("user_id, order_id, product_id")
    .eq("id", requestId)
    .single();
  if (!request) return;

  await supabase.from("service_requests").update({
    status,
    admin_notes: adminNotes,
    admin_request_note: status === "awaiting_docs" ? adminRequestNote : null,
  }).eq("id", requestId);

  if (status === "completed" || status === "rejected") {
    await supabase
      .from("user_products")
      .update({ status: status === "completed" ? "completed" : "rejected" })
      .eq("order_id", request.order_id)
      .eq("product_id", request.product_id);
  }

  if (status === "awaiting_docs") {
    await supabase
      .from("user_products")
      .update({ status: "awaiting_docs" })
      .eq("order_id", request.order_id)
      .eq("product_id", request.product_id);
  }

  await supabase.from("notifications").insert({
    user_id: request.user_id,
    title: status === "awaiting_docs" ? "Additional documents needed" : `Request ${status.replace("_", " ")}`,
    message: status === "awaiting_docs"
      ? (adminRequestNote || "We need additional information to process your request.")
      : `Your service request status has been updated to ${status.replace("_", " ")}.`,
    type: "service_status",
  });

  revalidatePath(`/admin/service-requests/${requestId}`);
}