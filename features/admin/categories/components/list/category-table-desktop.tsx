import { AdminThumbnail } from "@/components/admin/media/admin-thumbnail";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/tables/admin-table";
import { TableRow } from "@/components/ui/table";
import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";
import { cn } from "@/lib/utils";
import { CategoryTableRowActions } from "./category-table-row-actions";

type CategoryTableDesktopProps = Readonly<{
  categories: AdminCategoryCardItem[];
}>;

const statusConfig = {
  active: {
    label: "Active",
    className: "border-surface-border-strong bg-interactive-selected text-foreground",
  },
  draft: {
    label: "Brouillon",
    className: "border-surface-border bg-surface-panel-soft text-muted-foreground",
  },
  inactive: {
    label: "Inactive",
    className: "border-surface-border bg-surface-panel-soft text-muted-foreground",
  },
  archived: {
    label: "Archivée",
    className:
      "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground",
  },
} satisfies Record<AdminCategoryCardItem["status"], { label: string; className: string }>;

export function CategoryTableDesktop({ categories }: CategoryTableDesktopProps) {
  return (
    <AdminTable wrapperClassName="min-h-0 flex-1">
      <AdminTableHeader>
        <TableRow>
          <AdminTableHead className="w-16">Image</AdminTableHead>
          <AdminTableHead className="min-w-64">Catégorie</AdminTableHead>
          <AdminTableHead className="w-32">Mise en avant</AdminTableHead>
          <AdminTableHead className="w-32">Statut</AdminTableHead>
          <AdminTableHead className="min-w-72">Description</AdminTableHead>
          <AdminTableHead className="w-14" />
        </TableRow>
      </AdminTableHeader>

      <AdminTableBody>
        {categories.map((category) => {
          const status = statusConfig[category.status];

          return (
            <AdminTableRow key={category.id}>
              {/* Image */}
              <AdminTableCell className="px-3 py-2.5">
                <AdminThumbnail
                  src={category.primaryImageUrl}
                  alt={category.primaryImageAlt ?? category.name}
                  className="h-11 w-11 rounded-md border border-surface-border bg-surface-panel-soft"
                  fallbackLabel={`Aucun visuel pour ${category.name}`}
                />
              </AdminTableCell>

              {/* Catégorie */}
              <AdminTableCell>
                <div className="min-w-0">
                  <p className="font-medium leading-snug text-foreground">{category.name}</p>
                  <p className="mt-0.5 truncate text-[0.72rem] text-muted-foreground">
                    {category.slug}
                  </p>
                </div>
              </AdminTableCell>

              {/* Mise en avant */}
              <AdminTableCell>
                {category.isFeatured ? (
                  <span className="inline-flex h-6 items-center rounded-full border border-surface-border-strong bg-interactive-selected px-2.5 text-xs font-medium text-foreground">
                    Oui
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Non</span>
                )}
              </AdminTableCell>

              {/* Statut */}
              <AdminTableCell>
                <span
                  className={cn(
                    "inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium",
                    status.className
                  )}
                >
                  {status.label}
                </span>
              </AdminTableCell>

              {/* Description */}
              <AdminTableCell>
                {category.description ? (
                  <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                    {category.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/50">Aucune description</p>
                )}
              </AdminTableCell>

              {/* Actions */}
              <AdminTableCell className="px-2 py-2 text-right">
                <CategoryTableRowActions
                  categoryId={category.id}
                  categoryName={category.name}
                />
              </AdminTableCell>
            </AdminTableRow>
          );
        })}
      </AdminTableBody>
    </AdminTable>
  );
}
