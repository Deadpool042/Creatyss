"use server";

import { deleteAdminCategoryImage } from "../services";

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
