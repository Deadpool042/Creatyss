"use server";

import { redirect } from "next/navigation";
import { AdminCategoryServiceError } from "../types";
import { deleteAdminCategory } from "../services";

export async function deleteCategoryAction(input: { categoryId: string }): Promise<void> {
  const categoryId = input.categoryId.trim();

  if (categoryId.length === 0) {
    redirect("/admin/categories?error=missing_category");
  }

  try {
    await deleteAdminCategory({ categoryId });
  } catch (error: unknown) {
    if (error instanceof AdminCategoryServiceError && error.code === "category_missing") {
      redirect("/admin/categories?error=missing_category");
    }

    redirect(`/admin/categories/${categoryId}?error=save_failed`);
  }

  redirect("/admin/categories?status=deleted");
}
