import type { AdminProductActionResult } from "@/features/admin/products/types";

export type BulkDeleteProductsPermanentlyInput = {
  productIds: string[];
};

export type BulkDeleteProductsPermanentlyResult = AdminProductActionResult & {
  deletedCount?: number;
};
