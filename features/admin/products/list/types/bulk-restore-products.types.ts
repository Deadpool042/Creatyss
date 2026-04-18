import type { AdminProductActionResult } from "@/features/admin/products/types";

export type BulkRestoreProductsInput = {
  productIds: string[];
};

export type BulkRestoreProductsResult = AdminProductActionResult & {
  updatedCount?: number;
};
