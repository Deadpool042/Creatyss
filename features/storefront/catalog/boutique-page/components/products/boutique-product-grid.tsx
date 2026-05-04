"use client";

import { BoutiqueProductCard } from "@/features/storefront/catalog/boutique-page/components/products/boutique-product-card";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { cn } from "@/lib/utils";

type BoutiqueProductGridProps = {
  products: BoutiquePageViewModel["products"];
  initialFavoriteProductIds: readonly string[];
};

export function BoutiqueProductGrid({
  products,
  initialFavoriteProductIds,
}: BoutiqueProductGridProps) {
  return (
    <div
      className={cn(
        "boutique-product-grid grid grid-cols-2 px-2 gap-x-3 gap-y-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-7"
      )}
    >
      {products.map((product) => (
        <BoutiqueProductCard
          key={product.id}
          product={product}
          initialFavoriteProductIds={initialFavoriteProductIds}
        />
      ))}
    </div>
  );
}
