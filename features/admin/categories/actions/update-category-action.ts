"use server";

import { redirect } from "next/navigation";
import {
  AdminCategoryRepositoryError,
  updateAdminCategory
} from "@/db/repositories/admin-category.repository";
import { normalizeCategorySlug } from "@/entities/category/category-input";

import { CategoryFormSchema } from "../schemas/category-form-schema";

function normalizeCategoryId(
  value: FormDataEntryValue | null
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

export async function updateCategoryAction(formData: FormData): Promise<void> {
  const categoryId = normalizeCategoryId(formData.get("categoryId"));

  if (categoryId === null) {
    redirect("/admin/categories?error=missing_category");
  }

  const parsed = CategoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    isFeatured: formData.get("isFeatured")
  });

  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    const code =
      field === "name"
        ? "missing_name"
        : field === "slug"
          ? "missing_slug"
          : "save_failed";
    redirect(`/admin/categories/${categoryId}?error=${code}`);
  }

  const slug = normalizeCategorySlug(parsed.data.slug);

  if (slug.length === 0) {
    redirect(`/admin/categories/${categoryId}?error=invalid_slug`);
  }

  try {
    const category = await updateAdminCategory({
      id: categoryId,
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      isFeatured: parsed.data.isFeatured
    });

    if (category === null) {
      redirect("/admin/categories?error=missing_category");
    }
  } catch (error) {
    if (
      error instanceof AdminCategoryRepositoryError &&
      error.code === "slug_taken"
    ) {
      redirect(`/admin/categories/${categoryId}?error=slug_taken`);
    }

    console.error(error);
    redirect(`/admin/categories/${categoryId}?error=save_failed`);
  }

  redirect("/admin/categories?status=updated");
}
