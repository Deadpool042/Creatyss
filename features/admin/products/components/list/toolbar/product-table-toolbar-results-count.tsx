"use client";

import type { JSX } from "react";

import { AdminDataTableResultsCount } from "@/components/admin/tables";
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
    <AdminDataTableResultsCount
      count={filteredCount}
      fullLabel={PRODUCT_RESULTS_COUNT_COPY.results}
      shortLabel={PRODUCT_RESULTS_COUNT_COPY.resultsShort}
      className={className}
    />
  );
}
