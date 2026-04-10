"use client";

import type { JSX } from "react";

import { cn } from "@/lib/utils";

type AdminProductsPriceCellProps = {
  priceLabel: string;
  compareAtPriceLabel?: string | null;
  hasPromotion: boolean;
  compact?: boolean;
  className?: string;
};

export function AdminProductsPriceCell({
  priceLabel,
  compareAtPriceLabel,
  hasPromotion,
  compact = false,
  className,
}: AdminProductsPriceCellProps): JSX.Element {
  if (priceLabel === "—") {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className={cn(compact ? "space-y-0.5" : "space-y-1", className)}>
      <div className={cn("flex flex-wrap items-center", compact ? "gap-1.5" : "gap-2")}>
        <span className={cn(compact ? "text-[13px] font-semibold leading-5" : "text-sm font-medium", "text-foreground")}>
          {priceLabel}
        </span>

        {hasPromotion ? (
          <span
            className={cn(
              "inline-flex items-center rounded-full border border-surface-border-strong bg-interactive-selected text-foreground",
              compact ? "px-1.5 py-0 text-[10px] leading-4" : "px-2 py-0.5 text-[11px]"
            )}
          >
            Promo
          </span>
        ) : null}
      </div>

      {compareAtPriceLabel ? (
        <p
          className={cn(
            "line-through text-muted-foreground",
            compact ? "text-[11px] leading-4" : "text-xs"
          )}
        >
          {compareAtPriceLabel}
        </p>
      ) : null}
    </div>
  );
}
