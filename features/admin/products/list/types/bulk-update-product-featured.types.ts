import type { AdminProductActionResult } from "@/features/admin/products/types";

export type BulkUpdateProductFeaturedInput = {
  productIds: string[];
  isFeatured: boolean;
};

export type BulkUpdateProductFeaturedResult = AdminProductActionResult & {
  updatedCount?: number;
};
