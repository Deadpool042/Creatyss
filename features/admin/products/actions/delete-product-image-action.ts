"use server";

import { redirect } from "next/navigation";
import { deleteAdminProductImage } from "@/db/repositories/admin-product-image.repository";
import {
  appendImageScope,
  normalizeImageScopeFromForm,
  normalizeNumericIdFromForm,
} from "@/features/admin/products/actions/action-helpers";

export async function deleteProductImageAction(formData: FormData): Promise<void> {
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

  try {
    const wasDeleted = await deleteAdminProductImage(productId, imageId);

    if (!wasDeleted) {
      redirect(
        appendImageScope(`/admin/products/${productId}?image_error=missing_image`, imageScope)
      );
    }
  } catch (error) {
    console.error(error);
    redirect(
      appendImageScope(`/admin/products/${productId}?image_error=delete_failed`, imageScope)
    );
  }

  redirect(appendImageScope(`/admin/products/${productId}?image_status=deleted`, imageScope));
}
