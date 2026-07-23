import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditProductForm from "./EditProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, type, title, description, price, status, thumbnail_url, file_url")
    .eq("id", id)
    .single();

  if (!product) redirect("/admin/products");

  return (
    <div>
      <Link href="/admin/products" className="text-xs text-slate hover:text-gold inline-flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back to Products
      </Link>
      <h1 className="font-display text-2xl font-semibold text-navy mb-8">Edit Product</h1>
      <EditProductForm product={product} />
    </div>
  );
}