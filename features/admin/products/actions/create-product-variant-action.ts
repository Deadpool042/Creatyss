"use server";

import { redirect } from "next/navigation";
import {
  AdminProductVariantRepositoryError,
  createAdminProductVariant,
} from "@/db/repositories/products/admin-product-variant.repository";
import { validateProductVariantInput } from "@/entities/product/product-variant-input";
import { normalizeNumericIdFromForm } from "@/features/admin/products/actions/action-helpers";

export async function createProductVariantAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const validation = validateProductVariantInput({
    name: formData.get("name"),
    colorName: formData.get("colorName"),
    colorHex: formData.get("colorHex"),
    sku: formData.get("sku"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice"),
    stockQuantity: formData.get("stockQuantity"),
    isDefault: formData.get("isDefault"),
    status: formData.get("status"),
  });

  if (!validation.ok) {
    redirect(`/admin/products/${productId}?variant_error=${validation.code}`);
  }

  try {
    const variant = await createAdminProductVariant({
      productId,
      ...validation.data,
    });

    if (variant === null) {
      redirect("/admin/products?error=missing_product");
    }
  } catch (error) {
    if (error instanceof AdminProductVariantRepositoryError && error.code === "sku_taken") {
      redirect(`/admin/products/${productId}?variant_error=sku_taken`);
    }

    if (
      error instanceof AdminProductVariantRepositoryError &&
      error.code === "simple_product_single_variant_only"
    ) {
      redirect(`/admin/products/${productId}?variant_error=simple_product_single_variant_only`);
    }

    console.error(error);
    redirect(`/admin/products/${productId}?variant_error=save_failed`);
  }

  redirect(`/admin/products/${productId}?variant_status=created`);
}
