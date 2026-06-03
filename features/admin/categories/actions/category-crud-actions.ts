"use server";

import { redirect } from "next/navigation";
import { validateAdminCategoryInput } from "@/entities/category";
import { AdminCategoryServiceError } from "../types";
import { createAdminCategory, updateAdminCategory, updateCategorySeo } from "../services";
import {
  ADMIN_CATEGORIES_LIST_PATH,
  ADMIN_CATEGORIES_NEW_PATH,
  getAdminCategoryDetailPath,
} from "../shared/admin-categories-routes";
import { categorySeoFormSchema } from "../schemas/category-seo-form.schema";

// ---------------------------------------------------------------------------
// createCategoryAction
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// updateCategoryAction
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// updateCategorySeoAction
// ---------------------------------------------------------------------------

type CategorySeoActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialCategorySeoActionState: CategorySeoActionState = {
  status: "idle",
  message: "",
};

export async function updateCategorySeoAction(
  _previousState: CategorySeoActionState,
  formData: FormData
): Promise<CategorySeoActionState> {
  const parsed = categorySeoFormSchema.safeParse({
    categoryId: formData.get("categoryId"),
    title: formData.get("title"),
    description: formData.get("description"),
    canonicalPath: formData.get("canonicalPath"),
    indexingMode: formData.get("indexingMode"),
    sitemapIncluded: formData.get("sitemapIncluded"),
    openGraphTitle: formData.get("openGraphTitle"),
    openGraphDescription: formData.get("openGraphDescription"),
    twitterTitle: formData.get("twitterTitle"),
    twitterDescription: formData.get("twitterDescription"),
  });

  if (!parsed.success) {
    return {
      ...initialCategorySeoActionState,
      status: "error",
      message: "Données invalides.",
    };
  }

  try {
    await updateCategorySeo({
      categoryId: parsed.data.categoryId,
      title: parsed.data.title,
      description: parsed.data.description,
      canonicalPath: parsed.data.canonicalPath,
      indexingMode: parsed.data.indexingMode,
      sitemapIncluded: parsed.data.sitemapIncluded === "true",
      openGraphTitle: parsed.data.openGraphTitle,
      openGraphDescription: parsed.data.openGraphDescription,
      twitterTitle: parsed.data.twitterTitle,
      twitterDescription: parsed.data.twitterDescription,
    });
  } catch {
    return {
      ...initialCategorySeoActionState,
      status: "error",
      message: "Impossible de mettre à jour les paramètres SEO.",
    };
  }

  return {
    ...initialCategorySeoActionState,
    status: "success",
    message: "Paramètres SEO mis à jour.",
  };
}
