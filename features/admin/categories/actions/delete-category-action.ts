"use server";

import { redirect } from "next/navigation";
import {
  AdminCategoryRepositoryError,
  countProductsForCategory,
  deleteAdminCategory,
  findAdminCategoryById
} from "@/db/repositories/admin-category.repository";

function normalizeCategoryId(
  value: FormDataEntryValue | null
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const categoryId = normalizeCategoryId(formData.get("categoryId"));

  if (categoryId === null) {
    redirect("/admin/categories?error=missing_category");
  }

  const category = await findAdminCategoryById(categoryId);

  if (category === null) {
    redirect("/admin/categories?error=missing_category");
  }

  const linkedProductsCount = await countProductsForCategory(categoryId);

  if (linkedProductsCount > 0) {
    redirect(`/admin/categories/${categoryId}?error=in_use`);
  }

  try {
    const wasDeleted = await deleteAdminCategory(categoryId);

    if (!wasDeleted) {
      redirect("/admin/categories?error=missing_category");
    }
  } catch (error) {
    if (
      error instanceof AdminCategoryRepositoryError &&
      error.code === "category_referenced"
    ) {
      redirect(`/admin/categories/${categoryId}?error=referenced`);
    }

    console.error(error);
    redirect(`/admin/categories/${categoryId}?error=delete_failed`);
  }

  redirect("/admin/categories?status=deleted");
}
