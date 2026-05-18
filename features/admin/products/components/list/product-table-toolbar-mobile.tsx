"use client";

import { useState, type JSX } from "react";

import { Filter } from "lucide-react";

import { AdminDataTableActiveFilters } from "@/components/admin/tables/admin-data-table-active-filters";
import { AdminDataTableFiltersSheet } from "@/components/admin/tables/admin-data-table-filters-sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useProductTableContext } from "./product-table-context";
import { ProductSearchSheet } from "./product-search-sheet";
import { ProductTableFiltersForm } from "./product-table-filters-form";
import { ProductTableToolbarBulkActions } from "./toolbar/product-table-toolbar-bulk-actions";
import { ProductTableToolbarResultsCount } from "./toolbar/product-table-toolbar-results-count";
import { ProductTableToolbarViewSwitch } from "./toolbar/product-table-toolbar-view-switch";

const MOBILE_STICKY_TOOLBAR_HEIGHT_CLASS_NAME = "h-13 [@media(max-height:480px)]:h-11";
const MOBILE_BULK_BAR_BOTTOM_CLASS_NAME =
  "bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.5rem)] [@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom)+0.4rem)]";

type ProductTableToolbarMobileProps = {
  onOpenPermanentDeleteDialog: () => void;
};

export function ProductTableToolbarMobile({
  onOpenPermanentDeleteDialog,
}: ProductTableToolbarMobileProps): JSX.Element {
  const { state, actions, view, mobileVisibleSelection } = useProductTableContext();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const selectedCount = actions.selectedCount;
  const bulkMessage = actions.bulkMessage;
  const bulkError = actions.bulkError;
  const isBulkPending = actions.isBulkPending;
  const mobileVisibleCount = mobileVisibleSelection?.visibleCount ?? 0;
  const mobileVisibleSelectedCount = mobileVisibleSelection?.visibleSelectedCount ?? 0;
  const mobileAllVisibleSelected = mobileVisibleSelection?.areAllVisibleSelected ?? false;
  const activeFiltersCount = state.activeFilters.length;
  const hasActiveFilters = activeFiltersCount > 0;
  const hasSelection = selectedCount > 0;
  const mobileFiltersLabel = hasActiveFilters ? `Filtres · ${activeFiltersCount}` : "Filtres";
  const mobileFiltersDescription = hasActiveFilters
    ? `${activeFiltersCount} filtre${activeFiltersCount > 1 ? "s" : ""} actif${activeFiltersCount > 1 ? "s" : ""}.`
    : "Affiner la liste.";

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
                  onClick={actions.clearSelection}
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
                {...(mobileVisibleSelection !== null
                  ? { onCheckedChange: () => actions.toggleSelectAllMobileVisible() }
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
                categoryOptions={state.categoryOptions}
                state={state}
                mode="mobile"
              />
            </div>
          </AdminDataTableFiltersSheet>
        </>
      )}
    </>
  );
}
