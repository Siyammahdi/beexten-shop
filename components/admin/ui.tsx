import Link from "next/link";
import type { OrderStatus } from "@/lib/shop";
import { ArrowLeftIcon } from "../icons";

export function PageHeader({
  title,
  description,
  back,
  action,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink"
        >
          <ArrowLeftIcon className="size-4" /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function Card({
  title,
  action,
  className = "",
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-3xl border border-line bg-white ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          <h2 className="font-semibold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  processing: "bg-sky-50 text-sky-700 ring-sky-600/20",
  shipped: "bg-violet-50 text-violet-700 ring-violet-600/20",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelled: "bg-stone-100 text-stone-600 ring-stone-500/20",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-canvas transition hover:bg-ink/85"
    >
      {children}
    </Link>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="px-6 py-16 text-center text-sm text-muted">{children}</p>;
}

export function Skeleton({ className = "h-64" }: { className?: string }) {
  return <div className={`animate-pulse rounded-3xl border border-line bg-white ${className}`} />;
}

export function formatDate(date: Date, withTime = false) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    ...(withTime && { timeStyle: "short" }),
  }).format(date);
}

export const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/5";

export { StyledSelect as AdminSelect } from "../styled-select";

export const th =
  "whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted first:pl-6 last:pr-6";
export const td = "whitespace-nowrap px-4 py-4 first:pl-6 last:pr-6";
