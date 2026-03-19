"use server";

import { redirect } from "next/navigation";
import {
  AdminProductRepositoryError,
  updateAdminSimpleProductOffer,
} from "@/db/repositories/products/admin-product.repository";
import { validateSimpleProductOfferInput } from "@/entities/product/simple-product-offer-input";
import { normalizeNumericIdFromForm } from "@/features/admin/products/actions/action-helpers";

export async function updateSimpleProductOfferAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const validation = validateSimpleProductOfferInput({
    sku: formData.get("sku"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice"),
    stockQuantity: formData.get("stockQuantity"),
  });

  if (!validation.ok) {
    redirect(`/admin/products/${productId}?simple_offer_error=${validation.code}`);
  }

  try {
    const product = await updateAdminSimpleProductOffer({
      id: productId,
      ...validation.data,
    });

    if (product === null) {
      redirect("/admin/products?error=missing_product");
    }
  } catch (error) {
    if (error instanceof AdminProductRepositoryError && error.code === "sku_taken") {
      redirect(`/admin/products/${productId}?simple_offer_error=sku_taken`);
    }

    if (
      error instanceof AdminProductRepositoryError &&
      error.code === "simple_product_offer_requires_simple_product"
    ) {
      redirect(
        `/admin/products/${productId}?simple_offer_error=simple_product_offer_requires_simple_product`
      );
    }

    if (
      error instanceof AdminProductRepositoryError &&
      error.code === "simple_product_multiple_legacy_variants"
    ) {
      redirect(
        `/admin/products/${productId}?simple_offer_error=simple_product_multiple_legacy_variants`
      );
    }

    console.error(error);
    redirect(`/admin/products/${productId}?simple_offer_error=save_failed`);
  }

  redirect(`/admin/products/${productId}?simple_offer_status=updated`);
}
