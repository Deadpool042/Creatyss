import type { DbClient } from "../shared/db";
import type { ImportedVariantOptionSelectionInput } from "./variant.types";

async function ensureProductOption(
  prisma: DbClient,
  input: {
    productTypeId: string;
    code: string;
    name: string;
    sortOrder: number;
  }
) {
  const existing = await prisma.productOption.findFirst({
    where: {
      productTypeId: input.productTypeId,
      code: input.code,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.productOption.create({
    data: {
      productTypeId: input.productTypeId,
      code: input.code,
      name: input.name,
      sortOrder: input.sortOrder,
      isRequired: false,
      isVariantAxis: true,
      isActive: true,
    },
    select: {
      id: true,
    },
  });
}

async function ensureProductOptionValue(
  prisma: DbClient,
  input: {
    optionId: string;
    code: string;
    value: string;
    label: string | null;
    sortOrder: number;
  }
) {
  const existing = await prisma.productOptionValue.findFirst({
    where: {
      optionId: input.optionId,
      code: input.code,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.productOptionValue.create({
    data: {
      optionId: input.optionId,
      code: input.code,
      value: input.value,
      label: input.label,
      sortOrder: input.sortOrder,
      isActive: true,
    },
    select: {
      id: true,
    },
  });
}

async function ensureVariantOptionValueLink(
  prisma: DbClient,
  input: {
    variantId: string;
    optionValueId: string;
  }
) {
  const existing = await prisma.productVariantOptionValue.findFirst({
    where: {
      variantId: input.variantId,
      optionValueId: input.optionValueId,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.productVariantOptionValue.create({
    data: {
      variantId: input.variantId,
      optionValueId: input.optionValueId,
    },
    select: {
      id: true,
    },
  });
}

export async function syncVariantOptionSelections(
  prisma: DbClient,
  input: {
    productTypeId: string | null;
    variantId: string;
    selections: readonly ImportedVariantOptionSelectionInput[];
  }
): Promise<void> {
  if (input.productTypeId === null || input.selections.length === 0) {
    return;
  }

  for (const [index, selection] of input.selections.entries()) {
    const option = await ensureProductOption(prisma, {
      productTypeId: input.productTypeId,
      code: selection.optionCode,
      name: selection.optionName,
      sortOrder: index,
    });

    const optionValue = await ensureProductOptionValue(prisma, {
      optionId: option.id,
      code: selection.valueCode,
      value: selection.valueName,
      label: selection.valueName,
      sortOrder: index,
    });

    await ensureVariantOptionValueLink(prisma, {
      variantId: input.variantId,
      optionValueId: optionValue.id,
    });
  }
}
