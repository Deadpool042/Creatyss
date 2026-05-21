import { CategoryStatus } from "@/prisma-generated/client";

import { db } from "@/core/db";

export async function restoreAdminCategory(input: {
  categoryId: string;
}): Promise<{ id: string }> {
  return db.category.update({
    where: {
      id: input.categoryId,
      archivedAt: { not: null },
    },
    data: {
      status: CategoryStatus.DRAFT,
      archivedAt: null,
    },
    select: { id: true },
  });
}
