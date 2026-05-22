import { CategoryStatus } from "@/prisma-generated/client";

import { withTransaction } from "@/core/db";
import { assertCategoryExists, assertArchivedCategoryExists } from "./shared";

// ---------------------------------------------------------------------------
// archiveAdminCategory
// ---------------------------------------------------------------------------

type ArchiveAdminCategoryServiceInput = {
  categoryId: string;
};

export async function archiveAdminCategory(
  input: ArchiveAdminCategoryServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertCategoryExists(tx, input.categoryId);

    return tx.category.update({
      where: {
        id: input.categoryId,
      },
      data: {
        status: CategoryStatus.ARCHIVED,
        archivedAt: new Date(),
      },
      select: {
        id: true,
      },
    });
  });
}

// ---------------------------------------------------------------------------
// archiveAdminCategories
// ---------------------------------------------------------------------------

type ArchiveAdminCategoriesInput = {
  categoryIds: string[];
};

type ArchiveAdminCategoriesResult = {
  count: number;
};

export async function archiveAdminCategories(
  input: ArchiveAdminCategoriesInput
): Promise<ArchiveAdminCategoriesResult> {
  if (input.categoryIds.length === 0) return { count: 0 };

  return withTransaction(async (tx) => {
    const result = await tx.category.updateMany({
      where: {
        id: { in: input.categoryIds },
        archivedAt: null,
      },
      data: {
        status: CategoryStatus.ARCHIVED,
        archivedAt: new Date(),
      },
    });

    return { count: result.count };
  });
}

// ---------------------------------------------------------------------------
// restoreAdminCategory
// ---------------------------------------------------------------------------

export async function restoreAdminCategory(input: {
  categoryId: string;
}): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertArchivedCategoryExists(tx, input.categoryId);

    return tx.category.update({
      where: {
        id: input.categoryId,
      },
      data: {
        status: CategoryStatus.DRAFT,
        archivedAt: null,
      },
      select: { id: true },
    });
  });
}

// ---------------------------------------------------------------------------
// hardDeleteAdminCategory
// ---------------------------------------------------------------------------

export async function hardDeleteAdminCategory(input: {
  categoryId: string;
}): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertArchivedCategoryExists(tx, input.categoryId);

    return tx.category.delete({
      where: {
        id: input.categoryId,
      },
      select: { id: true },
    });
  });
}
