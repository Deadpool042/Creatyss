"use server";

import { setAdminCategoryImage, deleteAdminCategoryImage } from "../services";

// ---------------------------------------------------------------------------
// setCategoryImageAction
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// deleteCategoryImageAction
// ---------------------------------------------------------------------------

type CategoryImageDeleteActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialCategoryImageDeleteActionState: CategoryImageDeleteActionState = {
  status: "idle",
  message: "",
};

export async function deleteCategoryImageAction(
  _previousState: CategoryImageDeleteActionState,
  formData: FormData
): Promise<CategoryImageDeleteActionState> {
  const categoryId = String(formData.get("categoryId") ?? "").trim();

  try {
    await deleteAdminCategoryImage({ categoryId });

    return {
      ...initialCategoryImageDeleteActionState,
      status: "success",
      message: "Suppression effectuée.",
    };
  } catch {
    return {
      ...initialCategoryImageDeleteActionState,
      status: "error",
      message: "Suppression impossible.",
    };
  }
}
