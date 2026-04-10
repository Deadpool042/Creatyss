"use server";

import { validateAdminCategoryInput } from "@/entities/category";
import { updateAdminCategory } from "../services";

export async function updateCategoryAction(formData: FormData): Promise<{
  status: "success" | "error";
  message: string;
}> {
  const categoryId = formData.get("categoryId");

  if (typeof categoryId !== "string" || categoryId.trim().length === 0) {
    return {
      status: "error",
      message: "Catégorie introuvable.",
    };
  }

  const validated = validateAdminCategoryInput({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    parentId: formData.get("parentId"),
    primaryImageId: formData.get("primaryImageId"),
    isFeatured: formData.get("isFeatured"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!validated.ok) {
    return {
      status: "error",
      message: "Données invalides.",
    };
  }

  try {
    await updateAdminCategory({
      categoryId: categoryId.trim(),
      ...validated.data,
    });

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
