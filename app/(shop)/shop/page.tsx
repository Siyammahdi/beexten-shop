import type { Metadata } from "next";
import { ShopView } from "@/components/shop-view";
import { getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Shop all",
};

export default async function ShopPage() {
  return (
    <ShopView
      title="Shop all"
      description="Everything we carry, across every category."
      products={await getProducts()}
    />
  );
}
