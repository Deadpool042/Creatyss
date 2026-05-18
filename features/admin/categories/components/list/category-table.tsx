import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";
import { CategoryTableDesktop } from "./category-table-desktop";
import { CategoryTableMobile } from "./category-table-mobile";

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
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-0">
      <div className="min-h-0 flex-1">
        <CategoryTableDesktop categories={categories} />
      </div>
      <CategoryTableMobile categories={categories} />
    </div>
  );
}
