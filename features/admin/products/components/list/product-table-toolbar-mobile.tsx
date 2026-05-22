"use client";

import { type JSX } from "react";

import { Filter } from "lucide-react";

import {
  AdminDataTableFeedbackBanner,
  AdminDataTableFiltersDrawer,
  AdminDataTableFloatingBar,
  AdminDataTableFiltersTrigger,
  AdminDataTableMobileStickyBar,
  AdminDataTableMobileTopbar,
  AdminDataTableSelectionSummary,
  AdminDataTableVisibleSelectionToggle,
} from "@/components/admin/tables";
import { cn } from "@/lib/utils";
import {
  PRODUCT_LIST_COPY,
  PRODUCT_SELECTION_COPY,
} from "@/features/admin/products/config";
import { useProductTableContext } from "./product-table-context";
import { ProductTableFiltersForm } from "./product-table-filters-form";
import {
  ProductTableToolbarBulkActions,
  ProductTableToolbarResultsCount,
  ProductTableToolbarViewSwitch,
} from "./toolbar";

const MOBILE_BULK_BAR_BOTTOM_CLASS_NAME =
  "bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.5rem)] [@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom)+0.4rem)]";

type ProductTableToolbarMobileProps = {
  onOpenPermanentDeleteDialog: () => void;
};

export function ProductTableToolbarMobile({
  onOpenPermanentDeleteDialog,
}: ProductTableToolbarMobileProps): JSX.Element {
  const { state, actions, view, mobileVisibleSelection } = useProductTableContext();

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

  return (
    <>
      <AdminDataTableFeedbackBanner message={bulkMessage} className="lg:hidden" />
      <AdminDataTableFeedbackBanner message={bulkError} tone="error" className="lg:hidden" />

      {hasSelection ? (
        <>
          <AdminDataTableMobileStickyBar>
            <AdminDataTableSelectionSummary
              label={PRODUCT_SELECTION_COPY.selectedDesktop(selectedCount)}
              clearLabel={PRODUCT_SELECTION_COPY.clearSelectionMobile}
              onClear={actions.clearSelection}
              className="flex w-full items-center justify-between gap-2"
              clearButtonClassName="h-8 shrink-0 rounded-full px-3 text-xs"
            />
          </AdminDataTableMobileStickyBar>

          <AdminDataTableFloatingBar
            mode="fixed"
            outerClassName={cn(
              "lg:hidden [@media(max-height:480px)]:px-2.5",
              MOBILE_BULK_BAR_BOTTOM_CLASS_NAME
            )}
            innerClassName="rounded-2xl p-2 backdrop-blur supports-backdrop-filter:bg-card/80"
          >
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
          </AdminDataTableFloatingBar>
        </>
      ) : (
        <>
          <AdminDataTableMobileStickyBar>
            <AdminDataTableMobileTopbar
              search={state.search}
              onSearchChange={state.handleSearchChange}
              placeholder={PRODUCT_LIST_COPY.searchPlaceholderMobile}
              controls={
                <AdminDataTableFiltersTrigger
                  icon={Filter}
                  label={PRODUCT_LIST_COPY.mobileFiltersLabel}
                  activeLabel={PRODUCT_LIST_COPY.mobileFiltersActiveLabel(activeFiltersCount)}
                  active={hasActiveFilters}
                  onClick={() => state.setMobileFiltersOpen(true)}
                  ariaLabel={
                    hasActiveFilters
                      ? PRODUCT_LIST_COPY.mobileFiltersAriaActive(activeFiltersCount)
                      : PRODUCT_LIST_COPY.mobileFiltersAriaOpen
                  }
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs [@media(max-height:480px)]:h-8 [@media(max-height:480px)]:gap-1 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:text-[11px]"
                  )}
                  activeClassName="border-surface-border-strong bg-interactive-selected text-foreground hover:bg-interactive-selected"
                />
              }
              trailing={
                <ProductTableToolbarResultsCount
                  filteredCount={state.filteredCount}
                  className="shrink-0 whitespace-nowrap rounded-full border border-surface-border bg-surface-panel-soft px-2.5 py-1 [@media(max-height:480px)]:px-2"
                />
              }
            />
          </AdminDataTableMobileStickyBar>

          <div className="mt-2 flex items-center justify-between gap-2 lg:hidden">
            <ProductTableToolbarViewSwitch view={view} />

            <AdminDataTableVisibleSelectionToggle
              checked={mobileAllVisibleSelected}
              ariaLabel={PRODUCT_SELECTION_COPY.selectVisibleAriaLabel}
              selectedCount={mobileVisibleSelectedCount}
              totalCount={mobileVisibleCount}
              {...(mobileVisibleSelection !== null
                ? { onToggle: () => actions.toggleSelectAllMobileVisible() }
                : {})}
            />
          </div>

          <AdminDataTableFiltersDrawer
            open={state.mobileFiltersOpen}
            onOpenChange={state.setMobileFiltersOpen}
            title={
              hasActiveFilters
                ? PRODUCT_LIST_COPY.mobileFiltersTitleActive(activeFiltersCount)
                : PRODUCT_LIST_COPY.mobileFiltersTitle
            }
            description={hasActiveFilters ? PRODUCT_LIST_COPY.mobileFiltersDescription(activeFiltersCount) : PRODUCT_LIST_COPY.mobileFiltersDescriptionEmpty}
            resetLabel={PRODUCT_LIST_COPY.mobileFiltersReset}
            applyLabel={PRODUCT_LIST_COPY.mobileFiltersApply}
            resetDisabled={!hasActiveFilters}
            onReset={state.reset}
            onApply={() => state.setMobileFiltersOpen(false)}
            activeFiltersTitle={PRODUCT_LIST_COPY.mobileFiltersActiveSection}
            activeFilterItems={state.activeFilters}
            activeFiltersCount={activeFiltersCount}
            onClearActiveFilters={state.reset}
          >
            <ProductTableFiltersForm
              categoryOptions={state.categoryOptions}
              state={state}
              mode="mobile"
            />
          </AdminDataTableFiltersDrawer>
        </>
      )}
    </>
  );
}
