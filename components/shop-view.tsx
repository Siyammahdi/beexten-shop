import Link from "next/link";
import { getCategories } from "@/lib/queries";
import type { Product } from "@/lib/shop";
import { ProductGrid } from "./product-grid";

export async function ShopView({
  title,
  description,
  activeSlug,
  products,
}: {
  title: string;
  description: string;
  activeSlug?: string;
  products: Product[];
}) {
  const tabs = [{ slug: undefined, name: "All" }, ...(await getCategories())];

  return (
    <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-xl text-muted">{description}</p>

      <nav className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {tabs.map((tab) => {
          const active = tab.slug === activeSlug;
          return (
            <Link
              key={tab.name}
              href={tab.slug ? `/shop/${tab.slug}` : "/shop"}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-ink bg-ink text-canvas"
                  : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
