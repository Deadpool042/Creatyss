"use server";

import { redirect } from "next/navigation";
import { updateAdminCategoryImage } from "@/db/repositories/admin-category.repository";

function normalizeCategoryId(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

export async function deleteCategoryImageAction(formData: FormData): Promise<void> {
  const categoryId = normalizeCategoryId(formData.get("categoryId"));

  if (categoryId === null) {
    redirect("/admin/categories?error=missing_category");
  }

  const category = await updateAdminCategoryImage({
    id: categoryId,
    imagePath: null,
  });

  if (category === null) {
    redirect("/admin/categories?error=missing_category");
  }

  redirect(`/admin/categories/${categoryId}?image_status=deleted`);
}
