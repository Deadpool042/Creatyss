"use client";

import type { JSX } from "react";

import { cn } from "@/lib/utils";
import { PRODUCT_RESULTS_COUNT_COPY } from "@/features/admin/products/config";

type ProductTableToolbarResultsCountProps = {
  filteredCount: number;
  className?: string;
};

export function ProductTableToolbarResultsCount({
  filteredCount,
  className,
}: ProductTableToolbarResultsCountProps): JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-medium italic text-muted-foreground sm:text-[11px]",
        className
      )}
    >
      <span className="[@media(max-height:480px)]:hidden">
        {PRODUCT_RESULTS_COUNT_COPY.results(filteredCount)}
      </span>
      <span className="hidden [@media(max-height:480px)]:inline">{PRODUCT_RESULTS_COUNT_COPY.resultsShort(filteredCount)}</span>
    </span>
  );
}
