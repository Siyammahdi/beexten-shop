import Link from "next/link";
import type { OrderSummary } from "@/lib/admin";
import { formatPrice } from "@/lib/shop";
import { EmptyState, StatusBadge, formatDate, td, th } from "./ui";

export function OrdersTable({ orders, compact = false }: { orders: OrderSummary[]; compact?: boolean }) {
  if (orders.length === 0) return <EmptyState>No orders yet.</EmptyState>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-line">
          <tr>
            <th className={th}>Order</th>
            <th className={th}>Customer</th>
            {!compact && <th className={th}>Date</th>}
            {!compact && <th className={`${th} hidden xl:table-cell`}>Items</th>}
            <th className={th}>Status</th>
            <th className={`${th} text-right`}>Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {orders.map((order) => (
            <tr key={order.id} className="relative transition hover:bg-canvas">
              <td className={`${td} font-medium`}>
                <Link href={`/admin/orders/${order.id}`} className="after:absolute after:inset-0">
                  #{order.number}
                </Link>
              </td>
              <td className={td}>
                <p className="font-medium">{order.name}</p>
                <p className="text-xs text-muted">{order.email}</p>
              </td>
              {!compact && <td className={`${td} text-muted`}>{formatDate(order.createdAt)}</td>}
              {!compact && <td className={`${td} hidden tabular-nums text-muted xl:table-cell`}>{order.itemCount}</td>}
              <td className={td}>
                <StatusBadge status={order.status} />
              </td>
              <td className={`${td} text-right font-medium tabular-nums`}>
                {formatPrice(order.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
