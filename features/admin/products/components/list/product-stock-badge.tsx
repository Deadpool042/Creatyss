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

function getStockConfig(state: ProductStockState, quantity: number | null, compact: boolean): StockConfig {
  switch (state) {
    case "in-stock":
      return {
        label:
          typeof quantity === "number" && quantity > 0
            ? compact
              ? PRODUCT_STOCK_BADGE_COPY.withQuantityShort(PRODUCT_STOCK_BADGE_COPY.inStockShort, quantity)
              : PRODUCT_STOCK_BADGE_COPY.withQuantityFull(PRODUCT_STOCK_BADGE_COPY.inStockLabel, quantity)
            : compact
              ? PRODUCT_STOCK_BADGE_COPY.inStockShort
              : PRODUCT_STOCK_BADGE_COPY.inStockLabel,
        className:
          "border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground",
      };

    case "out-of-stock":
      return {
        label: PRODUCT_STOCK_BADGE_COPY.outOfStock,
        className:
          "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground",
      };

    default:
      return {
        label: PRODUCT_STOCK_BADGE_COPY.unknown,
        className: "border-surface-border bg-surface-panel-soft text-muted-foreground",
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
      variant="outline"
      className={cn(
        compact
          ? "inline-flex h-6 items-center rounded-full px-2 text-[11px] font-medium leading-none"
          : "inline-flex h-7 items-center rounded-full px-2.5 text-[12px] font-medium leading-none",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
