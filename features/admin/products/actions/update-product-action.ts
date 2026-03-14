"use server";

import { redirect } from "next/navigation";
import {
  AdminProductRepositoryError,
  findAdminProductPublishContext,
  updateAdminProduct,
} from "@/db/repositories/admin-product.repository";
import { validateProductInput } from "@/entities/product/product-input";
import { getProductPublishability } from "@/entities/product/product-publishability";
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
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    status: formData.get("status"),
    productType: formData.get("productType"),
    isFeatured: formData.get("isFeatured"),
    categoryIds: formData.getAll("categoryIds")
  });

  if (!validation.ok) {
    redirect(`/admin/products/${productId}?product_error=${validation.code}`);
  }

  if (validation.data.status === "published") {
    const context = await findAdminProductPublishContext(productId);

    if (context !== null) {
      const publishability = getProductPublishability(
        validation.data.productType,
        context.variantCount
      );

      if (!publishability.ok) {
        redirect(
          `/admin/products/${productId}?product_error=${publishability.code}`
        );
      }
    }
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

    if (
      error instanceof AdminProductRepositoryError &&
      error.code === "simple_product_requires_single_variant"
    ) {
      redirect(
        `/admin/products/${productId}?product_error=simple_product_requires_single_variant`
      );
    }

    console.error(error);
    redirect(`/admin/products/${productId}?product_error=save_failed`);
  }

  redirect(`/admin/products/${productId}?product_status=updated`);
}
