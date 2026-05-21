import { CategoryStatus } from "@/prisma-generated/client";

import { withTransaction } from "@/core/db";

type BulkDeleteAdminCategoriesInput = {
  categoryIds: string[];
};

type BulkDeleteAdminCategoriesResult = {
  count: number;
};

export async function bulkDeleteAdminCategories(
  input: BulkDeleteAdminCategoriesInput
): Promise<BulkDeleteAdminCategoriesResult> {
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
