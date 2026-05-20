"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";

import { useCategoriesTableActions } from "./hooks/use-categories-table-actions";

type CategoriesTableActions = ReturnType<typeof useCategoriesTableActions>;

type CategoriesTableContextValue = {
  categories: AdminCategoryCardItem[];
  filteredCategories: AdminCategoryCardItem[];
  search: string;
  setSearch: (value: string) => void;
  actions: CategoriesTableActions;
};

type CategoriesTableProviderProps = PropsWithChildren<{
  categories: AdminCategoryCardItem[];
}>;

const CategoriesTableContext = createContext<CategoriesTableContextValue | null>(null);

export function CategoriesTableProvider({
  categories,
  children,
}: CategoriesTableProviderProps): ReactNode {
  const [search, setSearch] = useState("");
  const actions = useCategoriesTableActions();

  const filteredCategories = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (normalized.length === 0) {
      return categories;
    }

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(normalized) ||
        category.slug.toLowerCase().includes(normalized)
    );
  }, [categories, search]);

  const value = useMemo<CategoriesTableContextValue>(
    () => ({ categories, filteredCategories, search, setSearch, actions }),
    [categories, filteredCategories, search, actions]
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
