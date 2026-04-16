"use server";

import { restoreProductBySlugAction } from "@/features/admin/products/shared/actions/restore-product.action";
import type { RestoreProductResult } from "../types";

export async function restoreProductAction(productSlug: string): Promise<RestoreProductResult> {
  return restoreProductBySlugAction(productSlug);
}
