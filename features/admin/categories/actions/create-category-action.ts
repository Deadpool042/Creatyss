"use server";

import { redirect } from "next/navigation";
import { validateAdminCategoryInput } from "@/entities/category";
import { AdminCategoryServiceError } from "../types";
import { createAdminCategory } from "../services";
import {
  ADMIN_CATEGORIES_LIST_PATH,
  ADMIN_CATEGORIES_NEW_PATH,
} from "../shared/admin-categories-routes";

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
    redirect(`${ADMIN_CATEGORIES_NEW_PATH}?error=${validated.code}`);
  }

  try {
    await createAdminCategory(validated.data);
  } catch (error: unknown) {
    if (error instanceof AdminCategoryServiceError) {
      redirect(`${ADMIN_CATEGORIES_NEW_PATH}?error=${error.code}`);
    }

    redirect(`${ADMIN_CATEGORIES_NEW_PATH}?error=save_failed`);
  }

  redirect(`${ADMIN_CATEGORIES_LIST_PATH}?status=created`);
}
