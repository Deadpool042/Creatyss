"use client";

import { createContext, useContext, useMemo, type PropsWithChildren, type ReactNode } from "react";

import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";

import { useCategoriesTableActions } from "./hooks/use-categories-table-actions";

type CategoriesTableActions = ReturnType<typeof useCategoriesTableActions>;

type CategoriesTableContextValue = {
  categories: AdminCategoryCardItem[];
  total: number;
  totalPages: number;
  actions: CategoriesTableActions;
};

type CategoriesTableProviderProps = PropsWithChildren<{
  categories: AdminCategoryCardItem[];
  total: number;
  totalPages: number;
}>;

const CategoriesTableContext = createContext<CategoriesTableContextValue | null>(null);

export function CategoriesTableProvider({
  categories,
  total,
  totalPages,
  children,
}: CategoriesTableProviderProps): ReactNode {
  const actions = useCategoriesTableActions();

  const value = useMemo<CategoriesTableContextValue>(
    () => ({ categories, total, totalPages, actions }),
    [categories, total, totalPages, actions]
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
