"use client";

import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import { useState, type JSX } from "react";

import { AdminDataTableActiveFilters } from "@/components/admin/tables/admin-data-table-active-filters";
import { AdminDataTableFiltersSheet } from "@/components/admin/tables/admin-data-table-filters-sheet";
import { AdminSearchInput } from "@/components/admin/tables/admin-search-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductTableFiltersState } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type { ProductFilterCategoryOption } from "@/features/admin/products/list/types/product-table.types";
import { cn } from "@/lib/utils";
import { ProductTableToolbarBulkActions } from "./toolbar/product-table-toolbar-bulk-actions";
import { ProductTableToolbarPermanentDeleteDialog } from "./toolbar/product-table-toolbar-permanent-delete-dialog";
import { ProductTableToolbarResultsCount } from "./toolbar/product-table-toolbar-results-count";
import type { ProductListView } from "./toolbar/product-table-toolbar-types";
import { ProductTableToolbarViewSwitch } from "./toolbar/product-table-toolbar-view-switch";
import { ProductSearchSheet } from "./product-search-sheet";
import { ProductTableFiltersForm } from "./product-table-filters-form";

const MOBILE_STICKY_TOOLBAR_HEIGHT_CLASS_NAME = "h-13 [@media(max-height:480px)]:h-11";
const MOBILE_BULK_BAR_BOTTOM_CLASS_NAME =
  "bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.5rem)] [@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom)+0.4rem)]";

type ProductTableToolbarProps = {
  categoryOptions: ProductFilterCategoryOption[];
  state: ProductTableFiltersState;
  mode: "desktop" | "mobile";
  view: ProductListView;
  selectedCount?: number;
  onClearSelection?: () => void;
  bulkMessage?: string | null;
  bulkError?: string | null;
  isBulkPending?: boolean;
  onBulkSetDraft?: () => void;
  onBulkSetActive?: () => void;
  onBulkSetInactive?: () => void;
  onBulkSetFeatured?: () => void;
  onBulkUnsetFeatured?: () => void;
  onBulkArchive?: () => void;
  onBulkRestore?: () => void;
  onBulkPermanentDelete?: () => void;
  mobileVisibleCount?: number;
  mobileVisibleSelectedCount?: number;
  mobileAllVisibleSelected?: boolean;
  onToggleSelectAllMobileVisible?: () => void;
};

export function ProductTableToolbar({
  categoryOptions,
  state,
  mode,
  view,
  selectedCount = 0,
  onClearSelection,
  bulkMessage = null,
  bulkError = null,
  isBulkPending = false,
  onBulkSetDraft,
  onBulkSetActive,
  onBulkSetInactive,
  onBulkSetFeatured,
  onBulkUnsetFeatured,
  onBulkArchive,
  onBulkRestore,
  onBulkPermanentDelete,
  mobileVisibleCount = 0,
  mobileVisibleSelectedCount = 0,
  mobileAllVisibleSelected = false,
  onToggleSelectAllMobileVisible,
}: ProductTableToolbarProps): JSX.Element {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);

  const activeFiltersCount = state.activeFilters.length;
  const hasActiveFilters = activeFiltersCount > 0;
  const hasSelection = selectedCount > 0;

  const mobileFiltersLabel = hasActiveFilters ? `Filtres · ${activeFiltersCount}` : "Filtres";
  const mobileFiltersDescription = hasActiveFilters
    ? `${activeFiltersCount} filtre${activeFiltersCount > 1 ? "s" : ""} actif${activeFiltersCount > 1 ? "s" : ""}.`
    : "Affiner la liste.";

  async function handleBulkPermanentDelete(): Promise<void> {
    if (!onBulkPermanentDelete) {
      setPermanentDeleteDialogOpen(false);
      return;
    }

    await onBulkPermanentDelete();
    setPermanentDeleteDialogOpen(false);
  }

  if (mode === "desktop") {
    return (
      <>
        <div className="space-y-1.5">
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
                  onClick={onClearSelection}
                  className="h-8 rounded-full px-3 text-xs"
                >
                  Effacer la sélection
                </Button>
              </div>

              <div className="mt-3">
                <ProductTableToolbarBulkActions
                  view={view}
                  isBulkPending={isBulkPending}
                  {...(onBulkSetDraft ? { onBulkSetDraft } : {})}
                  {...(onBulkSetActive ? { onBulkSetActive } : {})}
                  {...(onBulkSetInactive ? { onBulkSetInactive } : {})}
                  {...(onBulkSetFeatured ? { onBulkSetFeatured } : {})}
                  {...(onBulkUnsetFeatured ? { onBulkUnsetFeatured } : {})}
                  {...(onBulkArchive ? { onBulkArchive } : {})}
                  {...(onBulkRestore ? { onBulkRestore } : {})}
                  {...(onBulkPermanentDelete
                    ? { onOpenPermanentDeleteDialog: () => setPermanentDeleteDialogOpen(true) }
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

          <div className="rounded-xl border border-surface-border bg-card p-3 lg:p-4 shadow-card">
            <div className="space-y-3">
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
                    className="whitespace-nowrap rounded-full border border-surface-border bg-surface-panel-soft px-2.5 py-1"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => state.setShowAdvancedFilters(!state.showAdvancedFilters)}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-full px-3",
                      hasActiveFilters &&
                        "border-surface-border-strong bg-interactive-selected text-foreground hover:bg-interactive-selected"
                    )}
                    aria-expanded={state.showAdvancedFilters}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {hasActiveFilters ? `Filtres · ${activeFiltersCount}` : "Filtres"}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                        state.showAdvancedFilters && "rotate-180"
                      )}
                    />
                  </Button>
                </div>
              </div>

              <div className="min-w-0">
                <ProductTableFiltersForm
                  categoryOptions={categoryOptions}
                  state={state}
                  mode="primary"
                />
              </div>
            </div>

            {state.showAdvancedFilters ? (
              <div className="mt-3 border-t border-surface-border pt-3">
                <div className="grid gap-2 xl:grid-cols-2 2xl:grid-cols-4">
                  <ProductTableFiltersForm
                    categoryOptions={categoryOptions}
                    state={state}
                    mode="secondary"
                  />
                </div>
              </div>
            ) : null}
          </div>

          {hasActiveFilters ? (
            <AdminDataTableActiveFilters items={state.activeFilters} onClearAll={state.reset} />
          ) : null}
        </div>

        <ProductTableToolbarPermanentDeleteDialog
          open={permanentDeleteDialogOpen}
          onOpenChange={setPermanentDeleteDialogOpen}
          isBulkPending={isBulkPending}
          onConfirm={handleBulkPermanentDelete}
        />
      </>
    );
  }

  return (
    <>
      {bulkMessage ? (
        <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-3 py-2 text-sm text-foreground shadow-card lg:hidden">
          {bulkMessage}
        </div>
      ) : null}

      {bulkError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive shadow-card lg:hidden">
          {bulkError}
        </div>
      ) : null}

      {hasSelection ? (
        <>
          <div className={cn("lg:hidden", MOBILE_STICKY_TOOLBAR_HEIGHT_CLASS_NAME)}>
            <div className="-mx-3 site-header-blur flex h-full items-center border-b border-shell-border px-3 shadow-card [@media(max-height:480px)]:-mx-2.5 [@media(max-height:480px)]:px-2.5">
              <div className="flex w-full items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={onClearSelection}
                  className="h-8 shrink-0 rounded-full px-3 text-xs"
                >
                  Effacer
                </Button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "fixed inset-x-0 z-40 px-3 lg:hidden [@media(max-height:480px)]:px-2.5",
              MOBILE_BULK_BAR_BOTTOM_CLASS_NAME
            )}
          >
            <div className="rounded-2xl border border-surface-border bg-card/95 p-2 shadow-lg backdrop-blur supports-backdrop-filter:bg-card/80">
              <ProductTableToolbarBulkActions
                view={view}
                isBulkPending={isBulkPending}
                {...(onBulkSetDraft ? { onBulkSetDraft } : {})}
                {...(onBulkSetActive ? { onBulkSetActive } : {})}
                {...(onBulkSetInactive ? { onBulkSetInactive } : {})}
                {...(onBulkSetFeatured ? { onBulkSetFeatured } : {})}
                {...(onBulkUnsetFeatured ? { onBulkUnsetFeatured } : {})}
                {...(onBulkArchive ? { onBulkArchive } : {})}
                {...(onBulkRestore ? { onBulkRestore } : {})}
                {...(onBulkPermanentDelete
                  ? { onOpenPermanentDeleteDialog: () => setPermanentDeleteDialogOpen(true) }
                  : {})}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={cn("lg:hidden", MOBILE_STICKY_TOOLBAR_HEIGHT_CLASS_NAME)}>
            <div className="-mx-3 site-header-blur flex h-full items-center border-b border-shell-border px-3 shadow-card [@media(max-height:480px)]:-mx-2.5 [@media(max-height:480px)]:px-2.5">
              <div className="flex w-full items-center gap-2 [@media(max-height:480px)]:gap-1.5">
                <div className="flex min-w-0 flex-1 items-center gap-2 [@media(max-height:480px)]:gap-1.5">
                  <ProductSearchSheet
                    open={mobileSearchOpen}
                    onOpenChange={setMobileSearchOpen}
                    value={state.search}
                    onChange={state.handleSearchChange}
                    triggerClassName="shrink-0"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => state.setMobileFiltersOpen(true)}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs [@media(max-height:480px)]:h-8 [@media(max-height:480px)]:gap-1 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:text-[11px]",
                      hasActiveFilters &&
                        "border-surface-border-strong bg-interactive-selected text-foreground hover:bg-interactive-selected"
                    )}
                    aria-label={
                      hasActiveFilters
                        ? `${activeFiltersCount} filtres actifs`
                        : "Ouvrir les filtres"
                    }
                  >
                    <Filter className="h-4 w-4" />
                    <span>{mobileFiltersLabel}</span>
                  </Button>
                </div>

                <ProductTableToolbarResultsCount
                  filteredCount={state.filteredCount}
                  className="shrink-0 whitespace-nowrap rounded-full border border-surface-border bg-surface-panel-soft px-2.5 py-1 [@media(max-height:480px)]:px-2"
                />
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 lg:hidden">
            <ProductTableToolbarViewSwitch view={view} />

            <label className="flex shrink-0 items-center gap-2 rounded-full border border-surface-border bg-surface-panel-soft px-3 py-2 text-xs font-medium text-foreground">
              <Checkbox
                checked={mobileAllVisibleSelected}
                aria-label="Sélectionner les produits affichés"
                {...(onToggleSelectAllMobileVisible
                  ? { onCheckedChange: () => onToggleSelectAllMobileVisible() }
                  : {})}
              />
              <span>
                {mobileVisibleSelectedCount}/{mobileVisibleCount}
              </span>
            </label>
          </div>

          <AdminDataTableFiltersSheet
            open={state.mobileFiltersOpen}
            onOpenChange={state.setMobileFiltersOpen}
            title={
              hasActiveFilters ? `Filtres produits · ${activeFiltersCount}` : "Filtres produits"
            }
            description={mobileFiltersDescription}
            footer={
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={state.reset}
                  className="h-9 rounded-full px-3 text-muted-foreground [@media(max-height:480px)]:h-8"
                  disabled={!hasActiveFilters}
                >
                  Réinitialiser
                </Button>

                <Button
                  type="button"
                  onClick={() => state.setMobileFiltersOpen(false)}
                  className="h-9 rounded-full px-4 [@media(max-height:480px)]:h-8"
                >
                  Appliquer
                </Button>
              </div>
            }
          >
            <div className="space-y-3.5 [@media(max-height:480px)]:space-y-3">
              {hasActiveFilters ? (
                <div className="rounded-xl border border-surface-border bg-surface-panel-soft p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Filtres actifs
                    </p>

                    <span className="rounded-full border border-surface-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {activeFiltersCount}
                    </span>
                  </div>

                  <AdminDataTableActiveFilters
                    items={state.activeFilters}
                    onClearAll={state.reset}
                  />
                </div>
              ) : null}

              <ProductTableFiltersForm
                categoryOptions={categoryOptions}
                state={state}
                mode="mobile"
              />
            </div>
          </AdminDataTableFiltersSheet>
        </>
      )}

      <ProductTableToolbarPermanentDeleteDialog
        open={permanentDeleteDialogOpen}
        onOpenChange={setPermanentDeleteDialogOpen}
        isBulkPending={isBulkPending}
        onConfirm={handleBulkPermanentDelete}
      />
    </>
  );
}
