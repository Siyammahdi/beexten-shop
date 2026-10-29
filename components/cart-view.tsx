"use client";

import Image from "next/image";
import Link from "next/link";
import { updateQuantity, useCart, useHydrated } from "@/lib/cart";
import { formatPrice } from "@/lib/shop";
import { ArrowRightIcon, BagIcon } from "./icons";
import { OrderSummary } from "./order-summary";
import { QuantityStepper } from "./quantity-stepper";

export function CartView() {
  const hydrated = useHydrated();
  const { lines, count, subtotal } = useCart();

  if (!hydrated) {
    return <div className="mt-10 h-64 animate-pulse rounded-[2rem] bg-well" />;
  }

  if (lines.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px] md:items-start lg:grid-cols-[1fr_400px]">
      <div>
        <p className="mb-2 text-sm text-muted">
          {count} item{count === 1 ? "" : "s"}
        </p>
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((line) => (
            <li key={line.slug} className="flex gap-4 py-6 sm:gap-6">
              <Link
                href={`/products/${line.slug}`}
                className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-well sm:w-32"
              >
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-muted">{line.categoryName}</p>
                    <Link
                      href={`/products/${line.slug}`}
                      className="mt-1 block font-medium hover:underline hover:underline-offset-4"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted tabular-nums">
                      {formatPrice(line.price)}
                    </p>
                  </div>
                  <p className="font-medium tabular-nums">
                    {formatPrice(line.price * line.quantity)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <QuantityStepper
                    size="sm"
                    value={line.quantity}
                    max={line.stock}
                    onChange={(q) => updateQuantity(line.slug, q)}
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.slug, 0)}
                    className="text-sm text-muted underline-offset-4 transition hover:text-ink hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition hover:gap-2.5"
        >
          Continue shopping <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <div className="md:sticky md:top-28">
        <OrderSummary subtotal={subtotal}>
          <Link
            href="/checkout"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-canvas transition hover:bg-ink/85"
          >
            Checkout <ArrowRightIcon className="size-4" />
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}

export function EmptyCart() {
  return (
    <div className="mt-10 flex flex-col items-center rounded-[2rem] border border-dashed border-line px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-well">
        <BagIcon className="size-6" />
      </span>
      <h2 className="mt-5 text-xl font-semibold">Your cart is empty</h2>
      <p className="mt-2 max-w-xs text-sm text-muted">
        Looks like you haven&apos;t added anything yet. Let&apos;s fix that.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-canvas transition hover:bg-ink/85"
      >
        Start shopping
      </Link>
    </div>
  );
}
