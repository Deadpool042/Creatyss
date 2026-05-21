"use client";

import { Archive, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORY_LIST_COPY } from "@/features/admin/categories/config";

type CategoryBulkBarProps = {
  count: number;
  isPending: boolean;
  onClear: () => void;
  onArchive: () => void;
};

export function CategoryBulkBar({ count, isPending, onClear, onArchive }: CategoryBulkBarProps) {
  if (count === 0) return null;

  return (
    <div className="sticky bottom-4 flex justify-center">
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-surface-border",
          "bg-card/95 px-4 py-2.5 shadow-lg backdrop-blur-sm",
          "animate-in fade-in slide-in-from-bottom-2 duration-200"
        )}
      >
        <span className="text-sm font-medium text-foreground">
          {CATEGORY_LIST_COPY.bulkSelectionCountLabel(count)}
        </span>

        <div className="h-4 w-px bg-surface-border" />

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-muted-foreground hover:text-foreground"
          disabled={isPending}
          onClick={onArchive}
          aria-label={CATEGORY_LIST_COPY.bulkArchiveAriaLabel(count)}
        >
          <Archive className="h-3.5 w-3.5" />
          {isPending
            ? CATEGORY_LIST_COPY.bulkArchivePendingLabel
            : CATEGORY_LIST_COPY.bulkArchiveLabel(count)}
        </Button>

        <button
          type="button"
          onClick={onClear}
          disabled={isPending}
          className="ml-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          aria-label={CATEGORY_LIST_COPY.clearSelectionAriaLabel}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
