import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OrderStatusForm } from "./status-form";
import { deleteOrder } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/forms";
import { Card, PageHeader, Skeleton, StatusBadge, ButtonLink, formatDate } from "@/components/admin/ui";
import { getOrder } from "@/lib/admin";
import { formatPrice } from "@/lib/shop";

export const metadata: Metadata = { title: "Order" };

export default function OrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-16" />
          <Skeleton className="h-96" />
        </div>
      }
    >
      <Order params={params} />
    </Suspense>
  );
}

async function Order({ params }: Pick<PageProps<"/admin/orders/[id]">, "params">) {
  const order = await getOrder(Number((await params).id));
  if (!order) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/orders", label: "Orders" }}
        title={
          <span className="flex items-center gap-3">
            Order #{order.number} <StatusBadge status={order.status} />
          </span>
        }
        description={`Placed ${formatDate(order.createdAt, true)}`}
        action={
          <div className="flex flex-wrap items-center justify-end gap-3">
            <ButtonLink href={`/admin/orders/${order.id}/invoice`}>View invoice</ButtonLink>
            <DeleteButton
              action={deleteOrder}
              name="id"
              value={order.id}
              label="Delete order"
              confirmText={`Delete order #${order.number}? This cannot be undone.${
                order.status !== "cancelled" ? " Product stock will be restored." : ""
              }`}
            />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title={`Items (${order.itemCount})`} className="lg:col-span-2">
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-well">
                  <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-sm text-muted tabular-nums">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-line px-6 py-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="tabular-nums">
                {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
              </dd>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </Card>

        <div className="space-y-6">
          <Card title="Status">
            <div className="p-6">
              <OrderStatusForm id={order.id} status={order.status} />
            </div>
          </Card>

          <Card title="Customer">
            <dl className="space-y-3 p-6 text-sm">
              <Detail label="Name" value={order.name} />
              <Detail label="Email" value={<a href={`mailto:${order.email}`} className="underline-offset-4 hover:underline">{order.email}</a>} />
              <Detail label="Phone" value={<a href={`tel:${order.phone}`} className="underline-offset-4 hover:underline">{order.phone}</a>} />
            </dl>
          </Card>

          <Card title="Delivery">
            <div className="space-y-1 p-6 text-sm">
              <p>{order.address}</p>
              <p>
                {order.city} {order.postalCode}
              </p>
              <p className="pt-2 text-muted">Payment: cash on delivery</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
