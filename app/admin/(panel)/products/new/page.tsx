import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader, Skeleton } from "@/components/admin/ui";
import { getAdminCategories } from "@/lib/admin";

export const metadata: Metadata = { title: "New product" };

export default function NewProductPage() {
  return (
    <>
      <PageHeader back={{ href: "/admin/products", label: "Products" }} title="New product" />
      <Suspense fallback={<Skeleton className="h-[560px]" />}>
        <NewProduct />
      </Suspense>
    </>
  );
}

async function NewProduct() {
  return <ProductForm categories={await getAdminCategories()} />;
}
