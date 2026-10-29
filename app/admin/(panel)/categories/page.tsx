import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink, Card, EmptyState, PageHeader, Skeleton, td, th } from "@/components/admin/ui";
import { PlusIcon } from "@/components/icons";
import { getAdminCategories } from "@/lib/admin";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categories"
        description="Group products and control the order they appear in the store."
        action={
          <ButtonLink href="/admin/categories/new">
            <PlusIcon className="size-4" /> Add category
          </ButtonLink>
        }
      />
      <Suspense fallback={<Skeleton className="h-80" />}>
        <Categories />
      </Suspense>
    </>
  );
}

async function Categories() {
  const categories = await getAdminCategories();

  return (
    <Card>
      {categories.length === 0 ? (
        <EmptyState>No categories yet.</EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line">
              <tr>
                <th className={th}>Category</th>
                <th className={th}>Tagline</th>
                <th className={`${th} text-right`}>Products</th>
                <th className={`${th} text-right`}>Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {categories.map((c) => (
                <tr key={c.slug} className="relative transition hover:bg-canvas">
                  <td className={td}>
                    <Link
                      href={`/admin/categories/${c.slug}`}
                      className="flex items-center gap-3 after:absolute after:inset-0"
                    >
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-well">
                        <Image src={c.image} alt="" fill sizes="44px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted">/shop/{c.slug}</p>
                      </div>
                    </Link>
                  </td>
                  <td className={`${td} text-muted`}>{c.tagline}</td>
                  <td className={`${td} text-right tabular-nums`}>{c.productCount}</td>
                  <td className={`${td} text-right tabular-nums text-muted`}>{c.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
