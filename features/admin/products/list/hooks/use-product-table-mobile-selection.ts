"use client";

import { useMemo, useState } from "react";

import type { ProductTableItem } from "@/features/admin/products/list/types";

export type ProductMobileVisibleSelectionState = {
  visibleCount: number;
  visibleSelectedCount: number;
  areAllVisibleSelected: boolean;
};

type UseProductTableMobileSelectionInput = {
  currentPageProducts: ProductTableItem[];
  filteredProducts: ProductTableItem[];
};

type UseProductTableMobileSelectionResult = {
  currentPageProductIds: string[];
  mobileVisibleProductIds: string[];
  mobileVisibleSelection: ProductMobileVisibleSelectionState | null;
  onMobileVisibleSelectionChange: (next: ProductMobileVisibleSelectionState) => void;
};

export function useProductTableMobileSelection({
  currentPageProducts,
  filteredProducts,
}: UseProductTableMobileSelectionInput): UseProductTableMobileSelectionResult {
  const [mobileVisibleSelection, setMobileVisibleSelection] =
    useState<ProductMobileVisibleSelectionState | null>(null);

  const currentPageProductIds = useMemo(
    () => currentPageProducts.map((product) => product.id),
    [currentPageProducts]
  );

  const mobileVisibleProductIds = useMemo(() => {
    const visibleCount = mobileVisibleSelection?.visibleCount ?? 0;
    return filteredProducts.slice(0, visibleCount).map((product) => product.id);
  }, [filteredProducts, mobileVisibleSelection?.visibleCount]);

  function onMobileVisibleSelectionChange(next: ProductMobileVisibleSelectionState): void {
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
  }

  return {
    currentPageProductIds,
    mobileVisibleProductIds,
    mobileVisibleSelection,
    onMobileVisibleSelectionChange,
  };
}
