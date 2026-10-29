"use client";

import { useState } from "react";
import type { Product } from "@/lib/shop";
import { ProductCard } from "./product-card";
import { StyledSelect } from "./styled-select";

const sorts = {
  featured: { label: "Featured", fn: () => 0 },
  "price-asc": { label: "Price: low to high", fn: (a: Product, b: Product) => a.price - b.price },
  "price-desc": { label: "Price: high to low", fn: (a: Product, b: Product) => b.price - a.price },
} as const;

type SortKey = keyof typeof sorts;

export function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("featured");
  const sorted = [...products].sort(sorts[sort].fn);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {products.length} product{products.length === 1 ? "" : "s"}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Sort</span>
          <StyledSelect
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 w-auto min-w-44 rounded-full py-2 pl-4 pr-10 font-medium"
          >
            {Object.entries(sorts).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </StyledSelect>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
        {sorted.map((product, i) => (
          <ProductCard key={product.slug} product={product} preload={i < 4} />
        ))}
      </div>
    </div>
  );
}
