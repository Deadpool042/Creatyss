"use server";

import { redirect } from "next/navigation";
import { deleteAdminPrimaryProductImage } from "@/db/repositories/admin-product-image.repository";
import { appendImageScope, normalizeNumericIdFromForm } from "./action-helpers";

type ProductPrimaryImageDeleteErrorCode = "delete_failed" | "missing_image";

function redirectToProductPrimaryImageError(
  productId: string,
  code: ProductPrimaryImageDeleteErrorCode
): never {
  redirect(appendImageScope(`/admin/products/${productId}?image_error=${code}`, "product"));
}

function redirectToProductPrimaryImageStatus(productId: string, status: "primary_deleted"): never {
  redirect(appendImageScope(`/admin/products/${productId}?image_status=${status}`, "product"));
}

export async function deleteProductPrimaryImageAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  try {
    const wasDeleted = await deleteAdminPrimaryProductImage(productId);

    if (!wasDeleted) {
      redirectToProductPrimaryImageError(productId, "missing_image");
    }
  } catch (error) {
    console.error(error);
    redirectToProductPrimaryImageError(productId, "delete_failed");
  }

  redirectToProductPrimaryImageStatus(productId, "primary_deleted");
}
