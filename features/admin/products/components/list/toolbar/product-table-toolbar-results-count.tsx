"use client";

import type { JSX } from "react";

import { cn } from "@/lib/utils";

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
        {filteredCount} résultat{filteredCount !== 1 ? "s" : ""}
      </span>
      <span className="hidden [@media(max-height:480px)]:inline">{filteredCount} res.</span>
    </span>
  );
}
