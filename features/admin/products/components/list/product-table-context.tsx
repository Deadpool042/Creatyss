"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import { useProductTableFilters } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type {
  ProductFilterCategoryOption,
  ProductStatusCounts,
  ProductTableItem,
} from "@/features/admin/products/list/types/product-table.types";
import { useProductTableActions } from "./hooks/use-product-table-actions";
import type { ProductListView } from "./toolbar/product-table-toolbar-types";

// ---------------------------------------------------------------------------
// ProductTableDataContext — données serveur injectées depuis la page (data bridge)
// Aligné sur CategoriesTableProvider : aucun hook, pure transmission de données.
// ---------------------------------------------------------------------------

type ProductTableDataContextValue = {
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
  view: ProductListView;
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  statusCounts: ProductStatusCounts;
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

const ProductTableDataContext = createContext<ProductTableDataContextValue | null>(null);

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
  const value = useMemo<ProductTableDataContextValue>(
    () => ({
      products,
      categoryOptions,
      view,
      total,
      totalPages,
      currentPage,
      perPage,
      statusCounts,
    }),
    [products, categoryOptions, view, total, totalPages, currentPage, perPage, statusCounts]
  );

  return (
    <ProductTableDataContext.Provider value={value}>{children}</ProductTableDataContext.Provider>
  );
}

export function useProductTableData(): ProductTableDataContextValue {
  const context = useContext(ProductTableDataContext);

  if (context === null) {
    throw new Error("useProductTableData must be used within ProductTableProvider.");
  }

  return context;
}

// ---------------------------------------------------------------------------
// ProductTableStateContext — état client dérivé des hooks (interne à ProductTable)
// Reçoit les données du DataContext, calcule l'état de filtrage, sélection, etc.
// ---------------------------------------------------------------------------

type MobileVisibleSelectionState = {
  visibleCount: number;
  visibleSelectedCount: number;
  areAllVisibleSelected: boolean;
};

type ProductTableState = ReturnType<typeof useProductTableFilters>;
type ProductTableActions = ReturnType<typeof useProductTableActions>;

type ProductTableStateContextValue = {
  state: ProductTableState;
  actions: ProductTableActions;
  view: ProductListView;
  mobileVisibleSelection: MobileVisibleSelectionState | null;
  onMobileVisibleSelectionChange: (next: MobileVisibleSelectionState) => void;
};

const ProductTableStateContext = createContext<ProductTableStateContextValue | null>(null);

export function ProductTableStateProvider({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  const { products, categoryOptions, view, total, totalPages, currentPage, perPage } = useProductTableData();

  const state = useProductTableFilters({
    products,
    categoryOptions,
    total,
    totalPages,
    currentPage,
    perPage,
  });
  const [mobileVisibleSelection, setMobileVisibleSelection] =
    useState<MobileVisibleSelectionState | null>(null);

  const currentPageProductIds = useMemo(
    () => state.paginated.map((product) => product.id),
    [state.paginated]
  );

  const mobileVisibleProductIds = useMemo(() => {
    const visibleCount = mobileVisibleSelection?.visibleCount ?? 0;
    return state.allFilteredProducts.slice(0, visibleCount).map((product) => product.id);
  }, [mobileVisibleSelection?.visibleCount, state.allFilteredProducts]);

  const actions = useProductTableActions({ currentPageProductIds, mobileVisibleProductIds });

  const value = useMemo<ProductTableStateContextValue>(
    () => ({
      state,
      actions,
      view,
      mobileVisibleSelection,
      onMobileVisibleSelectionChange: (next) => {
        setMobileVisibleSelection((current) => {
          if (
            current !== null &&
            current.visibleCount === next.visibleCount &&
            current.visibleSelectedCount === next.visibleSelectedCount &&
            current.areAllVisibleSelected === next.areAllVisibleSelected
          ) {
            return current;
          }
          return next;
        });
      },
    }),
    [actions, mobileVisibleSelection, state, view]
  );

  return (
    <ProductTableStateContext.Provider value={value}>{children}</ProductTableStateContext.Provider>
  );
}

export function useProductTableContext(): ProductTableStateContextValue {
  const context = useContext(ProductTableStateContext);

  if (context === null) {
    throw new Error("useProductTableContext must be used within ProductTableStateProvider.");
  }

  return context;
}
