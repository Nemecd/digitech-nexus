"use server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notify } from "@/lib/notify";
import { revalidatePath } from "next/cache";

export async function submitServiceRequest(data: {
  userProductId: string;
  productId: string; // kept so the form needs no change; the real value is read from the database
  orderId: string;   // same
  formData: Record<string, string | Record<string, string>[]>;
  documentPaths: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Ownership comes from the database, never from the browser
  const { data: owned } = await supabase
    .from("user_products")
    .select("id, product_id, order_id")
    .eq("id", data.userProductId)
    .eq("user_id", user.id)
    .single();
  if (!owned) throw new Error("Request not found");

  if (!data.documentPaths.every((p) => p.startsWith(`${user.id}/`))) {
    throw new Error("Invalid document upload");
  }

  const admin = createAdminClient();

  // Claim it first so a double submit can only succeed once
  const { data: claimed } = await admin
    .from("user_products")
    .update({ status: "in_review" })
    .eq("id", owned.id)
    .eq("status", "pending")
    .select("id");
  if (!claimed || claimed.length === 0) throw new Error("This request has already been submitted");

  const { error } = await admin.from("service_requests").insert({
    user_id: user.id,
    product_id: owned.product_id,
    order_id: owned.order_id,
    form_data: data.formData,
    document_urls: data.documentPaths,
    status: "submitted",
  });

  if (error) {
    await admin.from("user_products").update({ status: "pending" }).eq("id", owned.id);
    throw new Error("Could not submit request");
  }

  await notify(user.id, "Request submitted", "Your service request has been received and is under review.", "service_status");

  revalidatePath("/dashboard/products");
}