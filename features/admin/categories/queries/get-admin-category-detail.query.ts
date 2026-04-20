import { db } from "@/core/db";
import type { AdminCategoryDetail } from "../types";

type GetAdminCategoryDetailInput = {
  categoryId: string;
};

export async function getAdminCategoryDetail(
  input: GetAdminCategoryDetailInput
): Promise<AdminCategoryDetail | null> {
  const category = await db.category.findFirst({
    where: {
      id: input.categoryId,
      archivedAt: null,
    },
    select: {
      id: true,
      storeId: true,
      name: true,
      slug: true,
      description: true,
      isFeatured: true,
      sortOrder: true,
      updatedAt: true,
      parentId: true,
      parent: {
        select: {
          name: true,
        },
      },
      primaryImageId: true,
      primaryImage: {
        select: {
          publicUrl: true,
        },
      },
    },
  });

  if (category === null) {
    return null;
  }

  const seoMetadata = await db.seoMetadata.findFirst({
    where: {
      storeId: category.storeId,
      subjectType: "CATEGORY",
      subjectId: input.categoryId,
      archivedAt: null,
    },
    select: {
      metaTitle: true,
      metaDescription: true,
      canonicalPath: true,
      indexingMode: true,
      sitemapIncluded: true,
      openGraphTitle: true,
      openGraphDescription: true,
      twitterTitle: true,
      twitterDescription: true,
    },
  });

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    parentName: category.parent?.name ?? null,
    isFeatured: category.isFeatured,
    sortOrder: category.sortOrder,
    primaryImageId: category.primaryImageId,
    primaryImageUrl: category.primaryImage?.publicUrl ?? null,
    updatedAt: category.updatedAt.toISOString(),
    seo: {
      metaTitle: seoMetadata?.metaTitle ?? null,
      metaDescription: seoMetadata?.metaDescription ?? null,
      canonicalPath: seoMetadata?.canonicalPath ?? null,
      indexingMode: seoMetadata?.indexingMode ?? "INDEX_FOLLOW",
      sitemapIncluded: seoMetadata?.sitemapIncluded ?? true,
      openGraphTitle: seoMetadata?.openGraphTitle ?? null,
      openGraphDescription: seoMetadata?.openGraphDescription ?? null,
      twitterTitle: seoMetadata?.twitterTitle ?? null,
      twitterDescription: seoMetadata?.twitterDescription ?? null,
    },
  };
}
