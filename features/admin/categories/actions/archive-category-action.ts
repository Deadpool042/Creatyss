"use server";

import { revalidatePath } from "next/cache";

import { archiveAdminCategory } from "../services";
import { ADMIN_CATEGORIES_LIST_PATH } from "../shared/admin-categories-routes";

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
