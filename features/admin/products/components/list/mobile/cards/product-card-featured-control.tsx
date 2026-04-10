"use client";

import type { JSX } from "react";

import { toggleProductFeaturedAction } from "@/features/admin/products/list/actions";
import { cn } from "@/lib/utils";
import { ProductFeaturedToggle } from "../../product-featured-toggle";

type ProductCardFeaturedControlProps = {
  productId: string;
  isFeatured: boolean;
  className?: string;
};

export function ProductCardFeaturedControl({
  productId,
  isFeatured,
  className,
}: ProductCardFeaturedControlProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-full border border-surface-border bg-surface-panel-soft p-0.5",
        className
      )}
    >
      <ProductFeaturedToggle
        productId={productId}
        isFeatured={isFeatured}
        onToggle={toggleProductFeaturedAction}
      />
    </div>
  );
}
