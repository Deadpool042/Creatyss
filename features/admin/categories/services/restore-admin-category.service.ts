import { CategoryStatus } from "@/prisma-generated/client";

import { withTransaction } from "@/core/db";
import { assertArchivedCategoryExists } from "./shared";

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
