import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/shop";

export async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="mt-28 overflow-hidden bg-ink text-canvas">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-12 pt-20 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-serif text-4xl leading-tight">
            Well-made things for <span className="italic">everyday</span> life.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-canvas px-6 text-sm font-medium text-ink transition hover:bg-canvas/90"
          >
            Shop the collection
          </Link>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-canvas/50">Shop</h3>
          <ul className="mt-5 space-y-3 text-sm text-canvas/80">
            <li>
              <Link href="/shop" className="transition hover:text-canvas">
                All products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="transition hover:text-canvas">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-canvas/50">Help</h3>
          <ul className="mt-5 space-y-3 text-sm text-canvas/80">
            <li>Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}</li>
            <li>Cash on delivery</li>
            <li>7-day returns</li>
            <li>
              <a href="mailto:hello@beexten.com" className="transition hover:text-canvas">
                hello@beexten.com
              </a>
            </li>
            <li>
              <Link href="/admin" className="transition hover:text-canvas">
                Store admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p
          aria-hidden="true"
          className="select-none text-center font-serif text-[22vw] leading-[0.8] tracking-tight text-canvas/10 xl:text-[18rem]"
        >
          beexten
        </p>
      </div>

      <div className="border-t border-canvas/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-canvas/50 sm:px-8">
          © beexten. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
