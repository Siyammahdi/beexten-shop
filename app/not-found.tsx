import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-32 text-center sm:px-8">
      <p className="text-sm font-medium text-muted">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 max-w-sm text-muted">
        It may have moved, or the product is no longer available.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-canvas transition hover:bg-ink/85"
      >
        Browse the shop
      </Link>
    </div>
  );
}
