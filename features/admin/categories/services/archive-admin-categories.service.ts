import { CategoryStatus } from "@/prisma-generated/client";

import { withTransaction } from "@/core/db";

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
