import type { AdminProductActionResult } from "@/features/admin/products/types";

export type AttachProductImagesInput = {
  images: Array<{
    productId: string;
    mediaAssetId: string;
    subjectType: "product" | "product_variant";
    subjectId: string;
    role: "gallery" | "thumbnail" | "other";
    sortOrder: number;
  }>;
};

export type AttachProductImagesResult = AdminProductActionResult;
