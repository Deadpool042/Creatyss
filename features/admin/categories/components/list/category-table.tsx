"use client";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPaginationBar } from "@/components/admin/tables/admin-pagination-bar";
import { CustomLink } from "@/components/shared";
import { useCategoryFilters } from "@/features/admin/categories/list/hooks/use-category-filters";

import { useCategoriesTableContext } from "../../context/categories-data-provider";
import { CategoryListToolbar } from "./category-list-toolbar";
import { CategoryTableDesktop } from "./category-table-desktop";
import { CategoryTableMobile } from "./category-table-mobile";

export function CategoryTable() {
  const { categories, totalPages } = useCategoriesTableContext();
  const filters = useCategoryFilters();

  if (categories.length === 0) {
    return (
      <>
        <CategoryListToolbar />
        <AdminEmptyState
          description="Créez une première catégorie pour structurer le catalogue."
          eyebrow="Aucune catégorie"
          title="Le catalogue ne contient pas encore de catégorie"
          actionNode={
            <CustomLink href="/admin/categories/new" variant="navUnderline" className="text-brand">
              Créer une catégorie
            </CustomLink>
          }
        />
      </>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden flex-col gap-3 lg:flex">
        <CategoryListToolbar />
        <CategoryTableDesktop />
        <AdminPaginationBar
          currentPage={filters.page}
          totalPages={totalPages}
          perPage={filters.perPage}
          onPageChange={filters.setPage}
          onPerPageChange={(n) => {
            filters.applyFilters({ perPage: n, page: 1 });
          }}
        />
      </div>

      {/* Mobile — infinite scroll, no pagination */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
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

