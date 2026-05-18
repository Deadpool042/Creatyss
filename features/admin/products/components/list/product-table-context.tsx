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
  ProductTableItem,
} from "@/features/admin/products/list/types/product-table.types";
import { useProductTableActions } from "./hooks/use-product-table-actions";
import type { ProductListView } from "./toolbar/product-table-toolbar-types";

type MobileVisibleSelectionState = {
  visibleCount: number;
  visibleSelectedCount: number;
  areAllVisibleSelected: boolean;
};

type ProductTableState = ReturnType<typeof useProductTableFilters>;
type ProductTableActions = ReturnType<typeof useProductTableActions>;

type ProductTableContextValue = {
  state: ProductTableState;
  actions: ProductTableActions;
  view: ProductListView;
  mobileVisibleSelection: MobileVisibleSelectionState | null;
  onMobileVisibleSelectionChange: (next: MobileVisibleSelectionState) => void;
};

type ProductTableProviderProps = PropsWithChildren<{
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
  view: ProductListView;
}>;

const ProductTableContext = createContext<ProductTableContextValue | null>(null);

export function ProductTableProvider({
  products,
  categoryOptions,
  view,
  children,
}: ProductTableProviderProps): ReactNode {
  const state = useProductTableFilters({ products, categoryOptions });
  const [mobileVisibleSelection, setMobileVisibleSelection] =
    useState<MobileVisibleSelectionState | null>(null);

  const currentPageProductIds = useMemo(() => {
    return state.paginated.map((product) => product.id);
  }, [state.paginated]);

  const mobileVisibleProductIds = useMemo(() => {
    const visibleCount = mobileVisibleSelection?.visibleCount ?? 0;

    return state.allFilteredProducts.slice(0, visibleCount).map((product) => product.id);
  }, [mobileVisibleSelection?.visibleCount, state.allFilteredProducts]);

  const actions = useProductTableActions({
    currentPageProductIds,
    mobileVisibleProductIds,
  });

  const value = useMemo<ProductTableContextValue>(() => {
    return {
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
    };
  }, [actions, mobileVisibleSelection, state, view]);

  return <ProductTableContext.Provider value={value}>{children}</ProductTableContext.Provider>;
}

export function useProductTableContext(): ProductTableContextValue {
  const context = useContext(ProductTableContext);

  if (context === null) {
    throw new Error("useProductTableContext must be used within ProductTableProvider.");
  }

  return context;
}
