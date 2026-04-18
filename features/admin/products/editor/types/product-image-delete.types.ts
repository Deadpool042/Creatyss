import type { AdminProductActionResult } from "@/features/admin/products/types";

export type DeleteProductImageInput = {
  productId: string;
  imageId: string;
};

export type DeleteProductImageResult = AdminProductActionResult;
