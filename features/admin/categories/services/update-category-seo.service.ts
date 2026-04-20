import { withTransaction } from "@/core/db";
import type { SeoIndexingMode } from "@/prisma-generated/client";

import { AdminCategoryServiceError } from "../types";

type UpdateCategorySeoServiceInput = {
  categoryId: string;
  title: string;
  description: string;
  canonicalPath: string | null;
  indexingMode: SeoIndexingMode;
  sitemapIncluded: boolean;
  openGraphTitle: string;
  openGraphDescription: string;
  twitterTitle: string;
  twitterDescription: string;
};

export async function updateCategorySeo(
  input: UpdateCategorySeoServiceInput
): Promise<{ categoryId: string }> {
  return withTransaction(async (tx) => {
    const category = await tx.category.findFirst({
      where: {
        id: input.categoryId,
        archivedAt: null,
      },
      select: {
        id: true,
        storeId: true,
      },
    });

    if (category === null) {
      throw new AdminCategoryServiceError("category_missing");
    }

    const toNullable = (value: string) => (value.trim().length === 0 ? null : value.trim());

    await tx.seoMetadata.upsert({
      where: {
        storeId_subjectType_subjectId: {
          storeId: category.storeId,
          subjectType: "CATEGORY",
          subjectId: input.categoryId,
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
        twitterTitle: toNullable(input.twitterTitle),
        twitterDescription: toNullable(input.twitterDescription),
      },
      create: {
        storeId: category.storeId,
        subjectType: "CATEGORY",
        subjectId: input.categoryId,
        metaTitle: toNullable(input.title),
        metaDescription: toNullable(input.description),
        canonicalPath: input.canonicalPath,
        indexingMode: input.indexingMode,
        sitemapIncluded: input.sitemapIncluded,
        openGraphTitle: toNullable(input.openGraphTitle),
        openGraphDescription: toNullable(input.openGraphDescription),
        twitterTitle: toNullable(input.twitterTitle),
        twitterDescription: toNullable(input.twitterDescription),
      },
    });

    return { categoryId: input.categoryId };
  });
}
