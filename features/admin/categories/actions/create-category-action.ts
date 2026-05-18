"use server";

import { redirect } from "next/navigation";
import { validateAdminCategoryInput } from "@/entities/category";
import { AdminCategoryServiceError } from "../types";
import { createAdminCategory } from "../services";

export async function createCategoryAction(formData: FormData): Promise<void> {
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
    redirect(`/admin/categories/new?error=${validated.code}`);
  }

  try {
    await createAdminCategory(validated.data);
  } catch (error: unknown) {
    if (error instanceof AdminCategoryServiceError) {
      redirect(`/admin/categories/new?error=${error.code}`);
    }

    redirect("/admin/categories/new?error=save_failed");
  }

  redirect("/admin/categories?status=created");
}
