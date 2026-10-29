import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/category-form";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "New category" };

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader back={{ href: "/admin/categories", label: "Categories" }} title="New category" />
      <CategoryForm />
    </>
  );
}
