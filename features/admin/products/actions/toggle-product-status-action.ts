"use server";

import { redirect } from "next/navigation";
import { toggleAdminProductStatus } from "@/db/repositories/admin-product.repository";
import { normalizeNumericIdFromForm } from "@/features/admin/products/actions/action-helpers";

export async function toggleProductStatusAction(
  formData: FormData
): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const newStatus = await toggleAdminProductStatus(productId);

  if (newStatus === null) {
    redirect("/admin/products?error=missing_product");
  }

  redirect(`/admin/products/${productId}?product_status=updated`);
}
