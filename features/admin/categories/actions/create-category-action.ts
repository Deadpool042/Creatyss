"use server";

import { redirect } from "next/navigation";
import {
  AdminCategoryRepositoryError,
  createAdminCategory
} from "@/db/repositories/admin-category.repository";
import { validateCategoryInput } from "@/entities/category/category-input";

export async function createCategoryAction(formData: FormData): Promise<void> {
  const validation = validateCategoryInput({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    isFeatured: formData.get("isFeatured")
  });

  if (!validation.ok) {
    redirect(`/admin/categories/new?error=${validation.code}`);
  }

  try {
    await createAdminCategory(validation.data);
  } catch (error) {
    if (
      error instanceof AdminCategoryRepositoryError &&
      error.code === "slug_taken"
    ) {
      redirect("/admin/categories/new?error=slug_taken");
    }

    console.error(error);
    redirect("/admin/categories/new?error=save_failed");
  }

  redirect("/admin/categories?status=created");
}
