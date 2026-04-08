"use client";

import type { JSX } from "react";

type ProductCategoriesSummaryProps = {
  linkedCount: number;
  primaryLabel: string;
};

export function ProductCategoriesSummary({
  linkedCount,
  primaryLabel,
}: ProductCategoriesSummaryProps): JSX.Element {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-border/60 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Catégories liées
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {linkedCount} sélectionnée{linkedCount > 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-xl border border-border/60 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Catégorie principale
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">{primaryLabel}</p>
      </div>
    </div>
  );
}
