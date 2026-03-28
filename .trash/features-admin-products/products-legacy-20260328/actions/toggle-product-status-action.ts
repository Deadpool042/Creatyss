"use server";

import { redirect } from "next/navigation";
import {
  findAdminProductPublishContext,
  toggleAdminProductStatus,
} from "@/db/repositories/products/admin-product.repository";
import { getProductPublishability } from "@/entities/product/product-publishability";
import { normalizeNumericIdFromForm } from "@/features/admin/products/actions/action-helpers";

export async function toggleProductStatusAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const context = await findAdminProductPublishContext(productId);

  if (context === null) {
    redirect("/admin/products?error=missing_product");
  }

  // If toggling draft → published, validate publishability first
  if (context.status === "draft") {
    const publishability = getProductPublishability(context.productType, context.variantCount);

    if (!publishability.ok) {
      redirect(`/admin/products/${productId}?product_error=${publishability.code}`);
    }
  }

  const newStatus = await toggleAdminProductStatus(productId);

  if (newStatus === null) {
    redirect("/admin/products?error=missing_product");
  }

  redirect(`/admin/products/${productId}?product_status=updated`);
}
