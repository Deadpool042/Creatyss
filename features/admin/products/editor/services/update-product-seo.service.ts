import { withTransaction } from "@/core/db";
import type { SeoIndexingMode } from "@/prisma-generated/client";

import { assertProductExists } from "./shared";

type UpdateProductSeoServiceInput = {
  productId: string;
  title: string;
  description: string;
  canonicalPath: string | null;
  indexingMode: SeoIndexingMode;
  sitemapIncluded: boolean;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageId: string | null;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageId: string | null;
};

export async function updateProductSeo(
  input: UpdateProductSeoServiceInput
): Promise<{ productId: string }> {
  return withTransaction(async (tx) => {
    const product = await assertProductExists(tx, input.productId);

    const toNullable = (value: string) => (value.trim().length === 0 ? null : value.trim());

    await tx.seoMetadata.upsert({
      where: {
        storeId_subjectType_subjectId: {
          storeId: product.storeId,
          subjectType: "PRODUCT",
          subjectId: input.productId,
        },
      },
      update: {
        metaTitle: toNullable(input.title),
        metaDescription: toNullable(input.description),
        canonicalPath: input.canonicalPath,
        indexingMode: input.indexingMode,
        sitemapIncluded: input.sitemapIncluded,
        openGraphTitle: toNullable(input.openGraphTitle),
        openGraphDescription: toNullable(input.openGraphDescription),
        openGraphImageId: input.openGraphImageId,
        twitterTitle: toNullable(input.twitterTitle),
        twitterDescription: toNullable(input.twitterDescription),
        twitterImageId: input.twitterImageId,
      },
      create: {
        storeId: product.storeId,
        subjectType: "PRODUCT",
        subjectId: input.productId,
        metaTitle: toNullable(input.title),
        metaDescription: toNullable(input.description),
        canonicalPath: input.canonicalPath,
        indexingMode: input.indexingMode,
        sitemapIncluded: input.sitemapIncluded,
        openGraphTitle: toNullable(input.openGraphTitle),
        openGraphDescription: toNullable(input.openGraphDescription),
        openGraphImageId: input.openGraphImageId,
        twitterTitle: toNullable(input.twitterTitle),
        twitterDescription: toNullable(input.twitterDescription),
        twitterImageId: input.twitterImageId,
      },
    });

    return { productId: input.productId };
  });
}
