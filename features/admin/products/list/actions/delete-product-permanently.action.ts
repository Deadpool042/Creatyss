"use server";

import { deleteProductPermanentlyBySlugAction } from "@/features/admin/products/shared/actions/delete-product-permanently.action";
import type { DeleteProductPermanentlyInput, DeleteProductPermanentlyResult } from "../types";

export async function deleteProductPermanentlyAction(
  input: DeleteProductPermanentlyInput
): Promise<DeleteProductPermanentlyResult> {
  return deleteProductPermanentlyBySlugAction({
    productSlug: input.productSlug,
  });
}
