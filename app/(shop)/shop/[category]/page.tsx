import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView } from "@/components/shop-view";
import { getCategories, getCategory, getProducts } from "@/lib/queries";

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const found = await getCategory((await params).category);
  return found ? { title: found.name, description: found.tagline } : {};
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const category = await getCategory((await params).category);
  if (!category) notFound();

  return (
    <ShopView
      title={category.name}
      description={category.tagline}
      activeSlug={category.slug}
      products={await getProducts(category.slug)}
    />
  );
}
