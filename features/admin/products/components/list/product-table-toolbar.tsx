"use client";

import { useState, type JSX } from "react";
import { Filter } from "lucide-react";

import { AdminToolbar } from "@/components/admin/shared/admin-toolbar";
import {
  AdminDataTableActiveFilters,
  AdminDataTableFeedbackBanner,
  AdminDataTableFilterControlsRow,
  AdminDataTableFiltersTrigger,
  AdminDataTableFloatingBar,
  AdminDataTableMobileTopbar,
  AdminDataTableResultsCount,
  AdminDataTableToolbarLayout,
} from "@/components/admin/tables";
import { AdminSelectFilterControl } from "@/components/admin/tables/filters";
import { cn } from "@/lib/utils";
import {
  PRODUCT_LIST_ACTIONS_COPY,
  PRODUCT_LIST_COPY,
  PRODUCT_RESULTS_COUNT_COPY,
  PRODUCT_SORT_OPTIONS,
} from "@/features/admin/products/config";
import type {
  ProductSortOption,
  ProductTableFiltersState,
} from "@/features/admin/products/list/types";
import { useProductTableContext } from "./product-table-context";
import {
  ProductTableFilterControls,
  ProductTableMobileFiltersDrawer,
  ProductTableToolbarBulkActions,
  ProductTableToolbarViewSwitch,
} from "./toolbar";

const MOBILE_BULK_BAR_BOTTOM_CLASS_NAME =
  "bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.5rem)] [@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom)+0.4rem)]";

type ProductTableToolbarProps = Readonly<{
  onOpenPermanentDeleteDialog: () => void;
}>;

export function ProductTableToolbar({
  onOpenPermanentDeleteDialog,
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
      <AdminDataTableToolbarLayout
        feedback={
          <>
            <AdminDataTableFeedbackBanner message={actions.bulkMessage} />
            <AdminDataTableFeedbackBanner message={actions.bulkError} tone="error" />
          </>
        }
        toolbar={
          <>
            <ProductTableMobileTopbar
              search={state.search}
              onSearchChange={state.handleSearchChange}
              activeFiltersCount={activeFiltersCount}
              hasActiveFilters={hasActiveFilters}
              onOpenFilters={() => setDrawerOpen(true)}
              view={view}
            />

            <ProductTableDesktopToolbar
              search={state.search}
              onSearchChange={state.handleSearchChange}
              sort={state.sort}
              onSortChange={state.setSort}
              categoryOptions={state.categoryOptions}
              state={state}
              view={view}
            />
          </>
        }
        activeFilters={
          hasActiveFilters ? (
            <AdminDataTableActiveFilters
              items={activeFilterItems}
              onClearAll={state.reset}
              clearLabel={PRODUCT_LIST_COPY.activeFiltersResetLabel}
              className="hidden lg:flex"
            />
          ) : null
        }
        meta={
          <AdminDataTableResultsCount
            count={state.filteredCount}
            fullLabel={PRODUCT_RESULTS_COUNT_COPY.results}
            shortLabel={PRODUCT_RESULTS_COUNT_COPY.resultsShort}
            className="text-xs not-italic"
          />
        }
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

type ProductTableMobileTopbarProps = Readonly<{
  search: string;
  onSearchChange: (value: string) => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  view: Parameters<typeof ProductTableToolbarViewSwitch>[0]["view"];
}>;

function ProductTableMobileTopbar({
  search,
  onSearchChange,
  activeFiltersCount,
  hasActiveFilters,
  onOpenFilters,
  view,
}: ProductTableMobileTopbarProps): JSX.Element {
  return (
    <div className="lg:hidden">
      <AdminDataTableMobileTopbar
        search={search}
        onSearchChange={onSearchChange}
        placeholder={PRODUCT_LIST_COPY.searchPlaceholderMobile}
        controls={
          <AdminDataTableFiltersTrigger
            icon={Filter}
            label={PRODUCT_LIST_ACTIONS_COPY.mobileFiltersLabel}
            activeLabel={`${PRODUCT_LIST_ACTIONS_COPY.mobileFiltersLabel}${PRODUCT_LIST_ACTIONS_COPY.mobileFiltersWithCountSeparator}${activeFiltersCount}`}
            active={hasActiveFilters}
            onClick={onOpenFilters}
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
          <div className="flex items-center gap-2">
            <ProductTableToolbarViewSwitch
              view={view}
              className="shrink-0 scale-[0.92] origin-right"
            />
          </div>
        }
      />
    </div>
  );
}

type ProductTableDesktopToolbarProps = Readonly<{
  search: string;
  onSearchChange: (value: string) => void;
  sort: ProductSortOption;
  onSortChange: (value: ProductSortOption) => void;
  categoryOptions: Parameters<typeof ProductTableFilterControls>[0]["categoryOptions"];
  state: ProductTableFiltersState;
  view: Parameters<typeof ProductTableToolbarViewSwitch>[0]["view"];
}>;

function ProductTableDesktopToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  categoryOptions,
  state,
  view,
}: ProductTableDesktopToolbarProps): JSX.Element {
  return (
    <AdminToolbar
      search={search}
      onSearchChange={onSearchChange}
      placeholder={PRODUCT_LIST_COPY.searchPlaceholder}
      className="mt-0"
      hideMobile
      extraControls={
        <AdminDataTableFilterControlsRow
          filters={
            <ProductTableFilterControls
              categoryOptions={categoryOptions}
              status={state.status}
              featured={state.featured}
              image={state.image}
              variant={state.variant}
              stock={state.stock}
              categoryIds={state.categoryIds}
              onStatusChange={state.setStatus}
              onFeaturedChange={state.setFeatured}
              onImageChange={state.setImage}
              onVariantChange={state.setVariant}
              onStockChange={state.setStock}
              onCategoryIdsChange={state.setCategoryIds}
            />
          }
          trailing={
            <>
              <AdminSelectFilterControl
                value={sort}
                onValueChange={(value) => onSortChange(value as ProductSortOption)}
                options={PRODUCT_SORT_OPTIONS}
                triggerClassName="h-9 w-36 text-sm text-muted-foreground"
              />
              <ProductTableToolbarViewSwitch view={view} />
            </>
          }
        />
      }
    />
  );
}

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
        onBulkSetDraft={onBulkSetDraft}
        onBulkSetActive={onBulkSetActive}
        onBulkSetInactive={onBulkSetInactive}
        onBulkSetFeatured={onBulkSetFeatured}
        onBulkUnsetFeatured={onBulkUnsetFeatured}
        onBulkArchive={onBulkArchive}
        onBulkRestore={onBulkRestore}
        {...(onOpenPermanentDeleteDialog ? { onOpenPermanentDeleteDialog } : {})}
      />
    </AdminDataTableFloatingBar>
  );
}
