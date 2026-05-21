"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { AdminPaginationBar } from "@/components/admin/tables";
import {
  CATEGORY_LIST_FEEDBACK_COPY,
} from "@/features/admin/categories/config";
import { useCategoryFilters } from "@/features/admin/categories/list/hooks/use-category-filters";
import { bulkArchiveCategoriesAction } from "@/features/admin/categories/actions";

import { useCategoriesTableContext } from "../../context/categories-data-provider";
import { CategoryListToolbar } from "./category-list-toolbar";
import { CategoryTableDesktop } from "./category-table-desktop";
import { CategoryTableMobile } from "./category-table-mobile";
import { CategoryBulkBar, CategoryTableEmptyState } from "./table";

export function CategoryTable() {
  const { categories, totalPages, total } = useCategoriesTableContext();
  const filters = useCategoryFilters();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const isFiltered = !!(
    filters.search ||
    filters.status.length > 0 ||
    filters.featured.length > 0 ||
    filters.categorySlugs.length > 0
  );

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (categories.length > 0 && categories.every((c) => selectedIds.has(c.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map((c) => c.id)));
    }
  }

  function handleBulkArchive() {
    const ids = [...selectedIds];
    startTransition(async () => {
      const result = await bulkArchiveCategoriesAction(ids);
      if (result.success) {
        toast.success(
          result.count > 1
            ? `${result.count} ${CATEGORY_LIST_FEEDBACK_COPY.bulkArchiveSuccessPluralSuffix}`
            : CATEGORY_LIST_FEEDBACK_COPY.bulkArchiveSuccessSingular
        );
      } else {
        toast.error(CATEGORY_LIST_FEEDBACK_COPY.bulkArchiveErrorTitle, {
          description: CATEGORY_LIST_FEEDBACK_COPY.errorDescription,
        });
      }
      setSelectedIds(new Set());
    });
  }

  if (categories.length === 0) {
    return (
      <>
        <CategoryListToolbar />
        <CategoryTableEmptyState isFiltered={isFiltered} />
      </>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 overflow-y-auto [scrollbar-gutter:stable] p-1 lg:flex ">
        <CategoryListToolbar />
        <div className="overflow-x-auto">
          <CategoryTableDesktop
            selectedIds={selectedIds}
            onToggleOne={toggleOne}
            onToggleAll={toggleAll}
          />
        </div>
        <AdminPaginationBar
          currentPage={filters.page}
          totalPages={totalPages}
          perPage={filters.perPage}
          totalItems={total}
          onPageChange={filters.setPage}
          onPerPageChange={(n) => {
            filters.setPerPage(n);
            filters.setPage(1);
          }}
        />
        <CategoryBulkBar
          count={selectedIds.size}
          isPending={isPending}
          onClear={() => setSelectedIds(new Set())}
          onArchive={handleBulkArchive}
        />
      </div>

      {/* Mobile/tablet — infinite scroll, no pagination */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden p-1">
        <CategoryListToolbar />
        <div
          data-scroll-root="true"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
        >
          <CategoryTableMobile />
        </div>
      </div>
    </>
  );
}
