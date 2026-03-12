"use server";

import { redirect } from "next/navigation";
import { deleteAdminPrimaryProductImage } from "@/db/repositories/admin-product-image.repository";
import { appendImageScope, normalizeNumericIdFromForm } from "./action-helpers";

export async function deleteProductPrimaryImageAction(
  formData: FormData
): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  try {
    const wasDeleted = await deleteAdminPrimaryProductImage(productId);

    if (!wasDeleted) {
      redirect(
        appendImageScope(
          `/admin/products/${productId}?image_error=missing_image`,
          "product"
        )
      );
    }
  } catch (error) {
    console.error(error);
    redirect(
      appendImageScope(
        `/admin/products/${productId}?image_error=delete_failed`,
        "product"
      )
    );
  }

  redirect(
    appendImageScope(
      `/admin/products/${productId}?image_status=primary_deleted`,
      "product"
    )
  );
}
