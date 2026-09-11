import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ResubmitForm from "./ResubmitForm";

export default async function ResubmitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userProduct } = await supabase
    .from("user_products")
    .select("id, order_id, products(id, title)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!userProduct) redirect("/dashboard/products");

  const { data: serviceRequest } = await supabase
    .from("service_requests")
    .select("id, admin_request_note")
    .eq("order_id", userProduct.order_id)
    .eq("product_id", (userProduct.products as any).id)
    .single();

  if (!serviceRequest) redirect("/dashboard/products");

  const product = userProduct.products as any;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-1">{product.title}</h1>

      {serviceRequest.admin_request_note && (
        <div className="rounded-xl bg-gold/10 border border-gold/30 p-4 mb-6">
          <p className="text-xs font-semibold text-gold mb-1">Requested from you:</p>
          <p className="text-sm text-navy">{serviceRequest.admin_request_note}</p>
        </div>
      )}

      <ResubmitForm
        serviceRequestId={serviceRequest.id}
        userProductId={userProduct.id}
        orderId={userProduct.order_id}
        productId={product.id}
      />
    </div>
  );
}