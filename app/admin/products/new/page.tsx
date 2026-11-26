
import Link from "next/link";
import ProductForm from "../ProductForm";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate transition hover:text-gold"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <ProductForm />
    </div>
  );
}
