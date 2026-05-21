"use server";

import { revalidatePath } from "next/cache";
import { hardDeleteAdminCategory } from "../services";
import { ADMIN_CATEGORIES_LIST_PATH } from "../shared/admin-categories-routes";

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
