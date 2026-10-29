import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/shop";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <p className="bg-ink px-5 py-2.5 text-center text-xs font-medium tracking-wide text-canvas/80">
        Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
        <span className="mx-2 text-canvas/30">·</span>
        Cash on delivery
        <span className="mx-2 hidden text-canvas/30 sm:inline">·</span>
        <span className="hidden sm:inline">7-day returns</span>
      </p>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
