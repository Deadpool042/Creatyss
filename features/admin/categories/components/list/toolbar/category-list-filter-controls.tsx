"use client";

import {
  AdminCheckboxFilterList,
  AdminFilterPopovers,
  AdminHierarchicalCheckboxFilter,
  type AdminFilterPopoverItem,
  type AdminHierarchicalCheckboxFilterItem,
} from "@/components/admin/tables/filters";
import {
  CATEGORY_FEATURED_OPTIONS,
  CATEGORY_LIST_COPY,
  CATEGORY_STATUS_OPTIONS,
} from "@/features/admin/categories/config";
import type { AdminCategoryStatus } from "@/features/admin/categories/types";
import type {
  CategoryFeaturedFilter,
  CategoryPickerItem,
} from "@/features/admin/categories/list";

function mapCategoryPickerItems(items: CategoryPickerItem[]): AdminHierarchicalCheckboxFilterItem[] {
  return items.map((item) => ({
    id: item.id,
    label: item.name,
    parentId: item.parentId,
    value: item.slug,
  }));
}

type CategoryListFilterControlsProps = {
  categoriesForPicker: CategoryPickerItem[];
  status: AdminCategoryStatus[];
  featured: CategoryFeaturedFilter[];
  categorySlugs: string[];
  onStatusChange: (next: AdminCategoryStatus[]) => void;
  onFeaturedChange: (next: CategoryFeaturedFilter[]) => void;
  onCategorySlugsChange: (next: string[]) => void;
};

export function CategoryListFilterControls({
  categoriesForPicker,
  status,
  featured,
  categorySlugs,
  onStatusChange,
  onFeaturedChange,
  onCategorySlugsChange,
}: CategoryListFilterControlsProps) {
  const items: AdminFilterPopoverItem[] = [
    {
      key: "categories",
      label: CATEGORY_LIST_COPY.filterCategoriesLabel,
      count: categorySlugs.length,
      content: (
        <AdminHierarchicalCheckboxFilter
          items={mapCategoryPickerItems(categoriesForPicker)}
          selected={categorySlugs}
          emptyLabel={CATEGORY_LIST_COPY.filterCategoriesEmptyLabel}
          onChange={onCategorySlugsChange}
        />
      ),
    },
    {
      key: "status",
      label: CATEGORY_LIST_COPY.filterStatusLabel,
      count: status.length,
      content: (
        <AdminCheckboxFilterList
          options={CATEGORY_STATUS_OPTIONS}
          selected={status}
          onChange={onStatusChange}
        />
      ),
    },
    {
      key: "featured",
      label: CATEGORY_LIST_COPY.filterFeaturedLabel,
      count: featured.length,
      content: (
        <AdminCheckboxFilterList
          options={CATEGORY_FEATURED_OPTIONS}
          selected={featured}
          onChange={onFeaturedChange}
        />
      ),
    },
  ];

  return (
    <AdminFilterPopovers items={items} className="hidden lg:flex lg:items-center lg:gap-2" />
  );
}

export function CategoryHierarchyFilter({
  categoriesForPicker,
  categorySlugs,
  onCategorySlugsChange,
}: {
  categoriesForPicker: CategoryPickerItem[];
  categorySlugs: string[];
  onCategorySlugsChange: (next: string[]) => void;
}) {
  return (
    <AdminHierarchicalCheckboxFilter
      items={mapCategoryPickerItems(categoriesForPicker)}
      selected={categorySlugs}
      emptyLabel={CATEGORY_LIST_COPY.filterCategoriesEmptyLabel}
      onChange={onCategorySlugsChange}
    />
  );
}

export function CategoryStatusFilter({
  status,
  onStatusChange,
}: {
  status: AdminCategoryStatus[];
  onStatusChange: (next: AdminCategoryStatus[]) => void;
}) {
  return (
    <AdminCheckboxFilterList
      options={CATEGORY_STATUS_OPTIONS}
      selected={status}
      onChange={onStatusChange}
    />
  );
}

export function CategoryFeaturedFilterControl({
  featured,
  onFeaturedChange,
}: {
  featured: CategoryFeaturedFilter[];
  onFeaturedChange: (next: CategoryFeaturedFilter[]) => void;
}) {
  return (
    <AdminCheckboxFilterList
      options={CATEGORY_FEATURED_OPTIONS}
      selected={featured}
      onChange={onFeaturedChange}
    />
  );
}
