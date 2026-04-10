import { withTransaction } from "@/core/db";
import { assertCategoryExists, assertMediaAssetExists } from "./shared";

type SetAdminCategoryImageServiceInput = {
  categoryId: string;
  mediaAssetId: string | null;
};

export async function setAdminCategoryImage(
  input: SetAdminCategoryImageServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertCategoryExists(tx, input.categoryId);
    await assertMediaAssetExists(tx, input.mediaAssetId);

    return tx.category.update({
      where: {
        id: input.categoryId,
      },
      data: {
        primaryImageId: input.mediaAssetId,
      },
      select: {
        id: true,
      },
    });
  });
}
