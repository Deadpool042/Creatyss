"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Star } from "lucide-react";

import {
  ADMIN_TABLE_HEAD_CLASSNAME,
  AdminRowActionsReveal,
  AdminSortableTableHead,
  AdminTableIdentityStack,
  createAdminCountColumn,
  createAdminSelectionColumn,
  createAdminStatusColumn,
  createAdminThumbnailColumn,
} from "@/components/admin/tables";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_LIST_COPY,
  CATEGORY_SORTABLE_COLUMNS,
  CATEGORY_STATUS_LABELS,
  CATEGORY_TABLE_COPY,
} from "@/features/admin/categories/config";
import type { AdminCategoryCardItem, CategorySortOption } from "@/features/admin/categories/list";
import { cn } from "@/lib/utils";

import { getAdminCategoryDetailPath } from "../../../shared";
import { CategoryTableRowActions } from "../actions/category-table-row-actions";

const categoryDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(date: Date | string): string {
  return categoryDateFormatter.format(new Date(date));
}

type CategoryTableDesktopColumnsInput = Readonly<{
  allSelected: boolean;
  someSelected: boolean;
  selectedIds: Set<string>;
  sort: CategorySortOption;
  onSort: (sort: CategorySortOption) => void;
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
}>;

export function createCategoryTableDesktopColumns({
  allSelected,
  someSelected,
  selectedIds,
  sort,
  onSort,
  onToggleOne,
  onToggleAll,
}: CategoryTableDesktopColumnsInput): ColumnDef<AdminCategoryCardItem>[] {
  return [
    createAdminSelectionColumn<AdminCategoryCardItem>({
      headerChecked: allSelected ? true : someSelected ? "indeterminate" : false,
      rowChecked: (category) => selectedIds.has(category.id),
      onToggleAll,
      onToggleRow: (category) => onToggleOne(category.id),
      headerAriaLabel: CATEGORY_LIST_COPY.selectAllAriaLabel,
      rowAriaLabel: (category) => `${CATEGORY_LIST_COPY.rowSelectAriaPrefix} ${category.name}`,
      headerClassName: cn(ADMIN_TABLE_HEAD_CLASSNAME, "w-10 px-3"),
      cellClassName: "px-3 py-2.5",
    }),
    createAdminThumbnailColumn<AdminCategoryCardItem>({
      src: (category) => category.primaryImageUrl,
      alt: (category) => category.primaryImageAlt ?? category.name,
      fallbackLabel: (category) => category.name,
      header: CATEGORY_TABLE_COPY.columns.image,
      headerClassName: cn(ADMIN_TABLE_HEAD_CLASSNAME, "w-12 px-3"),
      cellClassName: "px-3 py-2.5",
      imageClassName: "object-cover transition-transform duration-300 group-hover:scale-105",
    }),
    {
      id: "category",
      header: () => (
        <AdminSortableTableHead
          column={CATEGORY_SORTABLE_COLUMNS.category}
          currentSort={sort}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => (
        <AdminTableIdentityStack
          eyebrow={
            row.original.parentName ? (
              <>
                {row.original.parentName} <span className="text-muted-foreground/40">›</span>
              </>
            ) : null
          }
          title={row.original.name}
          titleClassName="leading-snug"
          caption={
            <p className="mt-0.5 hidden truncate text-[11px] text-muted-foreground/70 xl:block">
              {row.original.slug}
            </p>
          }
        />
      ),
      meta: {
        cellClassName: "py-2.5",
      },
    },
    createAdminStatusColumn<AdminCategoryCardItem>({
      header: CATEGORY_TABLE_COPY.columns.status,
      status: (category) => category.status,
      label: (category) => CATEGORY_STATUS_LABELS[category.status] ?? category.status,
      headerClassName: cn(ADMIN_TABLE_HEAD_CLASSNAME, "w-24"),
      cellClassName: "py-2.5",
    }),
    {
      id: "featured",
      header: () => (
        <Star className="mx-auto h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      ),
      cell: ({ row }) =>
        row.original.isFeatured ? (
          <Star className="mx-auto h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
        ) : (
          <Star className="mx-auto h-3.5 w-3.5 text-muted-foreground/25" aria-hidden="true" />
        ),
      meta: {
        headerClassName: cn(ADMIN_TABLE_HEAD_CLASSNAME, "hidden w-10 text-center xl:table-cell"),
        cellClassName: "hidden py-2.5 text-center xl:table-cell",
      },
    },
    createAdminCountColumn<AdminCategoryCardItem>({
      id: "products",
      header: CATEGORY_TABLE_COPY.columns.products,
      value: (category) => category.productCount,
      headerClassName: cn(ADMIN_TABLE_HEAD_CLASSNAME, "hidden w-20 text-right xl:table-cell"),
      cellClassName: "hidden py-2.5 text-right text-sm xl:table-cell",
    }),
    createAdminCountColumn<AdminCategoryCardItem>({
      id: "children",
      header: CATEGORY_TABLE_COPY.columns.children,
      value: (category) => category.childrenCount,
      headerClassName: cn(ADMIN_TABLE_HEAD_CLASSNAME, "hidden w-24 text-right xl:table-cell"),
      cellClassName: "hidden py-2.5 text-right text-sm xl:table-cell",
    }),
    createAdminCountColumn<AdminCategoryCardItem>({
      id: "sortOrder",
      header: CATEGORY_TABLE_COPY.columns.sortOrder,
      value: (category) => category.sortOrder,
      headerClassName: cn(ADMIN_TABLE_HEAD_CLASSNAME, "hidden w-16 text-right xl:table-cell"),
      cellClassName: "hidden py-2.5 text-right text-sm xl:table-cell",
    }),
    {
      id: "updatedAt",
      header: () => (
        <AdminSortableTableHead
          column={CATEGORY_SORTABLE_COLUMNS.updatedAt}
          currentSort={sort}
          onSort={onSort}
          className="hidden xl:table-cell"
        />
      ),
      cell: ({ row }) => {
        const href = getAdminCategoryDetailPath(row.original.slug);

        return (
          <>
            <span className="transition-opacity group-hover:opacity-0 group-focus-within:opacity-0">
              {formatDate(row.original.createdAt)}
            </span>

            <AdminRowActionsReveal className="absolute inset-y-0 right-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
                aria-label={`${CATEGORY_LIST_COPY.rowEditAriaPrefix} ${row.original.name}`}
              >
                <Link href={href}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>

              <CategoryTableRowActions
                categoryId={row.original.id}
                categoryName={row.original.name}
                categorySlug={row.original.slug}
                status={row.original.status}
              />
            </AdminRowActionsReveal>
          </>
        );
      },
      meta: {
        cellClassName:
          "hidden relative overflow-visible py-2.5 text-sm text-muted-foreground xl:table-cell",
        stopRowClick: true,
      },
    },
  ];
}
