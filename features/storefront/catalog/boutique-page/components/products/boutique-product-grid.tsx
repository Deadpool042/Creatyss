"use client";

import { BoutiqueProductCard } from "@/features/storefront/catalog/boutique-page/components/products/boutique-product-card";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueProductGridProps = {
  products: BoutiquePageViewModel["products"];
};

export function BoutiqueProductGrid({ products }: BoutiqueProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 min-[560px]:gap-2.5 min-[560px]:max-[899px]:landscape:grid-cols-3 min-[560px]:max-[899px]:landscape:gap-1 min-[768px]:grid-cols-3 laptop:grid-cols-4 min-[900px]:max-[1199px]:landscape:grid-cols-3 min-[900px]:max-[1199px]:landscape:gap-1.5 min-[1100px]:max-[1199px]:landscape:grid-cols-4 desktop:grid-cols-4 desktop:gap-3 wide:grid-cols-4 ultrawide:grid-cols-5">
      {products.map((product) => (
        <BoutiqueProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
