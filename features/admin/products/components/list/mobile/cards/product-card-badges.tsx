"use client";

import type { JSX } from "react";

import { ProductStatusBadge } from "@/features/admin/products/components/shared";
import type { ProductTableItem } from "@/features/admin/products/list/types";
import { cn } from "@/lib/utils";
import { ProductStockBadge } from "../../product-stock-badge";

type ProductCardBadgesProps = {
  product: Pick<
    ProductTableItem,
    "isFeatured" | "status" | "stockQuantity" | "stockState" | "variantCount"
  >;
  showFeaturedBadge?: boolean;
  className?: string;
  statusClassName?: string;
  stockClassName?: string;
  metricClassName?: string;
};

export function ProductCardBadges({
  product,
  className,
  statusClassName,
  stockClassName,
  metricClassName,
}: ProductCardBadgesProps): JSX.Element {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <ProductStatusBadge
        status={product.status}
        {...(statusClassName ? { className: statusClassName } : {})}
      />
      <ProductStockBadge
        state={product.stockState}
        quantity={product.stockQuantity}
        {...(stockClassName ? { className: stockClassName } : {})}
      />

      <span
        className={cn(
          [
            "inline-flex h-7 items-center rounded-full border border-surface-border",
            "bg-surface-panel-soft px-2.5 text-xs font-medium leading-none text-muted-foreground",
          ].join(" "),
          metricClassName
        )}
      >
        {product.variantCount} variante{product.variantCount > 1 ? "s" : ""}
      </span>
    </div>
  );
}
