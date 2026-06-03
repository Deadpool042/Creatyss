"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

import {
  AdminRowActionsReveal,
} from "@/components/admin/tables/actions/admin-row-actions-reveal";
import { AdminTableIdentityStack } from "@/components/admin/tables/layout/admin-table-identity-stack";
import { AdminSortableTableHead } from "@/components/admin/tables/head/admin-sortable-table-head";
import { createAdminSelectionColumn } from "@/components/admin/tables/columns/admin-selection-column";
import { createAdminStatusColumn } from "@/components/admin/tables/columns/admin-status-column";
import { createAdminThumbnailColumn } from "@/components/admin/tables/columns/admin-thumbnail-column";
import { ADMIN_TABLE_HEAD_CLASSNAME } from "@/components/admin/tables/styles/admin-table-head.styles";
import {
  PRODUCT_CARD_COPY,
  PRODUCT_SELECTION_COPY,
  PRODUCT_SORTABLE_COLUMNS,
  PRODUCT_TABLE_COPY,
} from "@/features/admin/products/config";
import type { ProductListView, ProductSortOption, ProductTableItem } from "@/features/admin/products/list/types";

import { AdminProductsCategoryCell } from "../admin-products-category-cell";
import { AdminProductsPriceCell } from "../admin-products-price-cell";
import { ProductStockBadge } from "../product-stock-badge";
import { ProductTableRowActions } from "./product-table-row-actions";

type ProductTableDesktopColumnsInput = Readonly<{
  selectedProductIds: string[];
  areAllCurrentPageSelected: boolean;
  view: ProductListView;
  sort: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
  onToggleProductSelection: (productId: string) => void;
  onToggleSelectAllCurrentPage: () => void;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
}>;

export function createProductTableDesktopColumns({
  selectedProductIds,
  areAllCurrentPageSelected,
  view,
  sort,
  onSortChange,
  onToggleProductSelection,
  onToggleSelectAllCurrentPage,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: ProductTableDesktopColumnsInput): ColumnDef<ProductTableItem>[] {
  return [
    createAdminSelectionColumn<ProductTableItem>({
      headerChecked: areAllCurrentPageSelected,
      rowChecked: (product) => selectedProductIds.includes(product.id),
      onToggleAll: onToggleSelectAllCurrentPage,
      onToggleRow: (product) => onToggleProductSelection(product.id),
      headerAriaLabel: PRODUCT_SELECTION_COPY.selectPageAriaLabel,
      rowAriaLabel: (product) => PRODUCT_CARD_COPY.selectionAriaLabel(product.name),
      headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} w-12`,
      cellClassName: "px-3 py-2.5 align-middle",
      centered: true,
    }),
    createAdminThumbnailColumn<ProductTableItem>({
      src: (product) => product.primaryImageUrl,
      alt: (product) => product.primaryImageAlt ?? product.name,
      fallbackLabel: (product) => PRODUCT_CARD_COPY.imageFallbackLabel(product.name),
      headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} w-16`,
      cellClassName: "px-3 py-2.5 align-middle",
      stopRowClick: true,
    }),
    {
      id: "product",
      header: () => (
        <AdminSortableTableHead
          column={PRODUCT_SORTABLE_COLUMNS.product}
          currentSort={sort}
          onSort={onSortChange}
        />
      ),
      cell: ({ row }) => (
        <AdminTableIdentityStack
          title={row.original.name}
          titleClassName="line-clamp-1 leading-snug"
          caption={
            <div className="mt-1 hidden min-w-0 items-center gap-1.5 text-xs text-muted-foreground/60 lg:flex xl:hidden">
              <span className="line-clamp-1 tabular-nums font-medium text-foreground/85">
                {row.original.priceLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="line-clamp-1">{row.original.categoryPathLabel}</span>
            </div>
          }
        />
      ),
      meta: {
        headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} min-w-52`,
        cellClassName: "px-4 py-2.5 align-middle",
      },
    },
    {
      id: "featured",
      header: "",
      cell: ({ row }) =>
        row.original.isFeatured ? (
          <Star
            className="size-3.5 fill-feedback-warning-foreground text-feedback-warning-foreground"
            aria-label={PRODUCT_TABLE_COPY.columns.isFeatured}
          />
        ) : null,
      meta: {
        headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} w-8`,
        cellClassName: "px-2 py-2.5 align-middle text-center",
      },
    },
    createAdminStatusColumn<ProductTableItem>({
      header: PRODUCT_TABLE_COPY.columns.status,
      status: (product) => product.status,
      headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} w-28`,
      cellClassName: "px-4 py-2.5 align-middle",
    }),
    {
      id: "stock",
      header: PRODUCT_TABLE_COPY.columns.stock,
      cell: ({ row }) => (
        <ProductStockBadge
          state={row.original.stockState}
          quantity={row.original.stockQuantity}
          compact
        />
      ),
      meta: {
        headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} w-28`,
        cellClassName: "px-4 py-2.5 align-middle",
      },
    },
    {
      id: "price",
      header: PRODUCT_TABLE_COPY.columns.price,
      cell: ({ row }) => (
        <AdminProductsPriceCell
          priceLabel={row.original.priceLabel}
          compareAtPriceLabel={row.original.compareAtPriceLabel}
          hasPromotion={row.original.hasPromotion}
        />
      ),
      meta: {
        headerClassName: `hidden xl:table-cell ${ADMIN_TABLE_HEAD_CLASSNAME} w-36 `,
        cellClassName: "hidden xl:table-cell px-4 py-2.5 align-middle",
      },
    },
    {
      id: "updatedAt",
      header: () => (
        <AdminSortableTableHead
          column={PRODUCT_SORTABLE_COLUMNS.updatedAt}
          currentSort={sort}
          onSort={onSortChange}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);
        const formatted = new Intl.DateTimeFormat("fr-FR", {
          day: "numeric",
          month: "short",
        }).format(date);
        return <span className="text-[13px] text-muted-foreground">{formatted}</span>;
      },
      meta: {
        headerClassName: `hidden xl:table-cell ${ADMIN_TABLE_HEAD_CLASSNAME} w-24`,
        cellClassName: "hidden xl:table-cell px-3 py-3 align-middle",
      },
    },
    {
      id: "category",
      header: PRODUCT_TABLE_COPY.columns.category,
      cell: ({ row }) => (
        <div className="min-w-0">
          <AdminProductsCategoryCell label={row.original.categoryPathLabel} />
        </div>
      ),
      meta: {
        headerClassName: `hidden xl:table-cell ${ADMIN_TABLE_HEAD_CLASSNAME} w-44`,
        cellClassName: "hidden xl:table-cell px-4 py-2.5 align-middle",
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <AdminRowActionsReveal className="flex items-center justify-end">
          <ProductTableRowActions
            slug={row.original.slug}
            productName={row.original.name}
            view={view}
            {...(onConfirmArchive ? { onConfirmArchive } : {})}
            {...(onConfirmRestore ? { onConfirmRestore } : {})}
            {...(onConfirmPermanentDelete ? { onConfirmPermanentDelete } : {})}
          />
        </AdminRowActionsReveal>
      ),
      meta: {
        headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} w-12`,
        cellClassName: "px-2 py-2.5 align-middle text-right",
        stopRowClick: true,
      },
    },
  ];
}
