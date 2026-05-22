"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  archiveAdminCategory,
  archiveAdminCategories,
  restoreAdminCategory,
  hardDeleteAdminCategory,
} from "../services";
import { AdminCategoryServiceError } from "../types";
import { ADMIN_CATEGORIES_LIST_PATH } from "../shared/admin-categories-routes";

// ---------------------------------------------------------------------------
// archiveCategoryAction
// ---------------------------------------------------------------------------

type ArchiveCategoryActionResult =
  | { success: true }
  | { success: false; error: string };

export async function archiveCategoryAction(input: {
  categoryId: string;
}): Promise<ArchiveCategoryActionResult> {
  const categoryId = input.categoryId.trim();

  if (categoryId.length === 0) {
    return { success: false, error: "missing_id" };
  }

  try {
    await archiveAdminCategory({ categoryId });
    revalidatePath(ADMIN_CATEGORIES_LIST_PATH);
    return { success: true };
  } catch {
    return { success: false, error: "archive_failed" };
  }
}

// ---------------------------------------------------------------------------
// archiveCategoryRedirectAction
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// bulkArchiveCategoriesAction
// ---------------------------------------------------------------------------

type BulkArchiveCategoriesActionResult =
  | { success: true; count: number }
  | { success: false; error: string };

export async function bulkArchiveCategoriesAction(
  categoryIds: string[]
): Promise<BulkArchiveCategoriesActionResult> {
  const ids = categoryIds.filter((id) => id.trim().length > 0);

  if (ids.length === 0) {
    return { success: false, error: "no_ids" };
  }

  try {
    const { count } = await archiveAdminCategories({ categoryIds: ids });
    revalidatePath(ADMIN_CATEGORIES_LIST_PATH);
    return { success: true, count };
  } catch {
    return { success: false, error: "archive_failed" };
  }
}

// ---------------------------------------------------------------------------
// restoreCategoryAction
// ---------------------------------------------------------------------------

type RestoreCategoryActionResult =
  | { success: true }
  | { success: false; error: string };

export async function restoreCategoryAction(input: {
  categoryId: string;
}): Promise<RestoreCategoryActionResult> {
  const categoryId = input.categoryId.trim();

  if (categoryId.length === 0) {
    return { success: false, error: "missing_id" };
  }

  try {
    await restoreAdminCategory({ categoryId });
    revalidatePath(ADMIN_CATEGORIES_LIST_PATH);
    return { success: true };
  } catch {
    return { success: false, error: "restore_failed" };
  }
}

// ---------------------------------------------------------------------------
// hardDeleteCategoryAction
// ---------------------------------------------------------------------------

type HardDeleteCategoryActionResult =
  | { success: true }
  | { success: false; error: string };

export async function hardDeleteCategoryAction(input: {
  categoryId: string;
}): Promise<HardDeleteCategoryActionResult> {
  const categoryId = input.categoryId.trim();

  if (categoryId.length === 0) {
    return { success: false, error: "missing_id" };
  }

  try {
    await hardDeleteAdminCategory({ categoryId });
    revalidatePath(ADMIN_CATEGORIES_LIST_PATH);
    return { success: true };
  } catch {
    return { success: false, error: "delete_failed" };
  }
}
