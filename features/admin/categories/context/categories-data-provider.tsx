"use client";

import { createContext, useContext, useMemo, type PropsWithChildren, type ReactNode } from "react";

import type { AdminCategoryCardItem } from "@/features/admin/categories/types";
import type {
  CategoryPickerItem,
  CategoryStatusCounts,
} from "@/features/admin/categories/queries";

type CategoriesTableContextValue = {
  categories: AdminCategoryCardItem[];
  categoriesForPicker: CategoryPickerItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  statusCounts: CategoryStatusCounts;
};

type CategoriesTableProviderProps = PropsWithChildren<{
  categories: AdminCategoryCardItem[];
  categoriesForPicker: CategoryPickerItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  statusCounts: CategoryStatusCounts;
}>;

const CategoriesTableContext = createContext<CategoriesTableContextValue | null>(null);

export function CategoriesTableProvider({
  categories,
  categoriesForPicker,
  total,
  totalPages,
  currentPage,
  perPage,
  statusCounts,
  children,
}: CategoriesTableProviderProps): ReactNode {
  const value = useMemo<CategoriesTableContextValue>(
    () => ({
      categories,
      categoriesForPicker,
      total,
      totalPages,
      currentPage,
      perPage,
      statusCounts,
    }),
    [categories, categoriesForPicker, total, totalPages, currentPage, perPage, statusCounts]
  );

  return (
    <CategoriesTableContext.Provider value={value}>{children}</CategoriesTableContext.Provider>
  );
}

export function useCategoriesTableContext(): CategoriesTableContextValue {
  const context = useContext(CategoriesTableContext);

  if (context === null) {
    throw new Error("useCategoriesTableContext must be used within CategoriesTableProvider.");
  }

  return context;
}
