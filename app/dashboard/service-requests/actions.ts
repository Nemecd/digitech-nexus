"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitServiceRequest(data: {
  userProductId: string;
  productId: string;
  orderId: string;
  notes: string;
  documentPaths: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("service_requests").insert({
    user_id: user.id,
    product_id: data.productId,
    order_id: data.orderId,
    form_data: { notes: data.notes },
    document_urls: data.documentPaths,
    status: "submitted",
  });
  if (error) throw new Error("Could not submit request");

  await supabase.from("user_products").update({ status: "in_review" }).eq("id", data.userProductId);

  await supabase.from("notifications").insert({
    user_id: user.id,
    title: "Request submitted",
    message: "Your service request has been received and is under review.",
    type: "service_status",
  });

  revalidatePath("/dashboard/products");
}