import type { Category, Product } from "./shop";

type SeedCategory = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};

type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  highlights: string[];
  featured?: boolean;
};

let cached: Promise<{ categories: Category[]; products: Product[] }> | undefined;

/** Static catalog used when DATABASE_URL is unavailable (e.g. CI build without secrets). */
export async function getCatalogFallback() {
  if (!cached) {
    cached = (async () => {
      const seed = (await import("../scripts/seed-data.mjs")) as {
        categories: SeedCategory[];
        products: SeedProduct[];
        detailedDescriptionFor: (p: SeedProduct) => string;
      };

      const categories: Category[] = seed.categories.map((c, position) => ({
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        image: c.image,
        position,
        productCount: seed.products.filter((p) => p.category === c.slug).length,
      }));

      const products: Product[] = seed.products.map((p, index) => ({
        id: index + 1,
        slug: p.slug,
        name: p.name,
        categorySlug: p.category,
        categoryName: categories.find((c) => c.slug === p.category)!.name,
        price: p.price,
        stock: 25,
        image: p.image,
        description: p.description,
        detailedDescription: seed.detailedDescriptionFor(p),
        highlights: p.highlights,
        featured: p.featured ?? false,
      }));

      return { categories, products };
    })();
  }

  return cached;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}
