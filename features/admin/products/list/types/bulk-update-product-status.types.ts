import type { AdminProductActionResult } from "@/features/admin/products/types";

export type BulkUpdateProductStatusInput = {
  productIds: string[];
  status: "draft" | "active" | "inactive" | "archived";
};

export type BulkUpdateProductStatusResult = AdminProductActionResult & {
  updatedCount?: number;
};
