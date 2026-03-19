"use server";

import { redirect } from "next/navigation";
import {
  AdminProductImageRepositoryError,
  createAdminProductImage,
} from "@/db/repositories/admin-product-image.repository";
import { validateCreateProductImageInput } from "@/entities/product/product-image-input";
import {
  appendImageScope,
  findAdminMediaAssetById,
  normalizeImageScopeFromForm,
  normalizeNumericIdFromForm,
} from "@/features/admin/products/actions/action-helpers";

export async function createProductImageAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));
  const imageScope = normalizeImageScopeFromForm(formData.get("imageScope"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const validation = validateCreateProductImageInput({
    mediaAssetId: formData.get("mediaAssetId"),
    variantId: formData.get("variantId"),
    altText: formData.get("altText"),
    sortOrder: formData.get("sortOrder"),
    isPrimary: formData.get("isPrimary"),
  });

  if (!validation.ok) {
    redirect(
      appendImageScope(`/admin/products/${productId}?image_error=${validation.code}`, imageScope)
    );
  }

  const mediaAsset = await findAdminMediaAssetById(validation.data.mediaAssetId);

  if (mediaAsset === null) {
    redirect(
      appendImageScope(`/admin/products/${productId}?image_error=media_missing`, imageScope)
    );
  }

  try {
    const image = await createAdminProductImage({
      productId,
      variantId: validation.data.variantId,
      filePath: mediaAsset.filePath,
      altText: validation.data.altText,
      sortOrder: validation.data.sortOrder,
      isPrimary: validation.data.isPrimary,
    });

    if (image === null) {
      redirect("/admin/products?error=missing_product");
    }
  } catch (error) {
    if (error instanceof AdminProductImageRepositoryError && error.code === "variant_missing") {
      redirect(
        appendImageScope(`/admin/products/${productId}?image_error=variant_missing`, imageScope)
      );
    }

    console.error(error);
    redirect(appendImageScope(`/admin/products/${productId}?image_error=save_failed`, imageScope));
  }

  redirect(appendImageScope(`/admin/products/${productId}?image_status=created`, imageScope));
}
