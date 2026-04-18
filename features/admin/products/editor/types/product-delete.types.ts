//features/admin/products/editor/types/product-delete.types.ts

import type { AdminProductActionResult } from "@/features/admin/products/types";

export type DeleteProductInput = {
  productId: string;
};

export type DeleteProductResult = AdminProductActionResult;
