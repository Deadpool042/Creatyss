"use client";

import type { JSX } from "react";

import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { AdminDataTableActiveFilters } from "@/components/admin/tables/admin-data-table-active-filters";
import { AdminSearchInput } from "@/components/admin/tables/admin-search-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProductTableContext } from "./product-table-context";
import { ProductTableFiltersForm } from "./product-table-filters-form";
import { ProductTableToolbarBulkActions } from "./toolbar/product-table-toolbar-bulk-actions";
import { ProductTableToolbarResultsCount } from "./toolbar/product-table-toolbar-results-count";
import { ProductTableToolbarViewSwitch } from "./toolbar/product-table-toolbar-view-switch";

type ProductTableToolbarDesktopProps = {
  onOpenPermanentDeleteDialog: () => void;
};

export function ProductTableToolbarDesktop({
  onOpenPermanentDeleteDialog,
}: ProductTableToolbarDesktopProps): JSX.Element {
  const { state, actions, view } = useProductTableContext();

  const selectedCount = actions.selectedCount;
  const bulkMessage = actions.bulkMessage;
  const bulkError = actions.bulkError;
  const isBulkPending = actions.isBulkPending;
  const activeFiltersCount = state.activeFilters.length;
  const hasActiveFilters = activeFiltersCount > 0;
  const hasSelection = selectedCount > 0;

  return (
    <div className="space-y-2">
      {hasSelection ? (
        <div className="rounded-xl border border-surface-border-strong bg-interactive-selected px-3 py-3 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">
              {selectedCount} produit{selectedCount > 1 ? "s" : ""} sélectionné
              {selectedCount > 1 ? "s" : ""}
            </p>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={actions.clearSelection}
              className="h-8 rounded-full px-3 text-xs"
            >
              Effacer la sélection
            </Button>
          </div>

          <div className="mt-3">
            <ProductTableToolbarBulkActions
              view={view}
              isBulkPending={isBulkPending}
              onBulkSetDraft={() => void actions.handleBulkStatusChange("draft")}
              onBulkSetActive={() => void actions.handleBulkStatusChange("active")}
              onBulkSetInactive={() => void actions.handleBulkStatusChange("inactive")}
              onBulkSetFeatured={() => void actions.handleBulkFeaturedChange(true)}
              onBulkUnsetFeatured={() => void actions.handleBulkFeaturedChange(false)}
              onBulkArchive={() => void actions.handleBulkArchive()}
              onBulkRestore={() => void actions.handleBulkRestore()}
              {...(view === "trash"
                ? { onOpenPermanentDeleteDialog }
                : {})}
            />
          </div>
        </div>
      ) : null}

      {bulkMessage ? (
        <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-3 py-2 text-sm text-foreground shadow-card">
          {bulkMessage}
        </div>
      ) : null}

      {bulkError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive shadow-card">
          {bulkError}
        </div>
      ) : null}

      <div className="border-b border-surface-border/40 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1 max-w-120 xl:max-w-136 2xl:max-w-152">
            <AdminSearchInput
              value={state.search}
              onChange={state.handleSearchChange}
              placeholder="Rechercher un produit…"
              className="relative w-full"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ProductTableToolbarViewSwitch view={view} />

            <ProductTableToolbarResultsCount
              filteredCount={state.filteredCount}
              className="whitespace-nowrap"
            />

            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => state.setShowAdvancedFilters(!state.showAdvancedFilters)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs",
                hasActiveFilters
                  ? "border-surface-border-strong bg-interactive-selected text-foreground hover:bg-interactive-selected"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-expanded={state.showAdvancedFilters}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {hasActiveFilters ? `Filtres · ${activeFiltersCount}` : "Filtres"}
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  state.showAdvancedFilters && "rotate-180"
                )}
              />
            </Button>
          </div>
        </div>

        <div className="mt-3 min-w-0">
          <ProductTableFiltersForm
            categoryOptions={state.categoryOptions}
            state={state}
            mode="primary"
          />
        </div>

        {state.showAdvancedFilters ? (
          <div className="mt-2.5 grid gap-2 lg:grid-cols-2 xl:grid-cols-4">
            <ProductTableFiltersForm
              categoryOptions={state.categoryOptions}
              state={state}
              mode="secondary"
            />
          </div>
        ) : null}
      </div>

      {hasActiveFilters ? (
        <AdminDataTableActiveFilters items={state.activeFilters} onClearAll={state.reset} />
      ) : null}
    </div>
  );
}
