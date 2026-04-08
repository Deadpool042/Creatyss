"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";

type AdminDataTablePaginationCompactProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
};

export function AdminDataTablePaginationCompact({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
}: AdminDataTablePaginationCompactProps): JSX.Element | null {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border bg-background/95 px-2 py-1 backdrop-blur supports-backdrop-filter:bg-background/80">
      <span className="text-[11px] text-muted-foreground">
        {currentPage}/{totalPages}
      </span>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={onPrevious}
        disabled={previousDisabled}
        aria-label="Page précédente"
        className="h-7 w-7 rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Page suivante"
        className="h-7 w-7 rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
