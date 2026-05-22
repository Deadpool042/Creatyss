"use client";

import {
  AdminDataTableFiltersDrawer,
  type AdminDataTableActiveFilterItem,
} from "@/components/admin/tables";
import { AdminFilterBlocks, type AdminFilterBlock } from "@/components/admin/tables/filters";
import { CATEGORY_LIST_ACTIONS_COPY, CATEGORY_LIST_COPY } from "@/features/admin/categories/config";
import type { AdminCategoryStatus } from "@/features/admin/categories/types";
import type {
  CategoryFeaturedFilter,
  CategoryPickerItem,
} from "@/features/admin/categories/list";
import {
  CategoryFeaturedFilterControl,
  CategoryHierarchyFilter,
  CategoryStatusFilter,
} from "./category-list-filter-controls";

type CategoryListMobileFiltersDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoriesForPicker: CategoryPickerItem[];
  categorySlugs: string[];
  status: AdminCategoryStatus[];
  featured: CategoryFeaturedFilter[];
  hasActiveFilters: boolean;
  activeFilterItems: AdminDataTableActiveFilterItem[];
  onCategorySlugsChange: (next: string[]) => void;
  onStatusChange: (next: AdminCategoryStatus[]) => void;
  onFeaturedChange: (next: CategoryFeaturedFilter[]) => void;
  onReset: () => void;
};

export function CategoryListMobileFiltersDrawer({
  open,
  onOpenChange,
  categoriesForPicker,
  categorySlugs,
  status,
  featured,
  hasActiveFilters,
  activeFilterItems,
  onCategorySlugsChange,
  onStatusChange,
  onFeaturedChange,
  onReset,
}: CategoryListMobileFiltersDrawerProps) {
  const filterBlocks: AdminFilterBlock[] = [
    {
      key: "categories",
      kind: "section",
      title: CATEGORY_LIST_COPY.filterCategoriesLabel,
      content: (
        <CategoryHierarchyFilter
          categoriesForPicker={categoriesForPicker}
          categorySlugs={categorySlugs}
          onCategorySlugsChange={onCategorySlugsChange}
        />
      ),
    },
    {
      key: "status",
      kind: "section",
      title: CATEGORY_LIST_COPY.filterStatusLabel,
      content: <CategoryStatusFilter status={status} onStatusChange={onStatusChange} />,
    },
    {
      key: "featured",
      kind: "section",
      title: CATEGORY_LIST_COPY.filterFeaturedLabel,
      content: (
        <CategoryFeaturedFilterControl featured={featured} onFeaturedChange={onFeaturedChange} />
      ),
    },
  ];

  return (
    <AdminDataTableFiltersDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={CATEGORY_LIST_COPY.filtersTitle}
      resetLabel={CATEGORY_LIST_COPY.resetFiltersLabel}
      applyLabel={CATEGORY_LIST_ACTIONS_COPY.viewResultsLabel}
      resetDisabled={!hasActiveFilters}
      stackedFooter
      onReset={() => {
        onReset();
        onOpenChange(false);
      }}
      onApply={() => onOpenChange(false)}
      activeFiltersTitle={CATEGORY_LIST_COPY.mobileFiltersActiveSection}
      activeFilterItems={activeFilterItems}
      clearActiveFiltersLabel={CATEGORY_LIST_COPY.activeFiltersResetLabel}
      onClearActiveFilters={onReset}
      contentClassName="flex flex-col gap-5"
    >
      <AdminFilterBlocks blocks={filterBlocks} className="flex flex-col gap-5" />
    </AdminDataTableFiltersDrawer>
  );
}
