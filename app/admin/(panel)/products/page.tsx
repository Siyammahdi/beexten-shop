import type { Metadata } from "next";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink, Card, EmptyState, PageHeader, Skeleton, td, th } from "@/components/admin/ui";
import { PlusIcon, SearchIcon } from "@/components/icons";
import { getAdminProducts } from "@/lib/admin";
import { LOW_STOCK_THRESHOLD, formatPrice } from "@/lib/shop";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your catalog, prices and stock."
        action={
          <ButtonLink href="/admin/products/new">
            <PlusIcon className="size-4" /> Add product
          </ButtonLink>
        }
      />
      <Suspense fallback={<Skeleton className="h-[480px]" />}>
        <Products searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Products({ searchParams }: Pick<PageProps<"/admin/products">, "searchParams">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const products = await getAdminProducts(query);

  return (
    <Card>
      <div className="border-b border-line p-4">
        <Form action="/admin/products" className="relative max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search products…"
            className="h-10 w-full rounded-full border border-line bg-canvas pl-10 pr-4 text-sm outline-none transition focus:border-ink focus:bg-white"
          />
        </Form>
      </div>

      {products.length === 0 ? (
        <EmptyState>{query ? `No products match "${query}".` : "No products yet."}</EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line">
              <tr>
                <th className={th}>Product</th>
                <th className={th}>Category</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Stock</th>
                <th className={`${th} text-right`}>Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id} className="relative transition hover:bg-canvas">
                  <td className={`${td} whitespace-normal`}>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex items-center gap-3 after:absolute after:inset-0"
                    >
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-well">
                        <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </Link>
                  </td>
                  <td className={`${td} text-muted`}>{p.categoryName}</td>
                  <td className={`${td} whitespace-normal`}>
                    <div className="flex flex-wrap gap-1.5">
                      <Pill tone={p.active ? "green" : "gray"}>{p.active ? "Active" : "Hidden"}</Pill>
                      {p.featured && <Pill tone="gray">Featured</Pill>}
                    </div>
                  </td>
                  <td
                    className={`${td} text-right tabular-nums ${
                      p.stock === 0
                        ? "font-medium text-red-600"
                        : p.stock <= LOW_STOCK_THRESHOLD
                          ? "font-medium text-amber-600"
                          : ""
                    }`}
                  >
                    {p.stock}
                  </td>
                  <td className={`${td} text-right font-medium tabular-nums`}>
                    {formatPrice(p.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function Pill({ tone, children }: { tone: "green" | "gray"; children: React.ReactNode }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-well text-muted"
      }`}
    >
      {children}
    </span>
  );
}
