import type { AdminProductVariantEditorData } from "../types";
import { getAdminProductEditorData } from "./get-admin-product-editor-data.query";

export async function readAdminProductVariants(
  productId: string
): Promise<AdminProductVariantEditorData | null> {
  const editorData = await getAdminProductEditorData({
    productId,
  });

  if (editorData === null) {
    return null;
  }

  return {
    productId: editorData.product.id,
    productSlug: editorData.product.slug,
    variants: [...editorData.variants],
  };
}
