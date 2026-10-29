import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
