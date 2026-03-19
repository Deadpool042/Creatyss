"use server";

import { redirect } from "next/navigation";
import {
  AdminProductRepositoryError,
  deleteAdminProduct,
} from "@/db/repositories/admin-product.repository";
import { normalizeNumericIdFromForm } from "@/features/admin/products/actions/action-helpers";

export async function deleteProductAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  try {
    const wasDeleted = await deleteAdminProduct(productId);

    if (!wasDeleted) {
      redirect("/admin/products?error=missing_product");
    }
  } catch (error) {
    if (error instanceof AdminProductRepositoryError && error.code === "product_referenced") {
      redirect(`/admin/products/${productId}?delete_error=referenced`);
    }

    console.error(error);
    redirect(`/admin/products/${productId}?delete_error=delete_failed`);
  }

  redirect("/admin/products?status=deleted");
}
