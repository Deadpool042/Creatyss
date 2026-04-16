import type { AdminProductEditorData } from "@/features/admin/products/editor/types";

import { mapProductEditorData } from "./get-admin-product-editor-data/mappers";
import {
  readProductEditorCore,
  readProductEditorSideData,
} from "./get-admin-product-editor-data/readers";

type GetAdminProductEditorDataInput = {
  productId: string;
};

export async function getAdminProductEditorData(
  input: GetAdminProductEditorDataInput
): Promise<AdminProductEditorData | null> {
  const product = await readProductEditorCore(input.productId);

  if (product === null) {
    return null;
  }

  const { mediaReferences, seoMetadata } = await readProductEditorSideData({
    storeId: product.storeId,
    productId: product.id,
    variantIds: product.variants.map((variant) => variant.id),
  });

  return mapProductEditorData({
    product,
    mediaReferences,
    seoMetadata,
  });
}
