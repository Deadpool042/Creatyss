"use server";

import { deleteAdminCategoryImage } from "../services";

export async function deleteCategoryImageAction(input: {
  categoryId: string;
}): Promise<{ status: "success" | "error"; message: string }> {
  try {
    await deleteAdminCategoryImage(input);

    return {
      status: "success",
      message: "Suppression effectuée.",
    };
  } catch {
    return {
      status: "error",
      message: "Suppression impossible.",
    };
  }
}
