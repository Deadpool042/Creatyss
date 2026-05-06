"use client";

import { BoutiqueProductCard } from "@/features/storefront/catalog/boutique-page/components/products/boutique-product-card";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueProductGridProps = {
  products: BoutiquePageViewModel["products"];
  initialFavoriteProductIds: readonly string[];
};

export function BoutiqueProductGrid({
  products,
  initialFavoriteProductIds,
}: BoutiqueProductGridProps) {
  return (
    <div className="boutique-product-grid">
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
