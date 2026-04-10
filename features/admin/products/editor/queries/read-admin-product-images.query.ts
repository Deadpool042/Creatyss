import type { AdminProductImagesData } from "../types";
import { getAdminProductEditorData } from "./get-admin-product-editor-data.query";

export async function readAdminProductImages(
  productId: string
): Promise<AdminProductImagesData | null> {
  const editorData = await getAdminProductEditorData({
    productId,
  });

  if (editorData === null) {
    return null;
  }

  return {
    productId: editorData.product.id,
    productSlug: editorData.product.slug,
    primaryImageId: editorData.product.primaryImageId,
    images: [...editorData.images],
  };
}
