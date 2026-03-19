"use server";

import { redirect } from "next/navigation";
import {
  AdminProductVariantRepositoryError,
  deleteAdminProductVariant,
} from "@/db/repositories/products/admin-product-variant.repository";
import { normalizeNumericIdFromForm } from "@/features/admin/products/actions/action-helpers";

export async function deleteProductVariantAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));
  const variantId = normalizeNumericIdFromForm(formData.get("variantId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  if (variantId === null) {
    redirect(`/admin/products/${productId}?variant_error=missing_variant`);
  }

  try {
    const wasDeleted = await deleteAdminProductVariant(productId, variantId);

    if (!wasDeleted) {
      redirect(`/admin/products/${productId}?variant_error=missing_variant`);
    }
  } catch (error) {
    if (
      error instanceof AdminProductVariantRepositoryError &&
      error.code === "simple_product_requires_sellable_variant"
    ) {
      redirect(
        `/admin/products/${productId}?variant_error=simple_product_requires_sellable_variant`
      );
    }

    console.error(error);
    redirect(`/admin/products/${productId}?variant_error=delete_failed`);
  }

  redirect(`/admin/products/${productId}?variant_status=deleted`);
}
