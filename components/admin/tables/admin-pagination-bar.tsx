"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PER_PAGE_OPTIONS = [10, 25, 50] as const;

type AdminPaginationBarProps = {
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  className?: string;
};

function buildPageNumbers(currentPage: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [];

  if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, "…", totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages);
  }

  return pages;
}

export function AdminPaginationBar({
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
  className,
}: AdminPaginationBarProps): JSX.Element | null {
  if (totalPages <= 0) return null;

  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-t border-surface-border/40 pt-2.5",
        className
      )}
    >
      {/* Left: per-page selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Afficher</span>
        <Select value={String(perPage)} onValueChange={(v) => onPerPageChange(Number(v))}>
          <SelectTrigger className="h-7 w-[70px] rounded-lg border-surface-border text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PER_PAGE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)} className="text-xs">
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">par page</span>
      </div>

      {/* Right: page number buttons */}
      {totalPages > 1 ? (
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Page précédente"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {pages.map((page, idx) =>
            page === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-7 w-7 items-center justify-center text-xs text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={page}
                type="button"
                variant={page === currentPage ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "h-7 w-7 text-xs",
                  page === currentPage
                    ? "bg-interactive-selected text-foreground hover:bg-interactive-selected border border-surface-border-strong"
                    : ""
                )}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Button>
            )
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Page suivante"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
