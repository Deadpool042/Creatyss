"use server";

import { redirect } from "next/navigation";
import { validateAdminCategoryInput } from "@/entities/category";
import { AdminCategoryServiceError } from "../types";
import { updateAdminCategory } from "../services";
import {
  ADMIN_CATEGORIES_LIST_PATH,
  getAdminCategoryDetailPath,
} from "../shared/admin-categories-routes";

export async function updateCategoryAction(formData: FormData): Promise<void> {
  const categoryId = formData.get("categoryId");
  const routeSlug = formData.get("routeSlug");

  if (typeof categoryId !== "string" || categoryId.trim().length === 0) {
    redirect(`${ADMIN_CATEGORIES_LIST_PATH}?error=missing_category`);
  }

  const normalizedCategoryId = categoryId.trim();
  const normalizedRouteSlug =
    typeof routeSlug === "string" && routeSlug.trim().length > 0 ? routeSlug.trim() : null;

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
    if (normalizedRouteSlug !== null) {
      redirect(`${getAdminCategoryDetailPath(normalizedRouteSlug)}?error=${validated.code}`);
    }

    redirect(`${ADMIN_CATEGORIES_LIST_PATH}?error=${validated.code}`);
  }

  try {
    await updateAdminCategory({
      categoryId: normalizedCategoryId,
      ...validated.data,
    });
  } catch (error: unknown) {
    if (error instanceof AdminCategoryServiceError && error.code === "category_missing") {
      redirect(`${ADMIN_CATEGORIES_LIST_PATH}?error=missing_category`);
    }

    if (error instanceof AdminCategoryServiceError) {
      redirect(
        `${getAdminCategoryDetailPath(normalizedRouteSlug ?? validated.data.slug)}?error=${error.code}`
      );
    }

    redirect(
      `${getAdminCategoryDetailPath(normalizedRouteSlug ?? validated.data.slug)}?error=save_failed`
    );
  }

  redirect(`${getAdminCategoryDetailPath(validated.data.slug)}?status=updated`);
}
