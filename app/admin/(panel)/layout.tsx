import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { logout } from "../actions";
import { ActiveNavLinks, NavLinks } from "@/components/admin/nav";
import { LogoutIcon, StoreIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · beexten admin" },
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="border-b border-line bg-white md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex flex-col gap-4 p-4 md:h-full md:gap-8 md:p-5">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2 px-2 text-lg font-semibold tracking-tight">
              beexten<span className="-ml-2 text-muted">.</span>
              <span className="rounded-md bg-well px-1.5 py-0.5 text-[11px] font-medium text-muted">
                Admin
              </span>
            </Link>
            <div className="md:hidden">
              <AccountLinks />
            </div>
          </div>

          <Suspense fallback={<NavLinks />}>
            <ActiveNavLinks />
          </Suspense>

          <div className="mt-auto hidden md:block">
            <AccountLinks />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 md:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

function AccountLinks() {
  const item =
    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-well hover:text-ink";
  return (
    <div className="flex gap-1 md:flex-col">
      <Link href="/" target="_blank" className={item}>
        <StoreIcon className="size-[18px]" />
        <span className="hidden md:inline">View store</span>
      </Link>
      <form action={logout}>
        <button type="submit" className={`${item} w-full`}>
          <LogoutIcon className="size-[18px]" />
          <span className="hidden md:inline">Log out</span>
        </button>
      </form>
    </div>
  );
}
