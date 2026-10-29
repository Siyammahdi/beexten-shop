import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "./icons";

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

const campaign = {
  category: "fashion",
  image: unsplash("1445205170230-053b83016050"),
  label: "New season",
  title: "Autumn wardrobe, sorted.",
  text: "Leather, soft cotton and the accessories that go with everything.",
  cta: "Shop fashion",
};

const promos = [
  {
    category: "home",
    image: unsplash("1586023492125-27b2c045efd7"),
    label: "Home & Living",
    title: "Make room for colour",
  },
  {
    category: "electronics",
    image: unsplash("1608043152269-423dbba4e7e1"),
    label: "Electronics",
    title: "Take the sound outside",
  },
];

export function HomeHero({ categorySlugs }: { categorySlugs: string[] }) {
  const campaignHref = categorySlugs.includes(campaign.category)
    ? `/shop/${campaign.category}`
    : "/shop";
  const visiblePromos = promos.filter((p) => categorySlugs.includes(p.category));

  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="grid gap-3 sm:gap-4 lg:h-[min(78svh,760px)] lg:min-h-[560px] lg:grid-cols-3 lg:grid-rows-2">
        <div className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden rounded-2xl bg-well text-white sm:min-h-[560px] lg:col-span-2 lg:row-span-2 lg:min-h-0">
          <Image
            src={campaign.image}
            alt="Clothing on a rail in warm light"
            fill
            preload
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/70 via-black/20 to-black/0" />

          <div className="max-w-xl p-6 sm:p-10 lg:p-12">
            <p className="text-sm font-medium text-white/80">{campaign.label}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              {campaign.title}
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/85 sm:text-lg">
              {campaign.text}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href={campaignHref}
                className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-semibold text-ink transition hover:bg-white/90"
              >
                {campaign.cta}
              </Link>
              <Link
                href="/shop"
                className="text-sm font-semibold underline decoration-white/50 underline-offset-[6px] transition hover:decoration-white"
              >
                Shop all products
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:row-span-2 lg:grid-cols-1 lg:grid-rows-2">
          {visiblePromos.map((promo) => (
            <Link
              key={promo.category}
              href={`/shop/${promo.category}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-well lg:aspect-auto"
            >
              <Image
                src={promo.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 sm:right-auto sm:min-w-60">
                <div>
                  <p className="text-xs text-muted">{promo.label}</p>
                  <p className="text-sm font-semibold">{promo.title}</p>
                </div>
                <ArrowRightIcon className="size-4 shrink-0 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
