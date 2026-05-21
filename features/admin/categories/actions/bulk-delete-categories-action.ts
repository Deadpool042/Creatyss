"use server";

import { revalidatePath } from "next/cache";
import { bulkDeleteAdminCategories } from "../services";

type BulkDeleteCategoriesActionResult =
  | { success: true; count: number }
  | { success: false; error: string };

export async function bulkDeleteCategoriesAction(
  categoryIds: string[]
): Promise<BulkDeleteCategoriesActionResult> {
  const ids = categoryIds.filter((id) => id.trim().length > 0);

  if (ids.length === 0) {
    return { success: false, error: "no_ids" };
  }

  try {
    const { count } = await bulkDeleteAdminCategories({ categoryIds: ids });
    revalidatePath("/admin/catalog/categories");
    return { success: true, count };
  } catch {
    return { success: false, error: "delete_failed" };
  }
}
