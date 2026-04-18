import type { AdminProductActionResult } from "@/features/admin/products/types";

export type SetProductPrimaryImageInput = {
  productId: string;
  mediaAssetId: string | null;
};

export type SetProductPrimaryImageResult = AdminProductActionResult;
