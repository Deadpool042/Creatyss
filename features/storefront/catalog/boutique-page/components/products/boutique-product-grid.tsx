"use client";

import { BoutiqueProductCard } from "@/features/storefront/catalog/boutique-page/components/products/boutique-product-card";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueProductGridProps = {
  products: BoutiquePageViewModel["products"];
  initialFavoriteProductIds: readonly string[];
};

const PRODUCT_GRID_CLASS = [
  "grid grid-cols-2 gap-x-3 gap-y-7 px-2",
  "max-[47.99rem]:gap-x-[0.85rem] max-[47.99rem]:gap-y-[1.85rem]",
  "min-[40rem]:grid-cols-3 min-[40rem]:gap-x-[0.875rem] min-[40rem]:gap-y-8",
  "min-[48rem]:max-[63.99rem]:gap-x-3 min-[48rem]:max-[63.99rem]:gap-y-[1.6rem]",
  "min-[64rem]:grid-cols-4 min-[64rem]:gap-x-[0.875rem] min-[64rem]:gap-y-8 min-[64rem]:px-[0.625rem]",
  "min-[75rem]:gap-x-4 min-[75rem]:gap-y-9 min-[75rem]:px-3",
  "min-[85rem]:gap-y-[2.15rem]",
  "min-[90rem]:gap-y-9",
  "min-[108rem]:gap-y-[2.35rem] min-[108rem]:max-w-none min-[108rem]:mx-0",
].join(" ");

export function BoutiqueProductGrid({
  products,
  initialFavoriteProductIds,
}: BoutiqueProductGridProps) {
  return (
    <div className={PRODUCT_GRID_CLASS} data-testid="boutique-product-grid">
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
