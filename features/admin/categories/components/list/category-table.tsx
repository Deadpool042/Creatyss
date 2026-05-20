import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";
import { CategoryTableDesktop } from "./category-table-desktop";
import { CategoryTableMobile } from "./category-table-mobile";
import { CustomLink } from "@/components/shared";
import { FilterIcon } from "lucide-react";
import { AdminToolbar } from "@/components/admin";

type CategoryTableProps = Readonly<{
  categories: AdminCategoryCardItem[];
}>;

export function CategoryTable({ categories }: CategoryTableProps) {
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
      <div className="space-y-2">
        <AdminToolbar />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-0">
        <div className="hidden min-h-0 flex-1 overflow-hidden lg:flex lg:flex-col">
          <CategoryTableDesktop categories={categories} />
        </div>
        <CategoryTableMobile categories={categories} />
      </div>
    </div>
  );
}
