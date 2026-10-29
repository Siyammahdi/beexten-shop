import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InvoiceViewer } from "@/components/invoice-viewer";
import { PageHeader, Skeleton } from "@/components/admin/ui";
import { getOrder } from "@/lib/admin";
import { ensureOrderInvoice } from "@/lib/order-invoice";

export const metadata: Metadata = { title: "Invoice" };

export default function AdminInvoicePage({ params }: PageProps<"/admin/orders/[id]/invoice">) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-16" />
          <Skeleton className="h-[640px]" />
        </div>
      }
    >
      <Invoice params={params} />
    </Suspense>
  );
}

async function Invoice({ params }: Pick<PageProps<"/admin/orders/[id]/invoice">, "params">) {
  const id = Number((await params).id);
  const order = await getOrder(id);
  if (!order) notFound();

  const html = await ensureOrderInvoice(id);
  if (!html) notFound();

  return (
    <>
      <PageHeader
        back={{ href: `/admin/orders/${order.id}`, label: "Order" }}
        title={`Invoice #${order.number}`}
        description={
          <Link href={`/invoice/${order.number}?email=${encodeURIComponent(order.email)}`} target="_blank" className="underline-offset-4 hover:underline">
            Customer link (requires email)
          </Link>
        }
      />
      <InvoiceViewer html={html} />
    </>
  );
}
