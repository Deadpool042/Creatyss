"use server";

import { setAdminCategoryImage } from "../services";

type CategoryImageActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialCategoryImageActionState: CategoryImageActionState = {
  status: "idle",
  message: "",
};

export async function setCategoryImageAction(
  _previousState: CategoryImageActionState,
  formData: FormData
): Promise<CategoryImageActionState> {
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const mediaAssetIdRaw = String(formData.get("mediaAssetId") ?? "");

  try {
    await setAdminCategoryImage({
      categoryId,
      mediaAssetId: mediaAssetIdRaw.trim().length > 0 ? mediaAssetIdRaw.trim() : null,
    });

    return {
      ...initialCategoryImageActionState,
      status: "success",
      message: "Mise à jour effectuée.",
    };
  } catch {
    return {
      ...initialCategoryImageActionState,
      status: "error",
      message: "Mise à jour impossible.",
    };
  }
}
