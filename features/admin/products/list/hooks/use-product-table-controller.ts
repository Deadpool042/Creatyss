"use client";

import type {
  ProductFilterCategoryOption,
  ProductTableItem,
} from "@/features/admin/products/list/types";
import { useProductTableFilters } from "./use-product-table-filters";
import {
  useProductTableMobileSelection,
  type ProductMobileVisibleSelectionState,
} from "./use-product-table-mobile-selection";
import { useProductTableActions } from "./use-product-table-actions";

type UseProductTableControllerInput = Readonly<{
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}>;

type UseProductTableControllerResult = Readonly<{
  state: ReturnType<typeof useProductTableFilters>;
  actions: ReturnType<typeof useProductTableActions>;
  mobileVisibleSelection: ProductMobileVisibleSelectionState | null;
  onMobileVisibleSelectionChange: (next: ProductMobileVisibleSelectionState) => void;
}>;

export function useProductTableController({
  products,
  categoryOptions,
  total,
  totalPages,
  currentPage,
  perPage,
}: UseProductTableControllerInput): UseProductTableControllerResult {
  const state = useProductTableFilters({
    products,
    categoryOptions,
    total,
    totalPages,
    currentPage,
    perPage,
  });

  const {
    currentPageProductIds,
    mobileVisibleProductIds,
    mobileVisibleSelection,
    onMobileVisibleSelectionChange,
  } = useProductTableMobileSelection({
    currentPageProducts: state.paginated,
    filteredProducts: state.allFilteredProducts,
  });

  const actions = useProductTableActions({
    currentPageProductIds,
    mobileVisibleProductIds,
  });

  return {
    state,
    actions,
    mobileVisibleSelection,
    onMobileVisibleSelectionChange,
  };
}
