"use client";

import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import type {
  ProductFilterCategoryOption,
  ProductListView,
  ProductStatusCounts,
  ProductTableItem,
} from "@/features/admin/products/list/types/product-table.types";
import { useProductTableController } from "./hooks/use-product-table-controller";
import type { ProductMobileVisibleSelectionState } from "./hooks/use-product-table-mobile-selection";

type ProductTableData = {
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
  view: ProductListView;
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  statusCounts: ProductStatusCounts;
};

type ProductTableController = ReturnType<typeof useProductTableController>;

type ProductTableContextValue = ProductTableData & {
  state: ProductTableController["state"];
  actions: ProductTableController["actions"];
  mobileVisibleSelection: ProductMobileVisibleSelectionState | null;
  onMobileVisibleSelectionChange: (next: ProductMobileVisibleSelectionState) => void;
};

type ProductTableProviderProps = PropsWithChildren<{
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
  view: ProductListView;
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  statusCounts: ProductStatusCounts;
}>;

const ProductTableContext = createContext<ProductTableContextValue | null>(null);

export function ProductTableProvider({
  products,
  categoryOptions,
  view,
  total,
  totalPages,
  currentPage,
  perPage,
  statusCounts,
  children,
}: ProductTableProviderProps): ReactNode {
  const {
    state,
    actions,
    mobileVisibleSelection,
    onMobileVisibleSelectionChange,
  } = useProductTableController({
    products,
    categoryOptions,
    total,
    totalPages,
    currentPage,
    perPage,
  });

  const value = useMemo<ProductTableContextValue>(
    () => ({
      products,
      categoryOptions,
      view,
      total,
      totalPages,
      currentPage,
      perPage,
      statusCounts,
      state,
      actions,
      mobileVisibleSelection,
      onMobileVisibleSelectionChange,
    }),
    [
      actions,
      categoryOptions,
      currentPage,
      mobileVisibleSelection,
      onMobileVisibleSelectionChange,
      perPage,
      products,
      state,
      statusCounts,
      total,
      totalPages,
      view,
    ]
  );

  return (
    <ProductTableContext.Provider value={value}>{children}</ProductTableContext.Provider>
  );
}

export function useProductTableContext(): ProductTableContextValue {
  const context = useContext(ProductTableContext);

  if (context === null) {
    throw new Error("useProductTableContext must be used within ProductTableProvider.");
  }

  return context;
}
