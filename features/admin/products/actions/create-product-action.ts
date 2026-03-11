"use server";

import { redirect } from "next/navigation";
import {
  AdminProductRepositoryError,
  createAdminProduct
} from "@/db/repositories/admin-product.repository";
import { validateProductInput } from "@/entities/product/product-input";

export async function createProductAction(formData: FormData): Promise<void> {
  const validation = validateProductInput({
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    status: formData.get("status"),
    productType: formData.get("productType"),
    isFeatured: formData.get("isFeatured"),
    categoryIds: formData.getAll("categoryIds")
  });

  if (!validation.ok) {
    redirect(`/admin/products/new?error=${validation.code}`);
  }

  let createdProductId: string | null = null;

  try {
    const product = await createAdminProduct(validation.data);
    createdProductId = product.id;
  } catch (error) {
    if (
      error instanceof AdminProductRepositoryError &&
      error.code === "slug_taken"
    ) {
      redirect("/admin/products/new?error=slug_taken");
    }

    if (
      error instanceof AdminProductRepositoryError &&
      error.code === "category_missing"
    ) {
      redirect("/admin/products/new?error=invalid_category_ids");
    }

    console.error(error);
    redirect("/admin/products/new?error=save_failed");
  }

  if (createdProductId === null) {
    redirect("/admin/products/new?error=save_failed");
  }

  redirect(`/admin/products/${createdProductId}?product_status=created`);
}
