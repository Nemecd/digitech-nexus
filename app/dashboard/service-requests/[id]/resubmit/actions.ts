"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitResubmission(data: {
  serviceRequestId: string;
  userProductId: string;
  orderId: string;
  productId: string;
  notes: string;
  documentPaths: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await supabase.from("service_request_updates").insert({
    service_request_id: data.serviceRequestId,
    notes: data.notes,
    document_urls: data.documentPaths,
  });

  await supabase.from("service_requests").update({ status: "in_review" }).eq("id", data.serviceRequestId);
  await supabase.from("user_products").update({ status: "in_review" })
    .eq("order_id", data.orderId).eq("product_id", data.productId);

  await supabase.from("notifications").insert({
    user_id: user.id,
    title: "Documents submitted",
    message: "Your additional documents have been received and are under review.",
    type: "service_status",
  });

  revalidatePath("/dashboard/products");
}