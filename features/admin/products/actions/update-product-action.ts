"use server";

import { redirect } from "next/navigation";
import {
  AdminProductRepositoryError,
  updateAdminProduct
} from "@/db/repositories/admin-product.repository";
import { validateProductInput } from "@/entities/product/product-input";
import { normalizeNumericIdFromForm } from "@/features/admin/products/actions/action-helpers";

export async function updateProductAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const validation = validateProductInput({
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured"),
    categoryIds: formData.getAll("categoryIds")
  });

  if (!validation.ok) {
    redirect(`/admin/products/${productId}?product_error=${validation.code}`);
  }

  try {
    const product = await updateAdminProduct({
      id: productId,
      ...validation.data
    });

    if (product === null) {
      redirect("/admin/products?error=missing_product");
    }
  } catch (error) {
    if (
      error instanceof AdminProductRepositoryError &&
      error.code === "slug_taken"
    ) {
      redirect(`/admin/products/${productId}?product_error=slug_taken`);
    }

    if (
      error instanceof AdminProductRepositoryError &&
      error.code === "category_missing"
    ) {
      redirect(`/admin/products/${productId}?product_error=invalid_category_ids`);
    }

    console.error(error);
    redirect(`/admin/products/${productId}?product_error=save_failed`);
  }

  redirect(`/admin/products/${productId}?product_status=updated`);
}
