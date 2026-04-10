"use server";

import { validateAdminCategoryInput } from "@/entities/category";
import { createAdminCategory } from "../services";

export async function createCategoryAction(formData: FormData): Promise<{
  status: "success" | "error";
  message: string;
}> {
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
    await createAdminCategory(validated.data);

    return {
      status: "success",
      message: "Création effectuée.",
    };
  } catch {
    return {
      status: "error",
      message: "Création impossible.",
    };
  }
}
