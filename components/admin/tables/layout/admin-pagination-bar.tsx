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

const PER_PAGE_OPTIONS = [5, 10, 25, 50] as const;

type AdminPaginationBarProps = {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  perPageOptions?: readonly number[];
  className?: string;
};


export function AdminPaginationBar({
  currentPage,
  totalPages,
  perPage,
  totalItems,
  onPageChange,
  onPerPageChange,
  perPageOptions = PER_PAGE_OPTIONS,
  className,
}: AdminPaginationBarProps): JSX.Element | null {
  if (totalPages <= 0) return null;

  const from = totalItems !== undefined ? (currentPage - 1) * perPage + 1 : undefined;
  const to = totalItems !== undefined ? Math.min(currentPage * perPage, totalItems) : undefined;

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
          <SelectTrigger className="h-7 w-17.5 rounded-lg border-surface-border text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {perPageOptions.map((n) => (
              <SelectItem key={n} value={String(n)} className="text-xs">
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">par page</span>
        {from !== undefined && to !== undefined && totalItems !== undefined && (
          <span className="hidden text-xs text-muted-foreground sm:inline">
            · {from}–{to} sur {totalItems}
          </span>
        )}
      </div>

      {/* Right: page navigation */}
      {totalPages > 1 ? (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Page précédente"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          <span className="select-none text-xs text-foreground/65">
            Page {currentPage} / {totalPages}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
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
