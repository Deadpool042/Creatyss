"use client";

import type { JSX } from "react";

type AdminProductsPriceCellProps = {
  priceLabel: string;
  compareAtPriceLabel?: string | null;
  hasPromotion: boolean;
};

export function AdminProductsPriceCell({
  priceLabel,
  compareAtPriceLabel,
  hasPromotion,
}: AdminProductsPriceCellProps): JSX.Element {
  if (priceLabel === "—") {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">{priceLabel}</span>

        {hasPromotion ? (
          <span className="inline-flex items-center rounded-full border border-surface-border-strong bg-interactive-selected px-2 py-0.5 text-[11px] text-foreground">
            Promo
          </span>
        ) : null}
      </div>

      {compareAtPriceLabel ? (
        <p className="text-xs text-muted-foreground line-through">{compareAtPriceLabel}</p>
      ) : null}
    </div>
  );
}
