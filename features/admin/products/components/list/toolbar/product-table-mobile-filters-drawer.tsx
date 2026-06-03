"use client";

import type { JSX } from "react";

import {
  type AdminDataTableActiveFilterItem,
} from "@/components/admin/tables/filters/panel/admin-data-table-active-filters";
import {
  AdminFilterBlocks,
  type AdminFilterBlock,
} from "@/components/admin/tables/filters/admin-filter-blocks";
import { AdminDataTableFiltersDrawer } from "@/components/admin/tables/filters/panel/admin-data-table-filters-drawer";
import {
  PRODUCT_LIST_ACTIONS_COPY,
  PRODUCT_LIST_COPY,
} from "@/features/admin/products/config";
import type {
  ProductFilterCategoryOption,
  ProductTableFiltersState,
} from "@/features/admin/products/list/types";
import {
  ProductAdvancedFiltersControl,
  ProductCategoryFilterControl,
  ProductStatusFilterControl,
} from "./product-table-filter-controls";

const MOBILE_SELECT_TRIGGER_CLASS_NAME =
  "h-10 rounded-xl bg-card text-sm [@media(max-height:480px)]:h-9";

type ProductTableMobileFiltersDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryOptions: ProductFilterCategoryOption[];
  state: ProductTableFiltersState;
  hasActiveFilters: boolean;
  activeFilterItems: AdminDataTableActiveFilterItem[];
};

export function ProductTableMobileFiltersDrawer({
  open,
  onOpenChange,
  categoryOptions,
  state,
  hasActiveFilters,
  activeFilterItems,
}: ProductTableMobileFiltersDrawerProps): JSX.Element {
  const advancedCount = [
    state.featured.length > 0,
    state.image !== "all",
    state.variant !== "all",
    state.stock !== "all",
  ].filter(Boolean).length;

  const blocks: AdminFilterBlock[] = [
    {
      key: "status",
      kind: "section",
      title: PRODUCT_LIST_COPY.filterStatutLabel,
      content: <ProductStatusFilterControl status={state.status} onStatusChange={state.setStatus} />,
    },
    {
      key: "categories",
      kind: "section",
      title: PRODUCT_LIST_COPY.filterCategoryLabel,
      content: (
        <ProductCategoryFilterControl
          categoryOptions={categoryOptions}
          categorySlugs={state.categorySlugs}
          onCategorySlugsChange={state.setCategorySlugs}
        />
      ),
    },
    {
      key: "advanced",
      kind: "collapsible",
      title: PRODUCT_LIST_COPY.filterAdvancedLabel,
      description: PRODUCT_LIST_COPY.filterAdvancedDescription,
      summary:
        advancedCount > 0
          ? PRODUCT_LIST_COPY.filterAdvancedActiveSummary(advancedCount)
          : PRODUCT_LIST_COPY.filterAdvancedSummary,
      content: (
        <ProductAdvancedFiltersControl
          featured={state.featured}
          image={state.image}
          variant={state.variant}
          stock={state.stock}
          onFeaturedChange={state.setFeatured}
          onImageChange={state.setImage}
          onVariantChange={state.setVariant}
          onStockChange={state.setStock}
          triggerClassName={MOBILE_SELECT_TRIGGER_CLASS_NAME}
        />
      ),
    },
  ];

  return (
    <AdminDataTableFiltersDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={PRODUCT_LIST_COPY.filtersTitle}
      description={
        hasActiveFilters
          ? PRODUCT_LIST_COPY.mobileFiltersDescription(activeFilterItems.length)
          : PRODUCT_LIST_COPY.mobileFiltersDescriptionEmpty
      }
      resetLabel={PRODUCT_LIST_COPY.mobileFiltersReset}
      applyLabel={PRODUCT_LIST_ACTIONS_COPY.viewResultsLabel}
      resetDisabled={!hasActiveFilters}
      stackedFooter
      onReset={() => {
        state.reset();
        onOpenChange(false);
      }}
      onApply={() => onOpenChange(false)}
      activeFiltersTitle={PRODUCT_LIST_COPY.mobileFiltersActiveSection}
      activeFilterItems={activeFilterItems}
      clearActiveFiltersLabel={PRODUCT_LIST_COPY.activeFiltersResetLabel}
      onClearActiveFilters={state.reset}
      contentClassName="flex flex-col gap-5"
    >
      <AdminFilterBlocks blocks={blocks} className="flex flex-col gap-5" />
    </AdminDataTableFiltersDrawer>
  );
}
