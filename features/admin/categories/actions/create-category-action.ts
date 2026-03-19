"use server";

import { redirect } from "next/navigation";
import {
  AdminCategoryRepositoryError,
  createAdminCategory,
} from "@/db/repositories/admin-category.repository";
import { normalizeCategorySlug } from "@/entities/category/category-input";

import { CategoryFormSchema } from "../schemas/category-form-schema";

export async function createCategoryAction(formData: FormData): Promise<void> {
  const parsed = CategoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    isFeatured: formData.get("isFeatured"),
  });

  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    const code =
      field === "name" ? "missing_name" : field === "slug" ? "missing_slug" : "save_failed";
    redirect(`/admin/categories/new?error=${code}`);
  }

  const slug = normalizeCategorySlug(parsed.data.slug);

  if (slug.length === 0) {
    redirect("/admin/categories/new?error=invalid_slug");
  }

  try {
    await createAdminCategory({
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      isFeatured: parsed.data.isFeatured,
    });
  } catch (error) {
    if (error instanceof AdminCategoryRepositoryError && error.code === "slug_taken") {
      redirect("/admin/categories/new?error=slug_taken");
    }

    console.error(error);
    redirect("/admin/categories/new?error=save_failed");
  }

  redirect("/admin/categories?status=created");
}
