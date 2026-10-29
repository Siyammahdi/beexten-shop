"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addToCart, useCart, type CartProduct } from "@/lib/cart";
import { CheckIcon } from "./icons";
import { QuantityStepper } from "./quantity-stepper";

export function AddToCart({ product }: { product: CartProduct }) {
  const { lines } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = lines.find((l) => l.slug === product.slug)?.quantity ?? 0;
  const available = product.stock - inCart;

  useEffect(() => {
    if (!added) return;
    const timeout = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timeout);
  }, [added]);

  if (product.stock === 0) {
    return (
      <button
        type="button"
        disabled
        className="h-12 w-full rounded-full bg-well text-sm font-medium text-muted"
      >
        Sold out
      </button>
    );
  }

  return (
    <div>
      <div className="flex gap-3">
        <QuantityStepper
          value={Math.min(quantity, Math.max(available, 1))}
          onChange={setQuantity}
          max={Math.max(available, 1)}
        />
        <button
          type="button"
          disabled={available <= 0}
          onClick={() => {
            addToCart(product, quantity);
            setAdded(true);
            setQuantity(1);
          }}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-canvas transition hover:bg-ink/85 active:scale-[0.98] disabled:bg-well disabled:text-muted"
        >
          {added ? (
            <>
              <CheckIcon className="size-4" /> Added to cart
            </>
          ) : available <= 0 ? (
            "All available stock is in your cart"
          ) : (
            "Add to cart"
          )}
        </button>
      </div>
      <p
        className={`mt-3 text-sm transition ${added ? "opacity-100" : "invisible opacity-0"}`}
      >
        <Link href="/cart" className="font-medium underline underline-offset-4">
          View cart & checkout
        </Link>
      </p>
    </div>
  );
}
