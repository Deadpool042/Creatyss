"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Star } from "lucide-react";

import { AdminThumbnail } from "@/components/admin/media/admin-thumbnail";
import { AdminStatusBadge } from "@/components/admin/shared/admin-status-badge";
import {
  ADMIN_TABLE_HEAD_CLASSNAME,
  AdminSortableTableHead,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  AdminRowActionsReveal,
  AdminTableIdentityStack,
} from "@/components/admin/tables";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRow } from "@/components/ui/table";
import {
  CATEGORY_LIST_COPY,
  CATEGORY_SORTABLE_COLUMNS,
  CATEGORY_STATUS_LABELS,
  CATEGORY_TABLE_COPY,
} from "@/features/admin/categories/config";
import { useCategoryFilters } from "@/features/admin/categories/list";
import { cn } from "@/lib/utils";

import { useCategoriesTableContext } from "../../context/categories-data-provider";
import { getAdminCategoryDetailPath } from "../../shared";
import { CategoryTableRowActions } from "./category-table-row-actions";

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function CountCell({ value }: { value: number }) {
  return (
    <span
      className={cn(
        "inline-block min-w-4 text-right tabular-nums",
        value === 0 ? "text-muted-foreground/35" : "text-foreground/90"
      )}
    >
      {value === 0 ? "—" : value}
    </span>
  );
}

type CategoryTableDesktopProps = Readonly<{
  selectedIds: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
}>;

export function CategoryTableDesktop({
  selectedIds,
  onToggleOne,
  onToggleAll,
}: CategoryTableDesktopProps) {
  const { categories } = useCategoriesTableContext();
  const router = useRouter();
  const filters = useCategoryFilters();

  const allSelected =
    categories.length > 0 && categories.every((category) => selectedIds.has(category.id));
  const someSelected = categories.some((category) => selectedIds.has(category.id));

  return (
    <AdminTable
      aria-label={CATEGORY_LIST_COPY.tableAriaLabel}
      role="grid"
      viewportClassName="overflow-auto overscroll-contain"
    >
      <AdminTableHeader className="backdrop-blur-xl">
        <TableRow className="border-b border-surface-border/50 bg-surface-panel-soft backdrop-blur-xl">
          <AdminTableHead className={cn(ADMIN_TABLE_HEAD_CLASSNAME, "w-10 px-3")}>
            <Checkbox
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              onCheckedChange={onToggleAll}
              aria-label={CATEGORY_LIST_COPY.selectAllAriaLabel}
            />
          </AdminTableHead>

          <AdminTableHead className={cn(ADMIN_TABLE_HEAD_CLASSNAME, "w-12 px-3")}>
            {CATEGORY_TABLE_COPY.columns.image}
          </AdminTableHead>

          <AdminSortableTableHead
            column={CATEGORY_SORTABLE_COLUMNS.category}
            currentSort={filters.sort}
            onSort={filters.setSort}
          />

          <AdminTableHead className={cn(ADMIN_TABLE_HEAD_CLASSNAME, "w-24")}>
            {CATEGORY_TABLE_COPY.columns.status}
          </AdminTableHead>

          <AdminTableHead
            className={cn(ADMIN_TABLE_HEAD_CLASSNAME, "w-10 text-center")}
            aria-label={CATEGORY_TABLE_COPY.columns.featuredAria}
          >
            <Star className="mx-auto h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </AdminTableHead>

          <AdminTableHead className={cn(ADMIN_TABLE_HEAD_CLASSNAME, "w-20 text-right")}>
            {CATEGORY_TABLE_COPY.columns.products}
          </AdminTableHead>

          <AdminTableHead className={cn(ADMIN_TABLE_HEAD_CLASSNAME, "w-24 text-right")}>
            {CATEGORY_TABLE_COPY.columns.children}
          </AdminTableHead>

          <AdminTableHead className={cn(ADMIN_TABLE_HEAD_CLASSNAME, "w-16 text-right")}>
            {CATEGORY_TABLE_COPY.columns.sortOrder}
          </AdminTableHead>

          <AdminSortableTableHead
            column={CATEGORY_SORTABLE_COLUMNS.updatedAt}
            currentSort={filters.sort}
            onSort={filters.setSort}
          />
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
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  router.push(href);
                  return;
                }

                if (event.key === " ") {
                  event.preventDefault();
                  onToggleOne(category.id);
                }
              }}
            >
              <AdminTableCell className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleOne(category.id)}
                  aria-label={`${CATEGORY_LIST_COPY.rowSelectAriaPrefix} ${category.name}`}
                />
              </AdminTableCell>

              <AdminTableCell className="px-3 py-2.5">
                <AdminThumbnail
                  src={category.primaryImageUrl}
                  alt={category.primaryImageAlt ?? category.name}
                  className="h-9 w-9 rounded-md border border-surface-border/40 bg-surface-subtle/50"
                  imageClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                  fallbackLabel={category.name}
                />
              </AdminTableCell>

              <AdminTableCell className="py-2.5">
                <AdminTableIdentityStack
                  eyebrow={
                    category.parentName ? (
                      <>
                        {category.parentName}{" "}
                        <span className="text-muted-foreground/40">›</span>
                      </>
                    ) : null
                  }
                  title={category.name}
                  titleClassName="leading-snug"
                  caption={
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground/70">
                      {category.slug}
                    </p>
                  }
                />
              </AdminTableCell>

              <AdminTableCell className="py-2.5">
                <AdminStatusBadge
                  status={category.status}
                  label={CATEGORY_STATUS_LABELS[category.status] ?? category.status}
                />
              </AdminTableCell>

              <AdminTableCell className="py-2.5 text-center">
                {category.isFeatured ? (
                  <Star
                    className="mx-auto h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ) : (
                  <Star
                    className="mx-auto h-3.5 w-3.5 text-muted-foreground/25"
                    aria-hidden="true"
                  />
                )}
              </AdminTableCell>

              <AdminTableCell className="py-2.5 text-right text-sm">
                <CountCell value={category.productCount} />
              </AdminTableCell>

              <AdminTableCell className="py-2.5 text-right text-sm">
                <CountCell value={category.childrenCount} />
              </AdminTableCell>

              <AdminTableCell className="py-2.5 text-right text-sm">
                <CountCell value={category.sortOrder} />
              </AdminTableCell>

              <AdminTableCell
                className="relative overflow-visible py-2.5 text-sm text-muted-foreground"
                onClick={(event) => event.stopPropagation()}
              >
                <span className="transition-opacity group-hover:opacity-0 group-focus-within:opacity-0">
                  {formatDate(category.createdAt)}
                </span>

                <AdminRowActionsReveal
                  className={cn("absolute inset-y-0 right-2 flex items-center gap-1")}
                >
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    asChild
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`${CATEGORY_LIST_COPY.rowEditAriaPrefix} ${category.name}`}
                  >
                    <Link href={href}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>

                  <CategoryTableRowActions
                    categoryId={category.id}
                    categoryName={category.name}
                    categorySlug={category.slug}
                    status={category.status}
                  />
                </AdminRowActionsReveal>
              </AdminTableCell>
            </AdminTableRow>
          );
        })}
      </AdminTableBody>
    </AdminTable>
  );
}
