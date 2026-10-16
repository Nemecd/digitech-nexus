"use server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notify } from "@/lib/notify";
import { revalidatePath } from "next/cache";

export async function submitResubmission(data: {
  serviceRequestId: string;
  userProductId: string;
  orderId: string;   // kept so the form needs no change; the real value is read from the database
  productId: string; // same
  notes: string;
  documentPaths: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: owned } = await supabase
    .from("user_products")
    .select("id, product_id, order_id, status")
    .eq("id", data.userProductId)
    .eq("user_id", user.id)
    .single();
  if (!owned || owned.status !== "awaiting_docs") throw new Error("Nothing to resubmit for this request");

  // The request must belong to this purchase and this customer
  const { data: request } = await supabase
    .from("service_requests")
    .select("id")
    .eq("id", data.serviceRequestId)
    .eq("user_id", user.id)
    .eq("order_id", owned.order_id)
    .eq("product_id", owned.product_id)
    .single();
  if (!request) throw new Error("Request not found");

  if (!data.documentPaths.every((p) => p.startsWith(`${user.id}/`))) {
    throw new Error("Invalid document upload");
  }

  const admin = createAdminClient();

  const { error } = await admin.from("service_request_updates").insert({
    service_request_id: request.id,
    notes: data.notes,
    document_urls: data.documentPaths,
  });
  if (error) throw new Error("Could not submit documents");

  await admin.from("service_requests").update({ status: "in_review" }).eq("id", request.id);
  await admin.from("user_products").update({ status: "in_review" }).eq("id", owned.id);

  await notify(user.id, "Documents submitted", "Your additional documents have been received and are under review.", "service_status");

  revalidatePath("/dashboard/products");
}