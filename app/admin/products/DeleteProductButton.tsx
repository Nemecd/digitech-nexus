"use client";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteProduct } from "./actions";

export default function DeleteProductButton({ productId, title }: { productId: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const ok = confirm(
      `Remove "${title}"?\n\nIf it has never been purchased it will be deleted. If customers have bought it, it will be archived instead so they keep their access.`
    );
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (!result.success) {
        toast.error(result.error || "Could not remove product");
      } else if (result.archived) {
        toast.success("Archived instead of deleted: this product has purchase history, so existing customers keep access.");
      } else {
        toast.success("Product deleted");
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="text-xs text-red-500 hover:underline disabled:opacity-50 inline-flex items-center gap-1"
    >
      {pending && <Loader2 size={12} className="animate-spin" />}
      {pending ? "Removing…" : "Delete"}
    </button>
  );
}