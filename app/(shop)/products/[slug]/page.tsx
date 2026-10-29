import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { CheckIcon, ReturnIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { getProduct, getProducts, getRelatedProducts } from "@/lib/queries";
import { FREE_SHIPPING_THRESHOLD, LOW_STOCK_THRESHOLD, formatPrice } from "@/lib/shop";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 sm:pt-12">
      <nav className="flex items-center gap-2 text-sm text-muted">
        <Link href="/shop" className="transition hover:text-ink">
          Shop
        </Link>
        <span>/</span>
        <Link href={`/shop/${product.categorySlug}`} className="transition hover:text-ink">
          {product.categoryName}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-well">
          <Image
            src={product.image}
            alt={product.name}
            fill
            preload
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="animate-fade-up md:sticky md:top-28 md:self-start lg:py-6">
          <p className="text-sm font-medium text-muted">{product.categoryName}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <p className="text-2xl tabular-nums">{formatPrice(product.price)}</p>
            {product.stock === 0 ? (
              <span className="rounded-full bg-well px-3 py-1 text-xs font-medium">Sold out</span>
            ) : product.stock <= LOW_STOCK_THRESHOLD ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                Only {product.stock} left
              </span>
            ) : null}
          </div>
          <p className="mt-6 max-w-lg leading-7 text-muted">{product.description}</p>

          {product.highlights.length > 0 && (
            <ul className="mt-6 space-y-2.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm">
                  <span className="grid size-5 place-items-center rounded-full bg-well">
                    <CheckIcon className="size-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8">
            <AddToCart
              product={{
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                categoryName: product.categoryName,
                stock: product.stock,
              }}
            />
          </div>

          <div className="mt-6 grid gap-3 border-t border-line pt-6 text-sm text-muted sm:grid-cols-2">
            <p className="flex items-center gap-2.5">
              <TruckIcon className="size-5 text-ink" />
              Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}
            </p>
            <p className="flex items-center gap-2.5">
              <ReturnIcon className="size-5 text-ink" />
              Free 7-day returns
            </p>
          </div>
        </div>
      </div>

      {product.detailedDescription.trim() && (
        <section className="mx-auto mt-20 max-w-3xl border-t border-line pt-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Product details</h2>
          <div className="mt-8 space-y-4 text-base leading-8 text-muted whitespace-pre-line">
            {product.detailedDescription}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="pt-24">
          <h2 className="mb-10 text-2xl font-semibold tracking-tight sm:text-3xl">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
