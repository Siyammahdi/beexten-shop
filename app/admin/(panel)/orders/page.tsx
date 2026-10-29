import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { OrdersTable } from "@/components/admin/orders-table";
import { Card, PageHeader, Skeleton } from "@/components/admin/ui";
import { getOrderCounts, getOrders } from "@/lib/admin";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/shop";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  return (
    <>
      <PageHeader title="Orders" description="Track and update customer orders." />
      <Suspense fallback={<Skeleton className="h-96" />}>
        <Orders searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Orders({ searchParams }: Pick<PageProps<"/admin/orders">, "searchParams">) {
  const { status: raw } = await searchParams;
  const status = ORDER_STATUSES.find((s) => s === raw);
  const [orders, counts] = await Promise.all([getOrders(status), getOrderCounts()]);
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  const tabs: { label: string; status?: OrderStatus; count: number }[] = [
    { label: "All", count: total },
    ...ORDER_STATUSES.map((s) => ({ label: s, status: s, count: counts[s] ?? 0 })),
  ];

  return (
    <>
      <nav className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {tabs.map((tab) => {
          const active = tab.status === status;
          return (
            <Link
              key={tab.label}
              href={tab.status ? `/admin/orders?status=${tab.status}` : "/admin/orders"}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition ${
                active
                  ? "border-ink bg-ink text-canvas"
                  : "border-line bg-white text-muted hover:text-ink"
              }`}
            >
              {tab.label}
              <span className={`text-xs tabular-nums ${active ? "text-canvas/70" : "text-muted/70"}`}>
                {tab.count}
              </span>
            </Link>
          );
        })}
      </nav>
      <Card>
        <OrdersTable orders={orders} />
      </Card>
    </>
  );
}
