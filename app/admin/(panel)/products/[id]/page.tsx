import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteProduct } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/forms";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader, Skeleton } from "@/components/admin/ui";
import { getAdminCategories, getAdminProduct } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit product" };

export default function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-16" />
          <Skeleton className="h-[560px]" />
        </div>
      }
    >
      <EditProduct params={params} />
    </Suspense>
  );
}

async function EditProduct({ params }: Pick<PageProps<"/admin/products/[id]">, "params">) {
  const id = Number((await params).id);
  const [product, categories] = await Promise.all([getAdminProduct(id), getAdminCategories()]);
  if (!product) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/products", label: "Products" }}
        title={product.name}
        description={
          product.active ? (
            <Link href={`/products/${product.slug}`} target="_blank" className="underline-offset-4 hover:underline">
              View in store
            </Link>
          ) : (
            "Hidden from the store"
          )
        }
        action={
          <DeleteButton
            action={deleteProduct}
            name="id"
            value={product.id}
            label="Delete product"
            confirmText={`Delete "${product.name}"? Past orders keep their item details.`}
          />
        }
      />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
