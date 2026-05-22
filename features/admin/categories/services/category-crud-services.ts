import { CategoryStatus, type SeoIndexingMode } from "@/prisma-generated/client";

import { withTransaction } from "@/core/db";
import { AdminCategoryServiceError } from "../types";
import {
  assertCategoryExists,
  assertParentCategoryExists,
  assertMediaAssetExists,
} from "./shared";

// ---------------------------------------------------------------------------
// createAdminCategory
// ---------------------------------------------------------------------------

type CreateAdminCategoryServiceInput = {
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  primaryImageId: string | null;
  isFeatured: boolean;
  sortOrder: number;
};

export async function createAdminCategory(
  input: CreateAdminCategoryServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertParentCategoryExists(tx, input.parentId);
    await assertMediaAssetExists(tx, input.primaryImageId);

    const store = await tx.store.findFirst({
      where: {
        archivedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
      },
    });

    if (store === null) {
      throw new AdminCategoryServiceError("store_missing");
    }

    const existing = await tx.category.findFirst({
      where: {
        storeId: store.id,
        slug: input.slug,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (existing !== null) {
      throw new AdminCategoryServiceError("category_slug_taken");
    }

    return tx.category.create({
      data: {
        storeId: store.id,
        code: input.slug,
        slug: input.slug,
        name: input.name,
        shortDescription: null,
        description: input.description,
        status: CategoryStatus.DRAFT,
        parentId: input.parentId,
        primaryImageId: input.primaryImageId,
        isFeatured: input.isFeatured,
        sortOrder: input.sortOrder,
      },
      select: {
        id: true,
      },
    });
  });
}

// ---------------------------------------------------------------------------
// updateAdminCategory
// ---------------------------------------------------------------------------

type UpdateAdminCategoryServiceInput = {
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  primaryImageId: string | null;
  isFeatured: boolean;
  sortOrder: number;
};

export async function updateAdminCategory(
  input: UpdateAdminCategoryServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertCategoryExists(tx, input.categoryId);
    await assertParentCategoryExists(tx, input.parentId);
    await assertMediaAssetExists(tx, input.primaryImageId);

    if (input.parentId === input.categoryId) {
      throw new AdminCategoryServiceError("invalid_parent_assignment");
    }

    const existing = await tx.category.findFirst({
      where: {
        slug: input.slug,
        archivedAt: null,
        id: {
          not: input.categoryId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existing !== null) {
      throw new AdminCategoryServiceError("category_slug_taken");
    }

    return tx.category.update({
      where: {
        id: input.categoryId,
      },
      data: {
        code: input.slug,
        slug: input.slug,
        name: input.name,
        description: input.description,
        parentId: input.parentId,
        primaryImageId: input.primaryImageId,
        isFeatured: input.isFeatured,
        sortOrder: input.sortOrder,
      },
      select: {
        id: true,
      },
    });
  });
}

// ---------------------------------------------------------------------------
// updateCategorySeo
// ---------------------------------------------------------------------------

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
