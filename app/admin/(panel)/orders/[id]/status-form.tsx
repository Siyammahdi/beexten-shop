"use client";

import { useActionState } from "react";
import { updateOrderStatus } from "@/app/admin/actions";
import { FormError, SubmitButton } from "@/components/admin/forms";
import { AdminSelect } from "@/components/admin/ui";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/shop";

export function OrderStatusForm({ id, status }: { id: number; status: OrderStatus }) {
  const [state, formAction] = useActionState(updateOrderStatus, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <FormError error={state.error} />
      <label className="block">
        <span className="text-sm text-muted">Order status</span>
        <AdminSelect key={status} name="status" defaultValue={status} wrapperClassName="mt-1.5" className="capitalize">
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </AdminSelect>
      </label>
      <p className="text-xs text-muted">
        Cancelling an order returns its items to stock.
      </p>
      <div className="[&>button]:w-full">
        <SubmitButton pendingText="Saving…">Update status</SubmitButton>
      </div>
    </form>
  );
}
