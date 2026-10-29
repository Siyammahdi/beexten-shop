import { FREE_SHIPPING_THRESHOLD, formatPrice, shippingFor } from "@/lib/shop";

export function OrderSummary({
  subtotal,
  children,
}: {
  subtotal: number;
  children?: React.ReactNode;
}) {
  const shipping = shippingFor(subtotal);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="rounded-[2rem] border border-line bg-white p-6 sm:p-8">
      <h2 className="text-lg font-semibold">Order summary</h2>

      <div className="mt-5 rounded-2xl bg-well p-4">
        <p className="text-sm">
          {remaining > 0 ? (
            <>
              Add <span className="font-medium">{formatPrice(remaining)}</span> more for free
              shipping
            </>
          ) : (
            <span className="font-medium">You&apos;ve unlocked free shipping</span>
          )}
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(subtotal + shipping)}</dd>
        </div>
      </dl>

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
