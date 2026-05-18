"use client";

import type { JSX } from "react";

import { Button } from "@/components/ui/button";

type ProductTablePaginationProps = {
  currentPage: number;
  totalPages: number;
  filteredCount: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function ProductTablePagination({
  currentPage,
  totalPages,
  filteredCount,
  onPrevious,
  onNext,
}: ProductTablePaginationProps): JSX.Element {
  return (
    <div className="shrink-0 flex items-center justify-between border-t border-surface-border/40 pt-2.5">
      <p className="text-xs text-muted-foreground/70">
        Page {currentPage} sur {totalPages}
        {totalPages > 1 ? (
          <span className="ml-1.5 opacity-70">
            · {filteredCount} produit{filteredCount !== 1 ? "s" : ""}
          </span>
        ) : null}
      </p>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={currentPage <= 1}
          className="h-7 px-2 text-xs"
        >
          Précédent
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="h-7 px-2 text-xs"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
