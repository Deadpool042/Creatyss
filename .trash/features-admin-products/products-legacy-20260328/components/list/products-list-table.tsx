"use client";

import type { SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { AdminProductSummary } from "@/features/admin/products/types/product-detail-types";
import { productColumns } from "./product-columns";

type ProductsListTableProps = {
  products: AdminProductSummary[];
};

// No initial client-side sort: keep the repository order (created_at desc)
// until a product-specific default sort is explicitly introduced.
const PRODUCT_INITIAL_SORTING: SortingState = [];

export function ProductsListTable({ products }: ProductsListTableProps) {
  return (
    <DataTable
      columns={productColumns}
      data={products}
      filterColumn="name"
      filterPlaceholder="Chercher un produit..."
      initialSorting={PRODUCT_INITIAL_SORTING}
    />
  );
}
