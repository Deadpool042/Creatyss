"use server";

import { revalidatePath } from "next/cache";

import { archiveAdminCategories } from "../services";
import { ADMIN_CATEGORIES_LIST_PATH } from "../shared/admin-categories-routes";

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
