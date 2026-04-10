"use server";

import { setAdminCategoryImage } from "../services";

export async function setCategoryImageAction(input: {
  categoryId: string;
  mediaAssetId: string | null;
}): Promise<{ status: "success" | "error"; message: string }> {
  try {
    await setAdminCategoryImage(input);

    return {
      status: "success",
      message: "Mise à jour effectuée.",
    };
  } catch {
    return {
      status: "error",
      message: "Mise à jour impossible.",
    };
  }
}
