"use client";

import { AdminConfigDataTable } from "@/components/admin/tables/admin-config-data-table";
import { CATEGORY_LIST_COPY } from "@/features/admin/categories/config";
import { useCategoryFilters } from "@/features/admin/categories/list";
import { cn } from "@/lib/utils";

import { useCategoriesTableContext } from "../../../context/categories-data-provider";
import { getAdminCategoryDetailPath } from "../../../shared";
import { createCategoryTableDesktopColumns } from "./category-table-desktop.config";

type CategoryTableDesktopProps = Readonly<{
  selectedIds: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
}>;

export function CategoryTableDesktop({
  selectedIds,
  onToggleOne,
  onToggleAll,
}: CategoryTableDesktopProps) {
  const { categories } = useCategoriesTableContext();
  const filters = useCategoryFilters();

  const allSelected =
    categories.length > 0 && categories.every((category) => selectedIds.has(category.id));
  const someSelected = categories.some((category) => selectedIds.has(category.id));

  const columns = createCategoryTableDesktopColumns({
    allSelected,
    someSelected,
    selectedIds,
    sort: filters.sort,
    onSort: filters.setSort,
    onToggleOne,
    onToggleAll,
  });

  return (
    <AdminConfigDataTable
      data={categories}
      columns={columns}
      ariaLabel={CATEGORY_LIST_COPY.tableAriaLabel}
      getRowId={(category) => category.id}
      wrapperClassName="h-full"
      viewportClassName="overflow-auto overscroll-contain"
      headerClassName="backdrop-blur-xl"
      headerRowClassName="bg-surface-panel-soft backdrop-blur-xl"
      rowClassName={(row) =>
        cn(
          "group",
          selectedIds.has(row.original.id) ? "bg-interactive-selected/40" : undefined
        )
      }
      getRowHref={(category) => getAdminCategoryDetailPath(category.slug)}
      onToggleRowSelection={(category) => onToggleOne(category.id)}
    />
  );
}
