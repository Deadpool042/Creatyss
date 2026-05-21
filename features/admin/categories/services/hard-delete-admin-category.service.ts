import { db } from "@/core/db";

export async function hardDeleteAdminCategory(input: {
  categoryId: string;
}): Promise<{ id: string }> {
  return db.category.delete({
    where: {
      id: input.categoryId,
      archivedAt: { not: null },
    },
    select: { id: true },
  });
}
