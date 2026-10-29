import Link from "next/link";
import { Suspense } from "react";
import { getCategories } from "@/lib/queries";
import { AdminLink } from "./admin-link";
import { CartButton } from "./cart-button";

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          beexten<span className="text-muted">.</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/shop">Shop all</NavLink>
          {categories.map((c) => (
            <NavLink key={c.slug} href={`/shop/${c.slug}`}>
              {c.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="rounded-full px-3 py-2 text-sm font-medium md:hidden"
          >
            Shop
          </Link>
          <Suspense fallback={null}>
            <AdminLink />
          </Suspense>
          <CartButton />
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3.5 py-2 text-sm text-muted transition hover:bg-well hover:text-ink"
    >
      {children}
    </Link>
  );
}
