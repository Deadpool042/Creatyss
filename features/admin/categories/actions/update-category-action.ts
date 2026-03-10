"use server";

import { redirect } from "next/navigation";
import {
  AdminCategoryRepositoryError,
  updateAdminCategory
} from "@/db/repositories/admin-category.repository";
import { validateCategoryInput } from "@/entities/category/category-input";

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

export async function updateCategoryAction(formData: FormData): Promise<void> {
  const categoryId = normalizeCategoryId(formData.get("categoryId"));

  if (categoryId === null) {
    redirect("/admin/categories?error=missing_category");
  }

  const validation = validateCategoryInput({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    isFeatured: formData.get("isFeatured")
  });

  if (!validation.ok) {
    redirect(`/admin/categories/${categoryId}?error=${validation.code}`);
  }

  try {
    const category = await updateAdminCategory({
      id: categoryId,
      ...validation.data
    });

    if (category === null) {
      redirect("/admin/categories?error=missing_category");
    }
  } catch (error) {
    if (
      error instanceof AdminCategoryRepositoryError &&
      error.code === "slug_taken"
    ) {
      redirect(`/admin/categories/${categoryId}?error=slug_taken`);
    }

    console.error(error);
    redirect(`/admin/categories/${categoryId}?error=save_failed`);
  }

  redirect("/admin/categories?status=updated");
}
