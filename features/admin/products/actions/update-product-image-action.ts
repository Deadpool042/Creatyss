"use server";

import { redirect } from "next/navigation";
import { updateAdminProductImage } from "@/db/repositories/products/admin-product-image.repository";
import { validateUpdateProductImageInput } from "@/entities/product/product-image-input";
import {
  appendImageScope,
  normalizeImageScopeFromForm,
  normalizeNumericIdFromForm,
} from "@/features/admin/products/actions/action-helpers";

export async function updateProductImageAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));
  const imageId = normalizeNumericIdFromForm(formData.get("imageId"));
  const imageScope = normalizeImageScopeFromForm(formData.get("imageScope"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  if (imageId === null) {
    redirect(
      appendImageScope(`/admin/products/${productId}?image_error=missing_image`, imageScope)
    );
  }

  const validation = validateUpdateProductImageInput({
    altText: formData.get("altText"),
    sortOrder: formData.get("sortOrder"),
    isPrimary: formData.get("isPrimary"),
  });

  if (!validation.ok) {
    redirect(
      appendImageScope(`/admin/products/${productId}?image_error=${validation.code}`, imageScope)
    );
  }

  try {
    const image = await updateAdminProductImage({
      id: imageId,
      productId,
      ...validation.data,
    });

    if (image === null) {
      redirect(
        appendImageScope(`/admin/products/${productId}?image_error=missing_image`, imageScope)
      );
    }
  } catch (error) {
    console.error(error);
    redirect(appendImageScope(`/admin/products/${productId}?image_error=save_failed`, imageScope));
  }

  redirect(appendImageScope(`/admin/products/${productId}?image_status=updated`, imageScope));
}
