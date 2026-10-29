import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import { ProductCard } from "@/components/product-card";
import { ProductRail } from "@/components/product-rail";
import {
  ArrowRightIcon,
  CheckIcon,
  ReturnIcon,
  ShieldIcon,
  SparkleIcon,
  StarIcon,
  TruckIcon,
} from "@/components/icons";
import { getCategories, getProducts } from "@/lib/queries";
import { FREE_SHIPPING_THRESHOLD, formatPrice, type Product } from "@/lib/shop";

const tileLayout = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-2",
  "md:col-span-1",
  "md:col-span-1",
];

const promises = [
  {
    icon: SparkleIcon,
    title: "Chosen, not stocked",
    text: "Every product is picked by hand and lived with before it earns a place in the store.",
  },
  {
    icon: TruckIcon,
    title: "Free shipping",
    text: `Delivered free on every order over ${formatPrice(FREE_SHIPPING_THRESHOLD)}, packed with care.`,
  },
  {
    icon: ShieldIcon,
    title: "Pay on delivery",
    text: "No cards, no risk. Pay in cash when your order arrives at your door.",
  },
  {
    icon: ReturnIcon,
    title: "7-day returns",
    text: "Not quite right? Send it back within 7 days, in original condition.",
  },
];

const testimonials = [
  {
    quote: "The headphones arrived in two days and sound better than pairs I've owned at twice the price.",
    name: "Nadia R.",
    detail: "Studio Wireless Headphones",
  },
  {
    quote: "Finally a store that doesn't drown you in choice. Everything I've bought feels considered.",
    name: "Arif H.",
    detail: "Velvet Lounge Sofa",
  },
  {
    quote: "Paying on delivery made my first order easy. The packaging alone felt like a gift.",
    name: "Sara K.",
    detail: "Skincare Ritual Kit",
  },
];

function pickFavourites(products: Product[], limit = 8) {
  const picked = products.filter((p) => p.featured);
  for (const product of products) {
    if (picked.length >= limit) break;
    if (!picked.some((p) => p.slug === product.slug)) picked.push(product);
  }
  return picked.slice(0, limit);
}

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const featured = products.filter((p) => p.featured);
  const favourites = pickFavourites(products);
  const spotlight = featured[3] ?? featured[0] ?? products[0];
  const newArrivals = products.toReversed().slice(0, 8);

  return (
    <>
      <HomeHero categorySlugs={categories.map((c) => c.slug)} />

      <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-28 sm:px-8">
        <SectionHeader
          eyebrow="Categories"
          title={
            <>
              Shop by <Serif>category</Serif>
            </>
          }
          action={<ViewAll href="/shop">Browse everything</ViewAll>}
        />
        <div className="reveal grid gap-4 md:h-[640px] md:grid-cols-4 md:grid-rows-2">
          {categories.slice(0, 4).map((category, i) => (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              className={`group relative isolate flex min-h-64 flex-col justify-end overflow-hidden rounded-[2rem] bg-well p-6 text-white ${tileLayout[i]}`}
            >
              <Image
                src={category.image}
                alt=""
                fill
                sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                className="-z-10 object-cover transition duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-white/70">
                    {category.productCount} products
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight">{category.name}</h3>
                  <p className={`mt-1 text-sm text-white/80 ${i >= 2 ? "md:max-xl:hidden" : ""}`}>
                    {category.tagline}
                  </p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:-rotate-45">
                  <ArrowRightIcon className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {favourites.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
          <SectionHeader
            eyebrow="Bestsellers"
            title={
              <>
                Customer <Serif>favourites</Serif>
              </>
            }
            action={<ViewAll href="/shop">View all</ViewAll>}
          />
          <div className="reveal grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
            {favourites.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      {spotlight && <Spotlight product={spotlight} />}

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
          <ProductRail
            header={
              <SectionHeader
                eyebrow="Just landed"
                title={
                  <>
                    New <Serif>arrivals</Serif>
                  </>
                }
                inline
              />
            }
          >
            {newArrivals.map((product) => (
              <div key={product.slug} className="w-60 shrink-0 snap-start sm:w-72">
                <ProductCard product={product} />
              </div>
            ))}
          </ProductRail>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
        <div className="reveal grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Our promise</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Shopping, the <Serif>way it should</Serif> feel.
            </h2>
            <p className="mt-5 max-w-sm leading-7 text-muted">
              We keep things simple so you can focus on what matters: finding something
              you&apos;ll love.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2">
            {promises.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="bg-white p-8">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-well">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-serif text-3xl text-muted/50">0{i + 1}</span>
                </div>
                <h3 className="mt-8 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
        <SectionHeader
          eyebrow="Reviews"
          title={
            <>
              Loved by <Serif>our customers</Serif>
            </>
          }
        />
        <div className="reveal grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-[2rem] border border-line bg-white p-8">
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} className="size-4" />
                ))}
              </div>
              <blockquote className="mt-6 flex-1 font-serif text-2xl leading-snug">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8 border-t border-line pt-5 text-sm">
                <p className="font-medium">{t.name}</p>
                <p className="mt-0.5 text-muted">Bought {t.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
        <div className="reveal relative isolate flex min-h-[460px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] px-6 py-20 text-center text-white">
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80"
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-black/55" />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            The collection
          </p>
          <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.05] text-balance sm:text-7xl">
            Find something you&apos;ll keep for years.
          </h2>
          <Link
            href="/shop"
            className="group mt-10 inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-ink transition hover:bg-white/90"
          >
            Start shopping
            <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </>
  );
}

function Spotlight({ product }: { product: Product }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
      <div className="reveal grid overflow-hidden rounded-[2.5rem] bg-ink text-canvas lg:grid-cols-2">
        <div className="relative min-h-[380px] sm:min-h-[480px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-canvas/50">
            In the spotlight · {product.categoryName}
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {product.name}
          </h2>
          <p className="mt-5 max-w-md leading-7 text-canvas/70">{product.description}</p>
          {product.highlights.length > 0 && (
            <ul className="mt-8 space-y-3">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm text-canvas/85">
                  <span className="grid size-5 place-items-center rounded-full bg-canvas/10">
                    <CheckIcon className="size-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href={`/products/${product.slug}`}
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-canvas px-7 text-sm font-medium text-ink transition hover:bg-canvas/90"
            >
              Shop now
              <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
            <p className="font-serif text-4xl">{formatPrice(product.price)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
  inline = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <div className={`flex items-end justify-between gap-6 ${inline ? "" : "mb-10"}`}>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Serif({ children }: { children: React.ReactNode }) {
  return <span className="font-serif font-normal italic tracking-normal">{children}</span>;
}

function ViewAll({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="hidden shrink-0 items-center gap-1.5 text-sm font-medium transition hover:gap-2.5 sm:inline-flex"
    >
      {children} <ArrowRightIcon className="size-4" />
    </Link>
  );
}
