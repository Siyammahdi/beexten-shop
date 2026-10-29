import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Your cart</h1>
      <CartView />
    </div>
  );
}
