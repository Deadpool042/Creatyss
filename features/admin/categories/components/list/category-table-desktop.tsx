"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Star } from "lucide-react";

import { AdminThumbnail } from "@/components/admin/media/admin-thumbnail";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/tables";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AdminStatusBadge } from "@/components/admin/shared/admin-status-badge";
import {
  CATEGORY_LIST_COPY,
  CATEGORY_STATUS_LABELS,
  CATEGORY_TABLE_COPY,
} from "@/features/admin/categories/config";
import { useCategoryFilters, type CategorySortOption } from "@/features/admin/categories/list";
import { getAdminCategoryDetailPath } from "../../shared";

import { useCategoriesTableContext } from "../../context/categories-data-provider";
import { CategoryTableRowActions } from "./category-table-row-actions";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function CountCell({ value }: { value: number }) {
  return (
    <span className={cn("inline-block min-w-4 text-right tabular-nums", value === 0 ? "text-muted-foreground/35" : "text-foreground/90")}>
      {value === 0 ? "—" : value}
    </span>
  );
}

// ---------------------------------------------------------------------------
// SortableHead — en-tête cliquable avec indicateur de tri
// ---------------------------------------------------------------------------

type SortableHeadProps = {
  children: React.ReactNode;
  className?: string;
  asc: CategorySortOption;
  desc: CategorySortOption;
  currentSort: CategorySortOption;
  onSort: (sort: CategorySortOption) => void;
};

function SortableHead({ children, className, asc, desc, currentSort, onSort }: SortableHeadProps) {
  const isAsc = currentSort === asc;
  const isDesc = currentSort === desc;
  const isActive = isAsc || isDesc;

  const ariaSort: "ascending" | "descending" | undefined = isAsc
    ? "ascending"
    : isDesc
      ? "descending"
      : undefined;

  function handleClick() {
    if (isAsc) onSort(desc);
    else onSort(asc);
  }

  return (
    <AdminTableHead className={cn("p-0", className)} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1 px-4 py-3 text-left",
          "transition-colors hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {children}
        {isAsc ? (
          <ArrowUp className="h-3 w-3 shrink-0" />
        ) : isDesc ? (
          <ArrowDown className="h-3 w-3 shrink-0" />
        ) : (
          <ArrowUpDown className="h-3 w-3 shrink-0 opacity-30" />
        )}
      </button>
    </AdminTableHead>
  );
}

// ---------------------------------------------------------------------------
// CategoryTableDesktop
// ---------------------------------------------------------------------------

type CategoryTableDesktopProps = {
  selectedIds: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
};

export function CategoryTableDesktop({
  selectedIds,
  onToggleOne,
  onToggleAll,
}: CategoryTableDesktopProps) {
  const { categories } = useCategoriesTableContext();
  const router = useRouter();
  const filters = useCategoryFilters();

  const allSelected = categories.length > 0 && categories.every((c) => selectedIds.has(c.id));
  const someSelected = categories.some((c) => selectedIds.has(c.id));

  return (
    <AdminTable
      aria-label={CATEGORY_LIST_COPY.tableAriaLabel}
      role="grid"
      viewportClassName="overflow-auto overscroll-contain"
    >
      <AdminTableHeader className="backdrop-blur-xl">
        <TableRow className="border-b border-surface-border/50 bg-surface-panel-soft backdrop-blur-xl">
          <AdminTableHead className="h-9 w-10 px-3">
            <Checkbox
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              onCheckedChange={onToggleAll}
              aria-label={CATEGORY_LIST_COPY.selectAllAriaLabel}
            />
          </AdminTableHead>
          <AdminTableHead className="h-9 w-12 px-3">{CATEGORY_TABLE_COPY.columns.image}</AdminTableHead>
          <SortableHead
            className="min-w-48"
            asc="name-asc"
            desc="name-desc"
            currentSort={filters.sort}
            onSort={filters.setSort}
          >
            {CATEGORY_TABLE_COPY.columns.category}
          </SortableHead>
          <AdminTableHead className="h-9 w-24 px-4">{CATEGORY_TABLE_COPY.columns.status}</AdminTableHead>
          <AdminTableHead
            className="h-9 w-10 px-4 text-center"
            aria-label={CATEGORY_TABLE_COPY.columns.featuredAria}
          >
            <Star className="mx-auto h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          </AdminTableHead>
          <AdminTableHead className="h-9 w-20 px-4 text-right">
            {CATEGORY_TABLE_COPY.columns.products}
          </AdminTableHead>
          <AdminTableHead className="h-9 w-24 px-4 text-right">
            {CATEGORY_TABLE_COPY.columns.children}
          </AdminTableHead>
          <AdminTableHead className="h-9 w-16 px-4 text-right">
            {CATEGORY_TABLE_COPY.columns.sortOrder}
          </AdminTableHead>
          <SortableHead
            className="w-28"
            asc="updated-asc"
            desc="updated-desc"
            currentSort={filters.sort}
            onSort={filters.setSort}
          >
            {CATEGORY_TABLE_COPY.columns.createdAt}
          </SortableHead>
        </TableRow>
      </AdminTableHeader>

      <AdminTableBody>
        {categories.map((category) => {
          const isSelected = selectedIds.has(category.id);
          const href = getAdminCategoryDetailPath(category.slug);
          return (
            <AdminTableRow
              key={category.id}
              tabIndex={0}
              className={cn(
                "group cursor-pointer border-b border-surface-border/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/50 hover:bg-surface-subtle/40",
                isSelected ? "bg-interactive-selected/40" : ""
              )}
              onClick={() => router.push(href)}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(href);
                if (e.key === " ") {
                  e.preventDefault();
                  onToggleOne(category.id);
                }
              }}
            >
              {/* Checkbox */}
              <AdminTableCell className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleOne(category.id)}
                  aria-label={`${CATEGORY_LIST_COPY.rowSelectAriaPrefix} ${category.name}`}
                />
              </AdminTableCell>

              {/* Image */}
              <AdminTableCell className="px-3 py-2.5">
                <AdminThumbnail
                  src={category.primaryImageUrl}
                  alt={category.primaryImageAlt ?? category.name}
                  className="h-9 w-9 rounded-md border border-surface-border/40 bg-surface-subtle/50"
                  imageClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                  fallbackLabel={category.name}
                />
              </AdminTableCell>

              {/* Catégorie */}
              <AdminTableCell className="py-2.5">
                <div className="min-w-0">
                  {category.parentName ? (
                    <p className="mb-0.5 truncate text-[0.65rem] font-medium text-brand/75">
                      {category.parentName} <span className="text-muted-foreground/40">›</span>
                    </p>
                  ) : null}
                  <span className="block truncate text-[0.95rem] font-medium leading-snug text-foreground">
                    {category.name}
                  </span>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground/70">
                    {category.slug}
                  </p>
                </div>
              </AdminTableCell>

              {/* Statut */}
              <AdminTableCell className="py-2.5">
                <AdminStatusBadge
                  status={category.status}
                  label={CATEGORY_STATUS_LABELS[category.status] ?? category.status}
                />
              </AdminTableCell>

              {/* Mise en avant */}
              <AdminTableCell className="py-2.5 text-center">
                {category.isFeatured ? (
                  <Star className="mx-auto h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ) : (
                  <Star className="mx-auto h-3.5 w-3.5 text-muted-foreground/25" />
                )}
              </AdminTableCell>

              {/* Produits */}
              <AdminTableCell className="py-2.5 text-right text-sm">
                <CountCell value={category.productCount} />
              </AdminTableCell>

              {/* Sous-catégories */}
              <AdminTableCell className="py-2.5 text-right text-sm">
                <CountCell value={category.childrenCount} />
              </AdminTableCell>

              {/* Ordre */}
              <AdminTableCell className="py-2.5 text-right text-sm">
                <CountCell value={category.sortOrder} />
              </AdminTableCell>

              {/* Créée le — contient aussi les actions flottantes */}
              <AdminTableCell
                className="relative overflow-visible py-2.5 text-sm text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="transition-opacity group-hover:opacity-0 group-focus-within:opacity-0">
                  {formatDate(category.createdAt)}
                </span>
                {/* Actions flottantes positionnées dans cette cellule */}
                <div
                  className={cn(
                    "absolute inset-y-0 right-2 flex items-center gap-1",
                    "opacity-0 transition-opacity",
                    "group-hover:opacity-100 group-focus-within:opacity-100"
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    asChild
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`${CATEGORY_LIST_COPY.rowEditAriaPrefix} ${category.name}`}
                  >
                    <Link href={href}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <CategoryTableRowActions
                    categoryId={category.id}
                    categoryName={category.name}
                    categorySlug={category.slug}
                    status={category.status}
                  />
                </div>
              </AdminTableCell>
            </AdminTableRow>
          );
        })}
      </AdminTableBody>
    </AdminTable>
  );
}
