import type { AdminProductActionResult } from "@/features/admin/products/types";

export type BulkArchiveProductsInput = {
  productIds: string[];
};

export type BulkArchiveProductsResult = AdminProductActionResult & {
  updatedCount?: number;
};
