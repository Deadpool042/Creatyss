"use client";

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
import { cn } from "@/lib/utils";

import { useCategoriesTableContext } from "../../context/categories-data-provider";
import { categoryStatusConfig } from "./category-status-config";
import { CategoryTableRowActions } from "./category-table-row-actions";

export function CategoryTableDesktop() {
  const { categories } = useCategoriesTableContext();

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
          const status = categoryStatusConfig[category.status];

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
                <CategoryTableRowActions categoryId={category.id} categoryName={category.name} />
              </AdminTableCell>
            </AdminTableRow>
          );
        })}
      </AdminTableBody>
    </AdminTable>
  );
}
