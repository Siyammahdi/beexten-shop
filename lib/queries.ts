import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getCatalogFallback, hasDatabaseUrl } from "./catalog-fallback";
import { sql } from "./db";
import type { Category, Product } from "./shop";

export const CATALOG_TAG = "catalog";

const PRODUCT_SELECT = `
  select p.id, p.slug, p.name, p.category_slug as "categorySlug", c.name as "categoryName",
         p.price::float8 as price, p.stock, p.image, p.description,
         p.detailed_description as "detailedDescription", p.highlights, p.featured
  from products p
  join categories c on c.slug = p.category_slug
  where p.active`;

async function getCategoriesFromDb() {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("max");

  return (await sql`
    select c.slug, c.name, c.tagline, c.image, c.position,
           count(p.id) filter (where p.active)::int as "productCount"
    from categories c
    left join products p on p.category_slug = c.slug
    group by c.slug
    order by c.position, c.name`) as Category[];
}

async function getProductsFromDb(categorySlug?: string) {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("max");

  return (await (categorySlug
    ? sql.query(`${PRODUCT_SELECT} and p.category_slug = $1 order by p.id`, [categorySlug])
    : sql.query(`${PRODUCT_SELECT} order by p.id`))) as Product[];
}

export async function getCategories() {
  if (!hasDatabaseUrl()) return (await getCatalogFallback()).categories;
  return getCategoriesFromDb();
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getProducts(categorySlug?: string) {
  if (!hasDatabaseUrl()) {
    const { products } = await getCatalogFallback();
    return categorySlug ? products.filter((p) => p.categorySlug === categorySlug) : products;
  }
  return getProductsFromDb(categorySlug);
}

export async function getFeaturedProducts() {
  return (await getProducts()).filter((p) => p.featured);
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getRelatedProducts(product: Product, limit = 4) {
  return (await getProducts(product.categorySlug))
    .filter((p) => p.slug !== product.slug)
    .slice(0, limit);
}
