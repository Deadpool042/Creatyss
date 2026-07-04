"use client";

import { useState, type JSX, type ReactNode } from "react";
import { Filter } from "lucide-react";

import { AdminConfigDataTableToolbar } from "@/components/admin/tables/admin-config-data-table-toolbar";
import { AdminDataTableFeedbackBanner } from "@/components/admin/tables/layout/admin-data-table-feedback-banner";
import { AdminSelectFilterControl } from "@/components/admin/tables/filters/admin-select-filter-control";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  PRODUCT_LIST_ACTIONS_COPY,
  PRODUCT_LIST_COPY,
  PRODUCT_RESULTS_COUNT_COPY,
  PRODUCT_SORT_OPTIONS,
} from "@/features/admin/products/config";
import type { ProductSortOption } from "@/features/admin/products/list/types";
import { useProductTableContext } from "../desktop/product-table-context";
import { ProductTableFilterControls } from "./product-table-filter-controls";
import { ProductTableMobileFiltersDrawer } from "./product-table-mobile-filters-drawer";
import { ProductTableToolbarBulkActions } from "./product-table-toolbar-bulk-actions";
import { ProductTableToolbarViewSwitch } from "./product-table-toolbar-view-switch";

const MOBILE_BULK_BAR_BOTTOM_CLASS_NAME =
  "bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.5rem)] [@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom)+0.4rem)]";

type ProductTableToolbarProps = Readonly<{
  onOpenPermanentDeleteDialog: () => void;
  /** Action de création produit — vivait avant dans AdminPageContextBar (barre séparée). */
  createAction?: ReactNode;
}>;

export function ProductListToolbar({
  onOpenPermanentDeleteDialog,
  createAction,
}: ProductTableToolbarProps): JSX.Element {
  const { state, actions, view } = useProductTableContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedCount = actions.selectedCount;
  const hasSelection = selectedCount > 0;
  const activeFilterItems = state.activeFilters;
  const activeFiltersCount = activeFilterItems.length;
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <>
      <AdminConfigDataTableToolbar
        search={state.search}
        onSearchChange={state.handleSearchChange}
        mobileSearchPlaceholder={PRODUCT_LIST_COPY.searchPlaceholderMobile}
        desktopSearchPlaceholder={PRODUCT_LIST_COPY.searchPlaceholder}
        feedback={
          <>
            <AdminDataTableFeedbackBanner message={actions.bulkMessage} />
            <AdminDataTableFeedbackBanner message={actions.bulkError} tone="error" />
          </>
        }
        mobileControls={
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={
              hasActiveFilters
                ? PRODUCT_LIST_COPY.mobileFiltersAriaActive(activeFiltersCount)
                : PRODUCT_LIST_COPY.mobileFiltersAriaOpen
            }
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs [@media(max-height:480px)]:h-8 [@media(max-height:480px)]:gap-1 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:text-[11px]",
              hasActiveFilters
                ? "border-surface-border-strong bg-interactive-selected text-foreground hover:bg-interactive-selected"
                : "text-muted-foreground"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>
              {hasActiveFilters
                ? `${PRODUCT_LIST_ACTIONS_COPY.mobileFiltersLabel}${PRODUCT_LIST_ACTIONS_COPY.mobileFiltersWithCountSeparator}${activeFiltersCount}`
                : PRODUCT_LIST_ACTIONS_COPY.mobileFiltersLabel}
            </span>
          </Button>
        }
        mobileTrailing={
          <div className="flex items-center gap-2">
            <ProductTableToolbarViewSwitch
              view={view}
              className="shrink-0 scale-[0.92] origin-right"
            />
            {createAction ? (
              <>
                <Separator orientation="vertical" className="h-5" />
                <div className="shrink-0 [&_button]:h-9 [&_button]:rounded-full [&_button]:px-3 [&_button]:text-xs">
                  {createAction}
                </div>
              </>
            ) : null}
          </div>
        }
        desktopFilters={
          <ProductTableFilterControls
            categoryOptions={state.categoryOptions}
            status={state.status}
            featured={state.featured}
            image={state.image}
            variant={state.variant}
            stock={state.stock}
            categorySlugs={state.categorySlugs}
            onStatusChange={state.setStatus}
            onFeaturedChange={state.setFeatured}
            onImageChange={state.setImage}
            onVariantChange={state.setVariant}
            onStockChange={state.setStock}
            onCategorySlugsChange={state.setCategorySlugs}
          />
        }
        desktopTrailing={
          <div className="flex items-center gap-1.5">
            <AdminSelectFilterControl
              value={state.sort}
              onValueChange={(value) => state.setSort(value as ProductSortOption)}
              options={PRODUCT_SORT_OPTIONS}
              triggerClassName="h-8 w-34 text-xs text-foreground/65"
            />
            <ProductTableToolbarViewSwitch view={view} />
            {createAction ? (
              <>
                <Separator orientation="vertical" className="h-5" />
                {createAction}
              </>
            ) : null}
          </div>
        }
        activeFilters={activeFilterItems}
        onClearActiveFilters={state.reset}
        clearActiveFiltersLabel={PRODUCT_LIST_COPY.activeFiltersResetLabel}
        resultsCount={state.filteredCount}
        resultsFullLabel={PRODUCT_RESULTS_COUNT_COPY.results}
        resultsShortLabel={PRODUCT_RESULTS_COUNT_COPY.resultsShort}
      />

      <ProductTableMobileFiltersDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        categoryOptions={state.categoryOptions}
        state={state}
        hasActiveFilters={hasActiveFilters}
        activeFilterItems={activeFilterItems}
      />

      {hasSelection ? (
        <ProductTableMobileBulkBar
          view={view}
          isBulkPending={actions.isBulkPending}
          onBulkSetDraft={() => void actions.handleBulkStatusChange("draft")}
          onBulkSetActive={() => void actions.handleBulkStatusChange("active")}
          onBulkSetInactive={() => void actions.handleBulkStatusChange("inactive")}
          onBulkSetFeatured={() => void actions.handleBulkFeaturedChange(true)}
          onBulkUnsetFeatured={() => void actions.handleBulkFeaturedChange(false)}
          onBulkArchive={() => void actions.handleBulkArchive()}
          onBulkRestore={() => void actions.handleBulkRestore()}
          {...(view === "trash" ? { onOpenPermanentDeleteDialog } : {})}
        />
      ) : null}
    </>
  );
}

export { ProductListToolbar as ProductTableToolbar };

type ProductTableMobileBulkBarProps = Readonly<{
  view: Parameters<typeof ProductTableToolbarBulkActions>[0]["view"];
  isBulkPending: boolean;
  onBulkSetDraft: () => void;
  onBulkSetActive: () => void;
  onBulkSetInactive: () => void;
  onBulkSetFeatured: () => void;
  onBulkUnsetFeatured: () => void;
  onBulkArchive: () => void;
  onBulkRestore: () => void;
  onOpenPermanentDeleteDialog?: () => void;
}>;

function ProductTableMobileBulkBar({
  view,
  isBulkPending,
  onBulkSetDraft,
  onBulkSetActive,
  onBulkSetInactive,
  onBulkSetFeatured,
  onBulkUnsetFeatured,
  onBulkArchive,
  onBulkRestore,
  onOpenPermanentDeleteDialog,
}: ProductTableMobileBulkBarProps): JSX.Element {
  return (
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
          onBulkSetDraft={onBulkSetDraft}
          onBulkSetActive={onBulkSetActive}
          onBulkSetInactive={onBulkSetInactive}
          onBulkSetFeatured={onBulkSetFeatured}
          onBulkUnsetFeatured={onBulkUnsetFeatured}
          onBulkArchive={onBulkArchive}
          onBulkRestore={onBulkRestore}
          {...(onOpenPermanentDeleteDialog ? { onOpenPermanentDeleteDialog } : {})}
        />
      </div>
    </div>
  );
}
