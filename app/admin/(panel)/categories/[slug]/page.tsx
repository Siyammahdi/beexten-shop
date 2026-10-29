import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteCategory } from "@/app/admin/actions";
import { CategoryForm } from "@/components/admin/category-form";
import { DeleteButton } from "@/components/admin/forms";
import { PageHeader, Skeleton } from "@/components/admin/ui";
import { getAdminCategory } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit category" };

export default function EditCategoryPage({ params }: PageProps<"/admin/categories/[slug]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[480px]" />}>
      <EditCategory params={params} />
    </Suspense>
  );
}

async function EditCategory({ params }: Pick<PageProps<"/admin/categories/[slug]">, "params">) {
  const category = await getAdminCategory((await params).slug);
  if (!category) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/categories", label: "Categories" }}
        title={category.name}
        description={`${category.productCount} product${category.productCount === 1 ? "" : "s"}`}
        action={
          <DeleteButton
            action={deleteCategory}
            name="slug"
            value={category.slug}
            label="Delete category"
            confirmText={`Delete the "${category.name}" category?`}
          />
        }
      />
      <CategoryForm category={category} />
    </>
  );
}
