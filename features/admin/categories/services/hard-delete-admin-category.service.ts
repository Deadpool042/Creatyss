import { withTransaction } from "@/core/db";
import { assertArchivedCategoryExists } from "./shared";

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
