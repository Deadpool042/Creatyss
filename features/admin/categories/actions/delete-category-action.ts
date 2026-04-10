"use server";

import { deleteAdminCategory } from "../services";

export async function deleteCategoryAction(input: {
  categoryId: string;
}): Promise<{ status: "success" | "error"; message: string }> {
  try {
    await deleteAdminCategory(input);

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
