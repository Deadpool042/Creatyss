"use client";

import type { JSX } from "react";

import { AdminToolbar } from "@/components/admin/shared/admin-toolbar";
import {
  AdminDataTableActiveFilters,
  AdminDataTableFeedbackBanner,
  AdminDataTableFilterControlsRow,
  AdminDataTableResultsCount,
  AdminDataTableToolbarLayout,
} from "@/components/admin/tables";
import {
  AdminFilterPopovers,
  AdminSelectFilterControl,
  AdminSingleSelectFilterList,
  type AdminFilterPopoverItem,
} from "@/components/admin/tables/filters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PRODUCT_FEATURED_OPTIONS,
  PRODUCT_IMAGE_OPTIONS,
  PRODUCT_LIST_COPY,
  PRODUCT_RESULTS_COUNT_COPY,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_STOCK_OPTIONS,
  PRODUCT_VARIANT_OPTIONS,
} from "@/features/admin/products/config";
import type {
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
  ProductTableFiltersState,
} from "@/features/admin/products/list/types";
import { AdminProductsCategoryFilter } from "./admin-products-category-filter";
import { useProductTableContext } from "./product-table-context";
import { ProductTableToolbarViewSwitch } from "./toolbar";

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
      <AdminSelectFilterControl
        value={state.featured}
        onValueChange={(value) => state.setFeatured(value as ProductFilterFeaturedOption)}
        options={PRODUCT_FEATURED_OPTIONS}
        label={PRODUCT_LIST_COPY.filterAdvancedFeaturedLabel}
        triggerClassName="h-8 text-xs"
      />

      <AdminSelectFilterControl
        value={state.image}
        onValueChange={(value) => state.setImage(value as ProductFilterImageOption)}
        options={PRODUCT_IMAGE_OPTIONS}
        label={PRODUCT_LIST_COPY.filterAdvancedImagesLabel}
        triggerClassName="h-8 text-xs"
      />

      <AdminSelectFilterControl
        value={state.variant}
        onValueChange={(value) => state.setVariant(value as ProductFilterVariantOption)}
        options={PRODUCT_VARIANT_OPTIONS}
        label={PRODUCT_LIST_COPY.filterAdvancedVariantsLabel}
        triggerClassName="h-8 text-xs"
      />

      <AdminSelectFilterControl
        value={state.stock}
        onValueChange={(value) => state.setStock(value as ProductFilterStockOption)}
        options={PRODUCT_STOCK_OPTIONS}
        label={PRODUCT_LIST_COPY.filterAdvancedStockLabel}
        triggerClassName="h-8 text-xs"
      />
    </div>
  );
}

export function ProductTableToolbarDesktop(): JSX.Element {
  const { state, actions, view } = useProductTableContext();

  const bulkMessage = actions.bulkMessage;
  const bulkError = actions.bulkError;
  const hasActiveFilters = state.activeFilters.length > 0;

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

                    <AdminDataTableResultsCount
                      count={state.filteredCount}
                      fullLabel={PRODUCT_RESULTS_COUNT_COPY.results}
                      shortLabel={PRODUCT_RESULTS_COUNT_COPY.resultsShort}
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
