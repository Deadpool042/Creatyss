import type { DbExecutor } from "@/core/db";

import { AdminProductEditorServiceError } from "./error";

export async function assertVariantExists(
  executor: DbExecutor,
  productId: string,
  variantId: string
): Promise<{
  id: string;
  productId: string;
  isDefault: boolean;
}> {
  const variant = await executor.productVariant.findFirst({
    where: {
      id: variantId,
      productId,
      archivedAt: null,
    },
    select: {
      id: true,
      productId: true,
      isDefault: true,
    },
  });

  if (variant === null) {
    throw new AdminProductEditorServiceError("variant_missing");
  }

  return variant;
}

export async function assertVariantOptionValuesAreValid(
  executor: DbExecutor,
  productId: string,
  optionValueIds: readonly string[]
): Promise<void> {
  if (optionValueIds.length === 0) return;

  const product = await executor.product.findFirst({
    where: { id: productId, archivedAt: null },
    select: { productTypeId: true },
  });

  if (product === null) {
    throw new AdminProductEditorServiceError("product_missing");
  }

  if (product.productTypeId === null) {
    throw new AdminProductEditorServiceError("option_values_invalid");
  }

  const values = await executor.productOptionValue.findMany({
    where: {
      id: { in: [...optionValueIds] },
      isActive: true,
      archivedAt: null,
    },
    select: {
      id: true,
      option: {
        select: {
          isVariantAxis: true,
          isActive: true,
          archivedAt: true,
          productTypeId: true,
        },
      },
    },
  });

  if (values.length !== optionValueIds.length) {
    throw new AdminProductEditorServiceError("option_values_invalid");
  }

  for (const value of values) {
    if (
      !value.option.isVariantAxis ||
      !value.option.isActive ||
      value.option.archivedAt !== null ||
      value.option.productTypeId !== product.productTypeId
    ) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }
  }
}
