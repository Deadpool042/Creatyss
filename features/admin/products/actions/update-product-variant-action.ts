"use server";

import { redirect } from "next/navigation";
import {
  AdminProductVariantRepositoryError,
  updateAdminProductVariant,
} from "@/db/repositories/admin-product-variant.repository";
import { validateProductVariantInput } from "@/entities/product/product-variant-input";
import { normalizeNumericIdFromForm } from "@/features/admin/products/actions/action-helpers";

export async function updateProductVariantAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));
  const variantId = normalizeNumericIdFromForm(formData.get("variantId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  if (variantId === null) {
    redirect(`/admin/products/${productId}?variant_error=missing_variant`);
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
    const variant = await updateAdminProductVariant({
      id: variantId,
      productId,
      ...validation.data,
    });

    if (variant === null) {
      redirect(`/admin/products/${productId}?variant_error=missing_variant`);
    }
  } catch (error) {
    if (error instanceof AdminProductVariantRepositoryError && error.code === "sku_taken") {
      redirect(`/admin/products/${productId}?variant_error=sku_taken`);
    }

    console.error(error);
    redirect(`/admin/products/${productId}?variant_error=save_failed`);
  }

  redirect(`/admin/products/${productId}?variant_status=updated`);
}
