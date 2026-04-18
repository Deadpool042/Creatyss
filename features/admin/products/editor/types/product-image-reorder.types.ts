import type { AdminProductActionResult } from "@/features/admin/products/types";

export type ProductImageReorderDirection = "up" | "down";

export type ReorderProductImageInput = {
  productId: string;
  imageId: string;
  sortOrder: number;
};

export type ReorderProductImageResult = AdminProductActionResult;
