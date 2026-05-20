"use client";

import { useTransition } from "react";

import { deleteCategoryAction } from "@/features/admin/categories/actions/delete-category-action";

type UseCategoriesTableActionsResult = {
  isPending: boolean;
  handleDeleteCategory: (categoryId: string) => void;
};

export function useCategoriesTableActions(): UseCategoriesTableActionsResult {
  const [isPending, startTransition] = useTransition();

  function handleDeleteCategory(categoryId: string): void {
    startTransition(async () => {
      await deleteCategoryAction({ categoryId });
    });
  }

  return { isPending, handleDeleteCategory };
}
