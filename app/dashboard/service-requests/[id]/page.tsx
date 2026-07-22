import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ServiceRequestForm from "./ServiceRequestForm";
export default async function ServiceRequestPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userProduct } = await supabase
    .from("user_products")
    .select("id, order_id, status, products(id, title, type, price)")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!userProduct) redirect("/dashboard/products");

  const product = userProduct.products as any;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy mb-1">{product.title}</h1>
      <p className="text-slate mb-8">Complete the details below so we can process your request.</p>

      <ServiceRequestForm
        userProductId={userProduct.id}
        productId={product.id}
        orderId={userProduct.order_id}
      />
    </div>
  );
}