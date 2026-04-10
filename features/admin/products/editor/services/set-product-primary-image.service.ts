import { withTransaction } from "@/core/db";
import {
  assertMediaAssetExists,
  assertProductExists,
} from "./shared";

type SetProductPrimaryImageServiceInput = {
  productId: string;
  mediaAssetId: string | null;
};

export async function setProductPrimaryImage(
  input: SetProductPrimaryImageServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    if (input.mediaAssetId !== null) {
      await assertMediaAssetExists(tx, input.mediaAssetId);
    }

    return tx.product.update({
      where: {
        id: input.productId,
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
