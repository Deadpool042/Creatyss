"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AdminDataTableActiveFilters, type AdminDataTableActiveFilterItem } from "./admin-data-table-active-filters";

type AdminDataTableFiltersDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  activeFiltersTitle?: string;
  activeFilterItems?: AdminDataTableActiveFilterItem[];
  activeFiltersCount?: number;
  clearActiveFiltersLabel?: string;
  onClearActiveFilters?: () => void;
  resetLabel: string;
  applyLabel: string;
  onReset: () => void;
  onApply: () => void;
  resetDisabled?: boolean;
  stackedFooter?: boolean;
  contentClassName?: string;
};

export function AdminDataTableFiltersDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  activeFiltersTitle,
  activeFilterItems = [],
  activeFiltersCount,
  clearActiveFiltersLabel,
  onClearActiveFilters,
  resetLabel,
  applyLabel,
  onReset,
  onApply,
  resetDisabled = false,
  stackedFooter = false,
  contentClassName,
}: AdminDataTableFiltersDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={[
          "flex flex-col bg-background p-0",
          "max-h-[82svh] supports-[height:100dvh]:max-h-[82dvh]",
          "[@media(max-height:480px)]:max-h-[92svh]",
          "[@media(max-height:480px)]:supports-[height:100dvh]:max-h-[92dvh]",
        ].join(" ")}
      >
        <SheetHeader className="shrink-0 border-b border-shell-border px-4 py-3 text-left [@media(max-height:480px)]:py-2.5">
          <SheetTitle className="text-base font-semibold tracking-tight">{title}</SheetTitle>
          {description ? (
            <SheetDescription className="text-sm leading-6 text-muted-foreground [@media(max-height:480px)]:hidden">
              {description}
            </SheetDescription>
          ) : null}
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 [@media(max-height:480px)]:py-3">
          <div className={contentClassName ?? "space-y-3.5 [@media(max-height:480px)]:space-y-3"}>
            {activeFiltersTitle ? (
              <div className="rounded-xl border border-surface-border bg-surface-panel-soft p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {activeFiltersTitle}
                  </p>

                  <span className="rounded-full border border-surface-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {activeFiltersCount ?? activeFilterItems.length}
                  </span>
                </div>

                <AdminDataTableActiveFilters
                  items={activeFilterItems}
                  {...(onClearActiveFilters ? { onClearAll: onClearActiveFilters } : {})}
                  {...(clearActiveFiltersLabel ? { clearLabel: clearActiveFiltersLabel } : {})}
                />
              </div>
            ) : null}
            {children}
          </div>
        </div>

        <div
          className={cn(
            "shrink-0 border-t border-shell-border bg-background px-4 py-3",
            "[@media(max-height:480px)]:py-2.5"
          )}
        >
          <div
            className={cn(
              stackedFooter ? "flex flex-col gap-2" : "flex items-center justify-between gap-3"
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={onReset}
              disabled={resetDisabled}
              className={cn(
                stackedFooter
                  ? "w-full text-muted-foreground"
                  : "h-9 rounded-full px-3 text-muted-foreground [@media(max-height:480px)]:h-8"
              )}
            >
              {resetLabel}
            </Button>

            <Button
              size="sm"
              type="button"
              onClick={onApply}
              className={cn(
                stackedFooter
                  ? "w-full"
                  : "h-9 rounded-full px-4 [@media(max-height:480px)]:h-8"
              )}
            >
              {applyLabel}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
