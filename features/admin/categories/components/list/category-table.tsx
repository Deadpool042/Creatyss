"use client";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { CustomLink } from "@/components/shared";

import { useCategoriesTableContext } from "../../context/categories-data-provider";
import { CategoryListToolbar } from "./category-list-toolbar";
import { CategoryTableDesktop } from "./category-table-desktop";
import { CategoryTableMobile } from "./category-table-mobile";

export function CategoryTable() {
  const { categories } = useCategoriesTableContext();

  if (categories.length === 0) {
    return (
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
    );
  }

  return (
    <div className="hidden min-h-0 flex-1 flex-col gap-3 lg:flex">
      <CategoryListToolbar />

      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-0">
        <div className="hidden min-h-0 flex-1 overflow-hidden lg:flex lg:flex-col">
          <CategoryTableDesktop />
        </div>
        <CategoryTableMobile />
      </div>
    </div>
  );
}
