import Link from "next/link";
import { DashboardIcon } from "./icons";

export function AdminLink() {
  return (
    <Link
      href="/admin"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-3.5 text-sm font-medium transition hover:border-ink/30"
      title="Open store admin"
    >
      <DashboardIcon className="size-4" />
      <span className="hidden sm:inline">Admin</span>
    </Link>
  );
}
