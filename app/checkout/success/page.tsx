import { Suspense } from "react";
import CheckoutSuccessClient from "./success-client";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}