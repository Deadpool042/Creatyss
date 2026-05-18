"use server";

import { redirect } from "next/navigation";
import { validateAdminCategoryInput } from "@/entities/category";
import { AdminCategoryServiceError } from "../types";
import { updateAdminCategory } from "../services";

export async function updateCategoryAction(formData: FormData): Promise<void> {
  const categoryId = formData.get("categoryId");

  if (typeof categoryId !== "string" || categoryId.trim().length === 0) {
    redirect("/admin/categories?error=missing_category");
  }

  const normalizedCategoryId = categoryId.trim();

  const validated = validateAdminCategoryInput({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    parentId: formData.get("parentId"),
    primaryImageId: formData.get("primaryImageId"),
    isFeatured: formData.get("isFeatured"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!validated.ok) {
    redirect(`/admin/categories/${normalizedCategoryId}?error=${validated.code}`);
  }

  try {
    await updateAdminCategory({
      categoryId: normalizedCategoryId,
      ...validated.data,
    });
  } catch (error: unknown) {
    if (error instanceof AdminCategoryServiceError && error.code === "category_missing") {
      redirect("/admin/categories?error=missing_category");
    }

    if (error instanceof AdminCategoryServiceError) {
      redirect(`/admin/categories/${normalizedCategoryId}?error=${error.code}`);
    }

    redirect(`/admin/categories/${normalizedCategoryId}?error=save_failed`);
  }

  redirect(`/admin/categories/${normalizedCategoryId}?status=updated`);
}
