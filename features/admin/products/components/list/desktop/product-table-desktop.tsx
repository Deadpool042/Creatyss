"use client";

import type { JSX } from "react";

import { AdminConfigDataTable } from "@/components/admin/tables";
import type { ProductListView, ProductTableItem } from "@/features/admin/products/list/types";

import { createProductTableDesktopColumns } from "./product-table-desktop.config";

type ProductTableDesktopProps = Readonly<{
  products: ProductTableItem[];
  selectedProductIds: string[];
  areAllCurrentPageSelected: boolean;
  onToggleProductSelection: (productId: string) => void;
  onToggleSelectAllCurrentPage: () => void;
  view: ProductListView;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
}>;

export function ProductTableDesktop({
  products,
  selectedProductIds,
  areAllCurrentPageSelected,
  onToggleProductSelection,
  onToggleSelectAllCurrentPage,
  view,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: ProductTableDesktopProps): JSX.Element {
  const columns = createProductTableDesktopColumns({
    selectedProductIds,
    areAllCurrentPageSelected,
    view,
    onToggleProductSelection,
    onToggleSelectAllCurrentPage,
    ...(onConfirmArchive ? { onConfirmArchive } : {}),
    ...(onConfirmRestore ? { onConfirmRestore } : {}),
    ...(onConfirmPermanentDelete ? { onConfirmPermanentDelete } : {}),
  });

  return (
    <AdminConfigDataTable
      data={products}
      columns={columns}
      getRowId={(product) => product.id}
      wrapperClassName="hidden lg:flex"
      headerClassName="backdrop-blur-xl"
      bodyClassName="[&_tr:last-child]:border-0"
      getRowHref={(product) => `/admin/products/${product.slug}/edit`}
      onToggleRowSelection={(product) => onToggleProductSelection(product.id)}
    />
  );
}
