import { db } from "@/core/db";

import {
  PRODUCT_EDITOR_CORE_SELECT,
  PRODUCT_EDITOR_MEDIA_REFERENCE_SELECT,
  PRODUCT_EDITOR_SEO_METADATA_SELECT,
} from "./selects";
import type {
  ProductEditorCoreRecord,
  ProductEditorMediaReferenceRecord,
  ProductEditorSeoMetadataRecord,
} from "./types";

export async function readProductEditorCore(
  productId: string
): Promise<ProductEditorCoreRecord | null> {
  const product = await db.product.findFirst({
    where: {
      id: productId,
    },
    select: PRODUCT_EDITOR_CORE_SELECT,
  });

  if (product === null) {
    return null;
  }

  return {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      availabilityRecords: variant.availabilityRecords.filter(
        (record) => record.storeId === product.storeId
      ),
      inventoryItems: variant.inventoryItems.filter(
        (item) => item.storeId === product.storeId
      ),
    })),
  };
}

export async function readProductEditorSideData(input: {
  storeId: string;
  productId: string;
  variantIds: string[];
}): Promise<{
  mediaReferences: ProductEditorMediaReferenceRecord[];
  seoMetadata: ProductEditorSeoMetadataRecord;
}> {
  const [mediaReferences, seoMetadata] = await Promise.all([
    db.mediaReference.findMany({
      where: {
        archivedAt: null,
        OR: [
          {
            subjectType: "PRODUCT",
            subjectId: input.productId,
          },
          {
            subjectType: "PRODUCT_VARIANT",
            subjectId: {
              in: input.variantIds,
            },
          },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: PRODUCT_EDITOR_MEDIA_REFERENCE_SELECT,
    }),
    db.seoMetadata.findFirst({
      where: {
        storeId: input.storeId,
        subjectType: "PRODUCT",
        subjectId: input.productId,
        archivedAt: null,
      },
      select: PRODUCT_EDITOR_SEO_METADATA_SELECT,
    }),
  ]);

  return {
    mediaReferences,
    seoMetadata,
  };
}
