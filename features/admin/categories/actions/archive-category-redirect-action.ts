"use server";

import { redirect } from "next/navigation";

import { AdminCategoryServiceError } from "../types";
import { archiveAdminCategory } from "../services";
import { ADMIN_CATEGORIES_LIST_PATH } from "../shared/admin-categories-routes";

export async function archiveCategoryRedirectAction(input: {
  categoryId: string;
}): Promise<void> {
  const categoryId = input.categoryId.trim();

  if (categoryId.length === 0) {
    redirect(`${ADMIN_CATEGORIES_LIST_PATH}?error=missing_category`);
  }

  try {
    await archiveAdminCategory({ categoryId });
  } catch (error: unknown) {
    if (error instanceof AdminCategoryServiceError && error.code === "category_missing") {
      redirect(`${ADMIN_CATEGORIES_LIST_PATH}?error=missing_category`);
    }

    redirect(`${ADMIN_CATEGORIES_LIST_PATH}?error=save_failed`);
  }

  redirect(`${ADMIN_CATEGORIES_LIST_PATH}?status=deleted`);
}
