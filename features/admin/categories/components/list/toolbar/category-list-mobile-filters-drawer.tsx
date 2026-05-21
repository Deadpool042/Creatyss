"use client";

import { Button } from "@/components/ui/button";
import { AdminDataTableFiltersSheet } from "@/components/admin/tables";
import { AdminFilterSection } from "@/components/admin/tables/filters";
import { CATEGORY_LIST_ACTIONS_COPY, CATEGORY_LIST_COPY } from "@/features/admin/categories/config";
import type { AdminCategoryStatus } from "@/features/admin/categories/list/types/admin-category-card-item.types";
import type {
  CategoryFeaturedFilter,
  CategoryPickerItem,
} from "@/features/admin/categories/list/queries/list-admin-categories.query";
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
  onCategorySlugsChange,
  onStatusChange,
  onFeaturedChange,
  onReset,
}: CategoryListMobileFiltersDrawerProps) {
  return (
    <AdminDataTableFiltersSheet
      open={open}
      onOpenChange={onOpenChange}
      title={CATEGORY_LIST_COPY.filtersTitle}
      footer={
        <div className="flex flex-col gap-2">
          {hasActiveFilters ? (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                onReset();
                onOpenChange(false);
              }}
              className="w-full text-muted-foreground"
            >
              {CATEGORY_LIST_COPY.resetFiltersLabel}
            </Button>
          ) : null}
          <Button size="sm" type="button" onClick={() => onOpenChange(false)} className="w-full">
            {CATEGORY_LIST_ACTIONS_COPY.viewResultsLabel}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <AdminFilterSection title={CATEGORY_LIST_COPY.filterCategoriesLabel}>
          <CategoryHierarchyFilter
            categoriesForPicker={categoriesForPicker}
            categorySlugs={categorySlugs}
            onCategorySlugsChange={onCategorySlugsChange}
          />
        </AdminFilterSection>
        <AdminFilterSection title={CATEGORY_LIST_COPY.filterStatusLabel}>
          <CategoryStatusFilter status={status} onStatusChange={onStatusChange} />
        </AdminFilterSection>
        <AdminFilterSection title={CATEGORY_LIST_COPY.filterFeaturedLabel}>
          <CategoryFeaturedFilterControl featured={featured} onFeaturedChange={onFeaturedChange} />
        </AdminFilterSection>
      </div>
    </AdminDataTableFiltersSheet>
  );
}
