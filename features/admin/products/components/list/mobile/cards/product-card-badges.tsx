"use client";

import type { JSX } from "react";

import { AdminStatusBadge } from "@/components/admin/shared/admin-status-badge";
import type { ProductTableItem } from "@/features/admin/products/list/types";
import { PRODUCT_CARD_BADGES_COPY } from "@/features/admin/products/config";
import { cn } from "@/lib/utils";
import { ProductStockBadge } from "../../product-stock-badge";

type ProductCardBadgesProps = {
  product: Pick<
    ProductTableItem,
    "isFeatured" | "status" | "stockQuantity" | "stockState" | "variantCount"
  >;
  compact?: boolean;
  className?: string;
  statusClassName?: string;
  stockClassName?: string;
  metricClassName?: string;
};

function getVariantLabel(variantCount: number, compact: boolean): string {
  if (variantCount <= 1) {
    return PRODUCT_CARD_BADGES_COPY.variantSingle;
  }

  return compact
    ? PRODUCT_CARD_BADGES_COPY.variantCountShort(variantCount)
    : PRODUCT_CARD_BADGES_COPY.variantCountFull(variantCount);
}

export function ProductCardBadges({
  product,
  compact = false,
  className,
  statusClassName,
  stockClassName,
  metricClassName,
}: ProductCardBadgesProps): JSX.Element {
  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-1.5", className)}>
      <AdminStatusBadge
        status={product.status}
        {...(statusClassName ? { className: statusClassName } : {})}
      />
      <ProductStockBadge
        state={product.stockState}
        quantity={product.stockQuantity}
        compact={compact}
        {...(stockClassName ? { className: stockClassName } : {})}
      />

      <span
        className={cn(
          [
            compact
              ? "inline-flex h-6 items-center rounded-full border border-surface-border/70 bg-transparent px-2 text-[11px] font-medium leading-none text-muted-foreground/90"
              : "inline-flex h-7 items-center rounded-full border border-surface-border/70 bg-transparent px-2.5 text-xs font-medium leading-none text-muted-foreground/90",
          ].join(" "),
          metricClassName
        )}
      >
        {getVariantLabel(product.variantCount, compact)}
      </span>
    </div>
  );
}
