import type { AdminProductActionResult } from "@/features/admin/products/types";

export type DeleteProductVariantInput = {
  productId: string;
  variantId: string;
};

export type DeleteProductVariantResult = AdminProductActionResult;
