"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { BagIcon } from "./icons";

export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-canvas transition hover:bg-ink/85"
    >
      <BagIcon className="size-4" />
      <span className="hidden sm:inline">Cart</span>
      <span className="grid min-w-5 place-items-center rounded-full bg-canvas px-1.5 text-xs font-semibold text-ink tabular-nums">
        {count}
      </span>
    </Link>
  );
}
