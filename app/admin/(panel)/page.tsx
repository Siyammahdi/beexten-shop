import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { OrdersTable } from "@/components/admin/orders-table";
import { Card, PageHeader, Skeleton } from "@/components/admin/ui";
import { getDashboard } from "@/lib/admin";
import { formatPrice } from "@/lib/shop";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="How your store is doing at a glance." />
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    </>
  );
}

async function Dashboard() {
  const data = await getDashboard();

  const stats = [
    { label: "Revenue", value: formatPrice(data.revenue), note: "Excludes cancelled orders" },
    { label: "Orders", value: data.orderCount, note: "All time", href: "/admin/orders" },
    {
      label: "Pending",
      value: data.pendingCount,
      note: "Waiting to be processed",
      href: "/admin/orders?status=pending",
    },
    {
      label: "Products",
      value: data.productCount,
      note: `${data.lowStockCount} low on stock`,
      href: "/admin/products",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const body = (
            <>
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</p>
              <p className="mt-1 text-xs text-muted">{stat.note}</p>
            </>
          );
          const className = "block rounded-3xl border border-line bg-white p-6";
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className={`${className} transition hover:border-ink/30`}>
              {body}
            </Link>
          ) : (
            <div key={stat.label} className={className}>
              {body}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title="Recent orders"
          className="lg:col-span-2"
          action={
            <Link href="/admin/orders" className="text-sm text-muted hover:text-ink">
              View all
            </Link>
          }
        >
          <OrdersTable orders={data.recentOrders} compact />
        </Card>

        <Card title="Low stock">
          {data.lowStock.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted">Everything is well stocked.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.lowStock.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center gap-3 px-6 py-3 transition hover:bg-canvas"
                  >
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-well">
                      <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <p className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</p>
                    <span
                      className={`text-sm font-medium tabular-nums ${p.stock === 0 ? "text-red-600" : "text-amber-600"}`}
                    >
                      {p.stock === 0 ? "Sold out" : `${p.stock} left`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
