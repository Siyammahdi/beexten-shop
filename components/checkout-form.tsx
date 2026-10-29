"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { placeOrder, type CheckoutState } from "@/app/(shop)/checkout/actions";
import { clearCart, useCart, useHydrated } from "@/lib/cart";
import { formatPrice } from "@/lib/shop";
import { EmptyCart } from "./cart-view";
import { CheckIcon } from "./icons";
import { OrderSummary } from "./order-summary";

export function CheckoutForm() {
  const hydrated = useHydrated();
  const { lines, subtotal } = useCart();
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(placeOrder, {
    status: "idle",
  });

  useEffect(() => {
    if (state.status === "success") {
      clearCart();
      window.scrollTo({ top: 0 });
    }
  }, [state]);

  if (state.status === "success") return <Confirmation order={state} />;

  if (!hydrated) {
    return <div className="mt-10 h-96 animate-pulse rounded-[2rem] bg-well" />;
  }

  if (lines.length === 0) return <EmptyCart />;

  const values = state.status === "error" ? state.values : {};

  return (
    <form
      action={formAction}
      className="mt-10 grid gap-10 md:grid-cols-[1fr_320px] md:items-start lg:grid-cols-[1fr_400px]"
    >
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(lines.map((l) => ({ slug: l.slug, quantity: l.quantity })))}
      />

      <div className="space-y-10">
        {state.status === "error" && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}{" "}
            <Link href="/cart" className="font-medium underline underline-offset-4">
              Review cart
            </Link>
          </p>
        )}

        <Fieldset title="Contact">
          <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={values.email} className="sm:col-span-2" />
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" defaultValue={values.phone} className="sm:col-span-2" />
        </Fieldset>

        <Fieldset title="Delivery">
          <Field label="Full name" name="name" autoComplete="name" defaultValue={values.name} className="sm:col-span-2" />
          <Field label="Address" name="address" autoComplete="street-address" defaultValue={values.address} className="sm:col-span-2" />
          <Field label="City" name="city" autoComplete="address-level2" defaultValue={values.city} />
          <Field label="Postal code" name="postal" autoComplete="postal-code" defaultValue={values.postal} />
        </Fieldset>

        <Fieldset title="Payment">
          <div className="flex items-center gap-4 rounded-2xl border border-ink bg-white p-4 sm:col-span-2">
            <span className="grid size-5 place-items-center rounded-full bg-ink text-canvas">
              <CheckIcon className="size-3" />
            </span>
            <div>
              <p className="text-sm font-medium">Cash on delivery</p>
              <p className="text-sm text-muted">Pay when your order arrives at your door.</p>
            </div>
          </div>
        </Fieldset>
      </div>

      <div className="space-y-4 md:sticky md:top-28">
        <ul className="space-y-4 rounded-[2rem] border border-line bg-white p-6 sm:p-8">
          {lines.map((line) => (
            <li key={line.slug} className="flex items-center gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-well">
                <Image src={line.image} alt={line.name} fill sizes="64px" className="object-cover" />
                <span className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold text-canvas">
                  {line.quantity}
                </span>
              </div>
              <p className="min-w-0 flex-1 truncate text-sm font-medium">{line.name}</p>
              <p className="text-sm tabular-nums">{formatPrice(line.price * line.quantity)}</p>
            </li>
          ))}
        </ul>
        <OrderSummary subtotal={subtotal}>
          <button
            type="submit"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-canvas transition hover:bg-ink/85 active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? "Placing order…" : "Place order"}
          </button>
        </OrderSummary>
      </div>
    </form>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold">{title}</legend>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  className = "",
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm text-muted">{label}</span>
      <input
        required
        {...props}
        className="mt-1.5 h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm outline-none transition placeholder:text-muted/60 focus:border-ink focus:ring-4 focus:ring-ink/5"
      />
    </label>
  );
}

function Confirmation({ order }: { order: { number: string; name: string; email: string } }) {
  return (
    <div className="mt-10 flex animate-fade-up flex-col items-center rounded-[2rem] border border-line bg-white px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-emerald-500 text-white">
        <CheckIcon className="size-6" />
      </span>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        Thank you, {order.name}!
      </h2>
      <p className="mt-3 max-w-sm text-muted">
        Your order <span className="font-medium text-ink">#{order.number}</span> is
        confirmed. We&apos;ll contact you at {order.email} when it ships.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/invoice/${order.number}?email=${encodeURIComponent(order.email)}`}
          className="inline-flex h-11 items-center rounded-full border border-line bg-white px-6 text-sm font-medium transition hover:border-ink/30"
        >
          View invoice
        </Link>
        <Link
          href="/shop"
          className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-canvas transition hover:bg-ink/85"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
