import { CategoryStatus } from "@/prisma-generated/client";

import { withTransaction } from "@/core/db";
import { assertCategoryExists } from "./shared";

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
