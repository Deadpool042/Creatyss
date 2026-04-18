import type { AdminProductActionResult } from "@/features/admin/products/types";

export type SetDefaultProductVariantInput = {
  productId: string;
  variantId: string;
};

export type SetDefaultProductVariantResult = AdminProductActionResult;
