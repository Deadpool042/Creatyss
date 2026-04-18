import type { AdminProductActionResult } from "@/features/admin/products/types";

export type UpdateProductImageAltTextInput = {
  productId: string;
  imageId: string;
  altText: string;
};

export type UpdateProductImageAltTextResult = AdminProductActionResult;
