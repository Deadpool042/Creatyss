"use server";

import { revalidatePath } from "next/cache";
import { restoreAdminCategory } from "../services";
import { ADMIN_CATEGORIES_LIST_PATH } from "../shared/admin-categories-routes";

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
