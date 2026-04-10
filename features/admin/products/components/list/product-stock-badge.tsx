import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProductStockBadgeProps = {
  state: string;
  quantity: number | null;
  className?: string;
};

type StockConfig = {
  label: string;
  className: string;
};

function getStockConfig(state: string, quantity: number | null): StockConfig {
  switch (state) {
    case "in-stock":
      return {
        label: typeof quantity === "number" && quantity > 0 ? `En stock · ${quantity}` : "En stock",
        className:
          "border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground",
      };

    case "low-stock":
      return {
        label:
          typeof quantity === "number" && quantity >= 0
            ? `Stock faible · ${quantity}`
            : "Stock faible",
        className:
          "border-feedback-warning-border bg-feedback-warning-surface text-feedback-warning-foreground",
      };

    case "out-of-stock":
      return {
        label: "Rupture",
        className:
          "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground",
      };

    default:
      return {
        label: "Stock inconnu",
        className: "border-surface-border bg-surface-panel-soft text-muted-foreground",
      };
  }
}

export function ProductStockBadge({ state, quantity, className }: ProductStockBadgeProps) {
  const config = getStockConfig(state, quantity);

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex h-7 items-center rounded-full px-2.5 text-[12px] font-medium leading-none",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
