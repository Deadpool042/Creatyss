"use client";

import { Star } from "lucide-react";

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

import { AdminStatusBadge } from "@/components/admin/shared/admin-status-badge";

import { useCategoriesTableContext } from "../../context/categories-data-provider";
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
        {categories.map((category) => (
          <AdminTableRow key={category.id}>
            {/* Image */}
            <AdminTableCell className="px-3 py-2.5">
              <AdminThumbnail
                src={category.primaryImageUrl}
                alt={category.primaryImageAlt ?? category.name}
                className="h-10 w-10 rounded-lg border border-surface-border/40 bg-surface-subtle/50"
                imageClassName="transition-transform duration-300 group-hover:scale-105"
                fallbackLabel={`Aucun visuel pour ${category.name}`}
              />
            </AdminTableCell>

            {/* Catégorie */}
            <AdminTableCell>
              <div className="min-w-0">
                <p className="font-medium leading-snug text-foreground">{category.name}</p>
                <p className="mt-0.5 truncate text-[0.72rem] text-muted-foreground/70">
                  {category.slug}
                </p>
              </div>
            </AdminTableCell>

            {/* Mise en avant */}
            <AdminTableCell>
              {category.isFeatured ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <Star aria-hidden="true" className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>Oui</span>
                </span>
              ) : (
                <span className="text-xs text-muted-foreground/60">—</span>
              )}
            </AdminTableCell>

            {/* Statut */}
            <AdminTableCell>
              <AdminStatusBadge
                status={category.status}
                label={
                  {
                    active: "Active",
                    draft: "Brouillon",
                    inactive: "Inactive",
                    archived: "Archivée",
                  }[category.status]
                }
              />
            </AdminTableCell>

            {/* Description */}
            <AdminTableCell>
              {category.description ? (
                <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                  {category.description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground/40">—</p>
              )}
            </AdminTableCell>

            {/* Actions */}
            <AdminTableCell className="px-2 py-2 text-right">
              <CategoryTableRowActions categoryId={category.id} categoryName={category.name} />
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  );
}
