"use server";

import { archiveProductBySlugAction } from "@/features/admin/products/shared/actions/archive-product.action";
import type { ArchiveProductResult } from "../types";

export async function archiveProductAction(productSlug: string): Promise<ArchiveProductResult> {
  return archiveProductBySlugAction(productSlug);
}
