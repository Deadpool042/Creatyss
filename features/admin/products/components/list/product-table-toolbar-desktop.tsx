"use client";

import type { JSX } from "react";

import { AdminToolbar } from "@/components/admin/shared/admin-toolbar";
import {
  AdminDataTableActiveFilters,
  AdminDataTableFeedbackBanner,
  AdminDataTableFilterControlsRow,
  AdminDataTableSelectionSummary,
  AdminDataTableToolbarLayout,
} from "@/components/admin/tables";
import {
  AdminFilterField,
  AdminFilterPopovers,
  AdminSingleSelectFilterList,
  type AdminFilterPopoverItem,
} from "@/components/admin/tables/filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PRODUCT_FEATURED_OPTIONS,
  PRODUCT_IMAGE_OPTIONS,
  PRODUCT_LIST_COPY,
  PRODUCT_SELECTION_COPY,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_STOCK_OPTIONS,
  PRODUCT_VARIANT_OPTIONS,
} from "@/features/admin/products/config";
import type { ProductTableFiltersState } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type {
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
} from "@/features/admin/products/list/types/product-table.types";
import { AdminProductsCategoryFilter } from "./admin-products-category-filter";
import { useProductTableContext } from "./product-table-context";
import {
  ProductTableToolbarBulkActions,
  ProductTableToolbarResultsCount,
  ProductTableToolbarViewSwitch,
} from "./toolbar";

type ProductTableToolbarDesktopProps = {
  onOpenPermanentDeleteDialog: () => void;
};

function StatusFilterList({ state }: { state: ProductTableFiltersState }) {
  return (
    <AdminSingleSelectFilterList
      options={PRODUCT_STATUS_OPTIONS}
      selected={state.status}
      onChange={state.setStatus}
    />
  );
}

function AdvancedFiltersContent({ state }: { state: ProductTableFiltersState }) {
  return (
    <div className="flex flex-col gap-3">
      <AdminFilterField label={PRODUCT_LIST_COPY.filterAdvancedFeaturedLabel}>
        <Select
          value={state.featured}
          onValueChange={(v) => state.setFeatured(v as ProductFilterFeaturedOption)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_FEATURED_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </AdminFilterField>

      <AdminFilterField label={PRODUCT_LIST_COPY.filterAdvancedImagesLabel}>
        <Select
          value={state.image}
          onValueChange={(v) => state.setImage(v as ProductFilterImageOption)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_IMAGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </AdminFilterField>

      <AdminFilterField label={PRODUCT_LIST_COPY.filterAdvancedVariantsLabel}>
        <Select
          value={state.variant}
          onValueChange={(v) => state.setVariant(v as ProductFilterVariantOption)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_VARIANT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </AdminFilterField>

      <AdminFilterField label={PRODUCT_LIST_COPY.filterAdvancedStockLabel}>
        <Select
          value={state.stock}
          onValueChange={(v) => state.setStock(v as ProductFilterStockOption)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_STOCK_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </AdminFilterField>
    </div>
  );
}

export function ProductTableToolbarDesktop({
  onOpenPermanentDeleteDialog,
}: ProductTableToolbarDesktopProps): JSX.Element {
  const { state, actions, view } = useProductTableContext();

  const selectedCount = actions.selectedCount;
  const bulkMessage = actions.bulkMessage;
  const bulkError = actions.bulkError;
  const isBulkPending = actions.isBulkPending;
  const hasActiveFilters = state.activeFilters.length > 0;
  const hasSelection = selectedCount > 0;

  const statusCount = state.status !== "all" ? 1 : 0;
  const categoryCount = state.categoryId !== "all" ? 1 : 0;
  const advancedCount = [
    state.featured !== "all",
    state.image !== "all",
    state.variant !== "all",
    state.stock !== "all",
  ].filter(Boolean).length;

  const filterPopoverItems: AdminFilterPopoverItem[] = [
    {
      key: "status",
      label: PRODUCT_LIST_COPY.filterStatutLabel,
      count: statusCount,
      content: <StatusFilterList state={state} />,
    },
    {
      key: "category",
      label: PRODUCT_LIST_COPY.filterCategoryLabel,
      count: categoryCount,
      contentClassName: "w-72 p-3",
      content: (
        <AdminProductsCategoryFilter
          categories={state.categoryOptions}
          selectedParentCategoryId={state.parentCategoryId}
          selectedCategoryId={state.categoryId}
          onParentCategoryChange={state.setParentCategoryId}
          onCategoryChange={state.setCategoryId}
          triggerClassName="h-8 text-xs"
        />
      ),
    },
    {
      key: "advanced",
      label: PRODUCT_LIST_COPY.filterAdvancedLabel,
      count: advancedCount,
      content: <AdvancedFiltersContent state={state} />,
    },
  ];

  return (
    <AdminDataTableToolbarLayout
      selection={
        hasSelection ? (
          <div className="rounded-xl border border-surface-border-strong bg-interactive-selected px-3 py-3 shadow-card">
            <AdminDataTableSelectionSummary
              label={PRODUCT_SELECTION_COPY.selectedDesktop(selectedCount)}
              clearLabel={PRODUCT_SELECTION_COPY.clearSelectionDesktop}
              onClear={actions.clearSelection}
              className="flex flex-wrap items-center justify-between gap-3"
              clearButtonClassName="h-8 rounded-full px-3 text-xs"
            />

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
                {...(view === "trash" ? { onOpenPermanentDeleteDialog } : {})}
              />
            </div>
          </div>
        ) : null
      }
      feedback={
        <>
          <AdminDataTableFeedbackBanner message={bulkMessage} />
          <AdminDataTableFeedbackBanner message={bulkError} tone="error" />
        </>
      }
      toolbar={
        <div className="border-b border-surface-border/40 pb-3">
          <AdminToolbar
            search={state.search}
            onSearchChange={state.handleSearchChange}
            placeholder={PRODUCT_LIST_COPY.searchPlaceholder}
            className="mt-0"
            extraControls={
              <AdminDataTableFilterControlsRow
                filters={
                  <AdminFilterPopovers
                    items={filterPopoverItems}
                    className="flex items-center gap-2"
                  />
                }
                trailing={
                  <>
                    <Select
                      value={state.sort}
                      onValueChange={(v) => state.setSort(v as ProductSortOption)}
                    >
                      <SelectTrigger className="h-9 w-36 text-sm text-muted-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_SORT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <ProductTableToolbarViewSwitch view={view} />

                    <ProductTableToolbarResultsCount
                      filteredCount={state.filteredCount}
                      className="whitespace-nowrap"
                    />
                  </>
                }
              />
            }
          />
        </div>
      }
      activeFilters={
        hasActiveFilters ? (
          <AdminDataTableActiveFilters items={state.activeFilters} onClearAll={state.reset} />
        ) : null
      }
    />
  );
}
