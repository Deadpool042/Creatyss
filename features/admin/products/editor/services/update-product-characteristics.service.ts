import type { ValidatedAdminProductCharacteristicInput } from "@/entities/product";
import { withTransaction } from "@/core/db";

import { assertProductExists } from "./shared";

type UpdateProductCharacteristicsServiceInput = {
  productId: string;
  characteristics: readonly ValidatedAdminProductCharacteristicInput[];
};

export async function updateProductCharacteristics(
  input: UpdateProductCharacteristicsServiceInput
): Promise<void> {
  await withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    // Replace strategy: delete all existing, then create all incoming.
    await tx.productCharacteristic.deleteMany({
      where: { productId: input.productId },
    });

    if (input.characteristics.length > 0) {
      await tx.productCharacteristic.createMany({
        data: input.characteristics.map((c, i) => ({
          productId: input.productId,
          label: c.label.trim(),
          value: c.value.trim(),
          sortOrder: c.sortOrder ?? i,
        })),
      });
    }
  });
}
