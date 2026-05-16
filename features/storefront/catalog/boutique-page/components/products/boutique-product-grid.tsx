"use client";

import { BoutiqueProductCard } from "@/features/storefront/catalog/boutique-page/components/products/boutique-product-card";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueProductGridProps = {
  products: BoutiquePageViewModel["products"];
  initialFavoriteProductIds: readonly string[];
};

const PRODUCT_GRID_CLASS = [
  // Base : 2 colonnes mobile portrait
  "grid grid-cols-2 gap-x-3 gap-y-7 px-2",
  // Juste avant tablet (< 768px) : gaps resserrés — max-[47.99rem] intentionnel pour éviter le chevauchement à 48rem pile
  "max-[47.99rem]:gap-x-[0.85rem] max-[47.99rem]:gap-y-[1.85rem]",
  // 640px → 3 colonnes — min-[40rem] intentionnel : palier intermédiaire sans alias métier (entre mobile=480px et tablet=768px)
  "min-[40rem]:grid-cols-3 min-[40rem]:gap-x-[0.875rem] min-[40rem]:gap-y-8",
  // tablet → juste avant laptop : resserrement gaps — max-[63.99rem] intentionnel pour éviter le chevauchement à laptop
  "tablet:max-[63.99rem]:gap-x-3 tablet:max-[63.99rem]:gap-y-[1.6rem]",
  // laptop+ : 4 colonnes
  "laptop:grid-cols-4 laptop:gap-x-[0.875rem] laptop:gap-y-8 laptop:px-[0.625rem]",
  // desktop+ : gaps augmentés
  "desktop:gap-x-4 desktop:gap-y-9 desktop:px-3",
  // 1360px : micro-ajustement vertical — min-[85rem] intentionnel : entre desktop=1200px et wide=1440px, sans alias métier
  "min-[85rem]:gap-y-[2.15rem]",
  // wide+ : gaps finaux
  "wide:gap-y-9",
  // 1728px : très grand écran — min-[108rem] intentionnel : entre ultrawide=1600px et 2k=1920px, sans alias métier
  "min-[108rem]:gap-y-[2.35rem] min-[108rem]:max-w-none min-[108rem]:mx-0",
].join(" ");

export function BoutiqueProductGrid({
  products,
  initialFavoriteProductIds,
}: BoutiqueProductGridProps) {
  return (
    <div className={PRODUCT_GRID_CLASS} data-testid="boutique-product-grid">
      {products.map((product, index) => (
        <BoutiqueProductCard
          key={product.id}
          product={product}
          initialFavoriteProductIds={initialFavoriteProductIds}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
}
