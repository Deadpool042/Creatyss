import type { DbExecutor } from "@/core/db";

import { AdminProductEditorServiceError } from "./error";

function normalizeOptionValueIds(input: readonly string[]): string[] {
  // Defensive: form submissions can include duplicates / ordering differences.
  return Array.from(new Set(input.map((id) => id.trim()).filter((id) => id.length > 0))).sort();
}

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

export async function assertVariantAxisCombinationIsUnique(
  executor: DbExecutor,
  input: {
    productId: string;
    optionValueIds: readonly string[];
    excludeVariantId?: string | null;
  }
): Promise<void> {
  const normalized = normalizeOptionValueIds(input.optionValueIds);
  const key = normalized.join("|");

  const variants = await executor.productVariant.findMany({
    where: {
      productId: input.productId,
      archivedAt: null,
      ...(input.excludeVariantId ? { id: { not: input.excludeVariantId } } : {}),
    },
    select: {
      id: true,
      optionValues: {
        select: {
          optionValueId: true,
          optionValue: {
            select: {
              option: {
                select: {
                  isVariantAxis: true,
                },
              },
            },
          },
        },
      },
    },
  });

  for (const variant of variants) {
    const existingAxisIds = normalizeOptionValueIds(
      variant.optionValues
        .filter((ov) => ov.optionValue.option.isVariantAxis)
        .map((ov) => ov.optionValueId)
    );

    if (existingAxisIds.join("|") === key) {
      throw new AdminProductEditorServiceError("duplicate_variant_option_combination");
    }
  }
}

export async function assertDefaultVariantWouldRemain(
  executor: DbExecutor,
  input: {
    productId: string;
    excludeVariantId: string;
  }
): Promise<void> {
  const otherDefault = await executor.productVariant.findFirst({
    where: {
      productId: input.productId,
      archivedAt: null,
      id: {
        not: input.excludeVariantId,
      },
      isDefault: true,
    },
    select: {
      id: true,
    },
  });

  if (otherDefault === null) {
    throw new AdminProductEditorServiceError("default_variant_required");
  }
}

export async function ensureDefaultVariantExists(
  executor: DbExecutor,
  input: {
    productId: string;
  }
): Promise<void> {
  const existingDefault = await executor.productVariant.findFirst({
    where: {
      productId: input.productId,
      archivedAt: null,
      isDefault: true,
    },
    select: {
      id: true,
    },
  });

  if (existingDefault !== null) {
    return;
  }

  const candidate = await executor.productVariant.findFirst({
    where: {
      productId: input.productId,
      archivedAt: null,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });

  if (candidate === null) {
    return;
  }

  await executor.productVariant.update({
    where: { id: candidate.id },
    data: { isDefault: true },
    select: { id: true },
  });
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
