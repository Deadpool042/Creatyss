import { Badge } from "@/components/ui/badge";
import { PRODUCT_STOCK_BADGE_COPY } from "@/features/admin/products/config";
import type { ProductStockState } from "@/features/admin/products/list/types";
import { cn } from "@/lib/utils";

type ProductStockBadgeProps = {
  state: ProductStockState;
  quantity: number | null;
  compact?: boolean;
  className?: string;
};

type StockConfig = {
  label: string;
  className: string;
};

function getStockConfig(
  state: ProductStockState,
  quantity: number | null,
  compact: boolean
): StockConfig {
  switch (state) {
    case "in-stock":
      return {
        label:
          typeof quantity === "number" && quantity > 0
            ? compact
              ? PRODUCT_STOCK_BADGE_COPY.withQuantityShort(
                  PRODUCT_STOCK_BADGE_COPY.inStockShort,
                  quantity
                )
              : PRODUCT_STOCK_BADGE_COPY.withQuantityFull(
                  PRODUCT_STOCK_BADGE_COPY.inStockLabel,
                  quantity
                )
            : compact
              ? PRODUCT_STOCK_BADGE_COPY.inStockShort
              : PRODUCT_STOCK_BADGE_COPY.inStockLabel,
        className: "bg-feedback-success-surface/75 text-feedback-success-foreground",
      };

    case "out-of-stock":
      return {
        label: PRODUCT_STOCK_BADGE_COPY.outOfStock,
        className: "bg-feedback-error-surface/75 text-feedback-error-foreground",
      };

    default:
      return {
        label: PRODUCT_STOCK_BADGE_COPY.unknown,
        className: "bg-surface-panel-soft/70 text-muted-foreground",
      };
  }
}

export function ProductStockBadge({
  state,
  quantity,
  compact = false,
  className,
}: ProductStockBadgeProps) {
  const config = getStockConfig(state, quantity, compact);

  return (
    <Badge
      variant="ghost"
      className={cn(
        compact
          ? "inline-flex h-6 items-center rounded-md px-1.5 text-[11px] font-medium leading-none"
          : "inline-flex h-7 items-center rounded-md px-2 text-[12px] font-medium leading-none",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
