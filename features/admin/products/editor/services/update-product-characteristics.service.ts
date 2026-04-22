import { db, withTransaction } from "@/core/db";

import { AdminProductEditorServiceError } from "./shared";

type CharacteristicInput = {
  id: string | null;
  label: string;
  value: string;
  sortOrder: number;
};

type UpdateProductCharacteristicsServiceInput = {
  productId: string;
  characteristics: readonly CharacteristicInput[];
};

export async function updateProductCharacteristics(
  input: UpdateProductCharacteristicsServiceInput
): Promise<void> {
  const product = await db.product.findFirst({
    where: { id: input.productId, archivedAt: null },
    select: { id: true },
  });

  if (product === null) {
    throw new AdminProductEditorServiceError("product_missing");
  }

  // Replace strategy: delete all existing, then create all incoming.
  await withTransaction(async (tx) => {
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
