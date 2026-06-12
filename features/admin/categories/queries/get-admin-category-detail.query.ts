import { db } from "@/core/db";
import { mapPrismaCategoryStatusToLifecycleStatus } from "@/entities/category";
import { SEO_INDEXING_MODE_DEFAULT } from "@/entities/seo";
import type { AdminCategoryDetail } from "../types";

type GetAdminCategoryDetailInput = {
  slug: string;
};

export async function getAdminCategoryDetail(
  input: GetAdminCategoryDetailInput
): Promise<AdminCategoryDetail | null> {
  const categorySelect = {
    id: true,
    storeId: true,
    name: true,
    slug: true,
    status: true,
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
  } as const;

  const category =
    (await db.category.findFirst({
      where: {
        slug: input.slug,
        archivedAt: null,
      },
      select: categorySelect,
    })) ??
    (await db.category.findFirst({
      where: {
        slug: input.slug,
        archivedAt: { not: null },
      },
      select: categorySelect,
    }));

  if (category === null) {
    return null;
  }

  const seoMetadata = await db.seoMetadata.findFirst({
    where: {
      storeId: category.storeId,
      subjectType: "CATEGORY",
      subjectId: category.id,
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
    status: mapPrismaCategoryStatusToLifecycleStatus(category.status),
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
      indexingMode: seoMetadata?.indexingMode ?? SEO_INDEXING_MODE_DEFAULT,
      sitemapIncluded: seoMetadata?.sitemapIncluded ?? true,
      openGraphTitle: seoMetadata?.openGraphTitle ?? null,
      openGraphDescription: seoMetadata?.openGraphDescription ?? null,
      twitterTitle: seoMetadata?.twitterTitle ?? null,
      twitterDescription: seoMetadata?.twitterDescription ?? null,
    },
  };
}
