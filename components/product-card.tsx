import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/shop";

export function ProductCard({
  product,
  preload = false,
}: {
  product: Product;
  preload?: boolean;
}) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-well">
        <Image
          src={product.image}
          alt={product.name}
          fill
          preload={preload}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        {product.stock === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="text-xs text-muted">{product.categoryName}</p>
          <h3 className="mt-1 truncate text-sm font-medium">{product.name}</h3>
        </div>
        <p className="text-sm font-medium tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
