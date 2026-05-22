//features/admin/products/components/list/admin-products-category-filter.tsx
"use client";

import { useMemo, type JSX } from "react";

import { AdminHierarchicalSelectFilter } from "@/components/admin/tables/filters";
import { PRODUCT_LIST_COPY } from "@/features/admin/products/config";
import { buildAdminProductsCategorySelectOptions } from "@/features/admin/products/list/utils";
import type { ProductFilterCategoryOption } from "@/features/admin/products/list/types";

type AdminProductsCategoryFilterProps = {
  categories: ProductFilterCategoryOption[];
  selectedParentCategoryId: string;
  selectedCategoryId: string;
  onParentCategoryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
};

export function AdminProductsCategoryFilter({
  categories,
  selectedParentCategoryId,
  selectedCategoryId,
  onParentCategoryChange,
  onCategoryChange,
  className,
  triggerClassName,
}: AdminProductsCategoryFilterProps): JSX.Element {
  const { parentCategories, childCategories } = useMemo(
    () =>
      buildAdminProductsCategorySelectOptions({
        categories,
        selectedParentCategoryId,
      }),
    [categories, selectedParentCategoryId]
  );

  return (
    <AdminHierarchicalSelectFilter
      parentOptions={parentCategories.map((category) => ({
        value: category.id,
        label: category.name,
      }))}
      childOptions={childCategories.map((category) => ({
        value: category.id,
        label: category.name,
      }))}
      selectedParentValue={selectedParentCategoryId}
      selectedChildValue={selectedCategoryId}
      parentAllLabel={PRODUCT_LIST_COPY.filterCategoryAllLabel}
      childAllLabel={PRODUCT_LIST_COPY.filterSubcategoryAllLabel}
      onParentChange={(value) => {
        onParentCategoryChange(value);
        onCategoryChange("all");
      }}
      onChildChange={onCategoryChange}
      {...(className ? { className } : {})}
      {...(triggerClassName ? { triggerClassName } : {})}
    />
  );
}
