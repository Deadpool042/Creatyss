"use client";

import { Archive } from "lucide-react";

import { AdminDataTableSelectionFloatingBar } from "@/components/admin/tables";
import { Button } from "@/components/ui/button";
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
    <AdminDataTableSelectionFloatingBar
      selectionLabel={CATEGORY_LIST_COPY.bulkSelectionCountLabel(count)}
      clearSelectionLabel={CATEGORY_LIST_COPY.clearSelectionAriaLabel}
      onClearSelection={onClear}
      disabled={isPending}
      innerClassName="flex-nowrap"
    >
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
    </AdminDataTableSelectionFloatingBar>
  );
}
