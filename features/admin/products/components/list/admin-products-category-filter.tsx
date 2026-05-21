//features/admin/products/components/list/admin-products-category-filter.tsx
"use client";

import { useMemo, type JSX } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductFilterCategoryOption } from "@/features/admin/products/list/types/product-table.types";
import { cn } from "@/lib/utils";
import { PRODUCT_LIST_COPY } from "@/features/admin/products/config";

type AdminProductsCategoryFilterProps = {
  categories: ProductFilterCategoryOption[];
  selectedParentCategoryId: string;
  selectedCategoryId: string;
  onParentCategoryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
};

function sortCategories(
  left: ProductFilterCategoryOption,
  right: ProductFilterCategoryOption
): number {
  return left.name.localeCompare(right.name, "fr");
}

export function AdminProductsCategoryFilter({
  categories,
  selectedParentCategoryId,
  selectedCategoryId,
  onParentCategoryChange,
  onCategoryChange,
  className,
  triggerClassName,
}: AdminProductsCategoryFilterProps): JSX.Element {
  const parentCategories = useMemo(() => {
    return categories.filter((category) => category.parentId === null).sort(sortCategories);
  }, [categories]);

  const childCategories = useMemo(() => {
    if (!selectedParentCategoryId || selectedParentCategoryId === "all") {
      return [];
    }

    return categories
      .filter((category) => category.parentId === selectedParentCategoryId)
      .sort(sortCategories);
  }, [categories, selectedParentCategoryId]);

  const hasChildCategories = childCategories.length > 0;

  return (
    <div className={cn("grid gap-3 xl:grid-cols-2", className)}>
      <Select
        value={selectedParentCategoryId}
        onValueChange={(value) => {
          onParentCategoryChange(value);
          onCategoryChange("all");
        }}
      >
        <SelectTrigger className={cn("w-full text-sm", triggerClassName)}>
          <SelectValue placeholder={PRODUCT_LIST_COPY.filterCategoryAllLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{PRODUCT_LIST_COPY.filterCategoryAllLabel}</SelectItem>
          {parentCategories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasChildCategories ? (
        <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
          <SelectTrigger className={cn("w-full text-sm", triggerClassName)}>
            <SelectValue placeholder={PRODUCT_LIST_COPY.filterSubcategoryAllLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{PRODUCT_LIST_COPY.filterSubcategoryAllLabel}</SelectItem>
            {childCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="hidden xl:block" />
      )}
    </div>
  );
}
