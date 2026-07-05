"use client";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AdminSelectFilterControl } from "@/components/admin/tables/filters/admin-select-filter-control";
import {
  ADMIN_MEDIA_FORMAT_OPTIONS,
  ADMIN_MEDIA_SORT_OPTIONS,
  ADMIN_MEDIA_USAGE_OPTIONS,
} from "@/features/admin/media/components/admin-media-library-helpers";
import type {
  AdminMediaFormatFilter,
  AdminMediaSortOption,
  AdminMediaUsageFilter,
} from "@/features/admin/media/types/admin-media-list-item.types";
import { cn } from "@/lib/utils";

type AdminMediaMobileFiltersDrawerProps = Readonly<{
  activeFiltersCount: number;
  format: AdminMediaFormatFilter;
  onOpenChange: (open: boolean) => void;
  onFormatChange: (value: AdminMediaFormatFilter) => void;
  onSortChange: (value: AdminMediaSortOption) => void;
  onUsageChange: (value: AdminMediaUsageFilter) => void;
  open: boolean;
  sort: AdminMediaSortOption;
  usage: AdminMediaUsageFilter;
}>;

export function AdminMediaMobileFiltersDrawer({
  activeFiltersCount,
  format,
  onOpenChange,
  onFormatChange,
  onSortChange,
  onUsageChange,
  open,
  sort,
  usage,
}: AdminMediaMobileFiltersDrawerProps) {
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => onOpenChange(true)}
        aria-label={
          hasActiveFilters
            ? `Ouvrir les filtres (${activeFiltersCount} actifs)`
            : "Ouvrir les filtres"
        }
        className={cn(
          "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs [@media(max-height:480px)]:h-8 [@media(max-height:480px)]:gap-1 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:text-[11px]",
          hasActiveFilters
            ? "border-surface-border-strong bg-interactive-selected text-foreground hover:bg-interactive-selected"
            : "text-muted-foreground"
        )}
      >
        <Filter className="h-4 w-4" />
        <span>{hasActiveFilters ? `Filtres · ${activeFiltersCount}` : "Filtres"}</span>
      </Button>

      <SheetContent side="bottom" className="max-h-[85dvh] rounded-t-[1.75rem] p-0 sm:hidden">
        <SheetHeader className="gap-1 border-b border-surface-border/60 px-4 pb-3 pt-5 text-left">
          <SheetTitle>Filtres médias</SheetTitle>
          <SheetDescription>Trie et affine la bibliothèque sans surcharger la toolbar.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-3 px-4 py-4">
          <AdminSelectFilterControl
            label="Tri"
            value={sort}
            onValueChange={onSortChange}
            options={ADMIN_MEDIA_SORT_OPTIONS}
            triggerClassName="h-10 text-sm"
          />
          <AdminSelectFilterControl
            label="Format"
            value={format}
            onValueChange={onFormatChange}
            options={ADMIN_MEDIA_FORMAT_OPTIONS}
            triggerClassName="h-10 text-sm"
          />
          <AdminSelectFilterControl
            label="Usage"
            value={usage}
            onValueChange={onUsageChange}
            options={ADMIN_MEDIA_USAGE_OPTIONS}
            triggerClassName="h-10 text-sm"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
