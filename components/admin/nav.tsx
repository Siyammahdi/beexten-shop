"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoxIcon, DashboardIcon, ReceiptIcon, TagIcon } from "../icons";

const links = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/orders", label: "Orders", icon: ReceiptIcon },
  { href: "/admin/products", label: "Products", icon: BoxIcon },
  { href: "/admin/categories", label: "Categories", icon: TagIcon },
];

export function NavLinks({ pathname }: { pathname?: string }) {
  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] md:flex-col md:overflow-visible">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          pathname !== undefined &&
          (href === "/admin" ? pathname === href : pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
              active ? "bg-ink text-canvas" : "text-muted hover:bg-well hover:text-ink"
            }`}
          >
            <Icon className="size-[18px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ActiveNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}
