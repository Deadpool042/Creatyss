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

async function replaceVariantOptionValueLinks(
  prisma: DbClient,
  input: {
    variantId: string;
    optionValueIds: readonly string[];
  }
) {
  await prisma.productVariantOptionValue.deleteMany({
    where: {
      variantId: input.variantId,
    },
  });

  if (input.optionValueIds.length === 0) {
    return;
  }

  await prisma.productVariantOptionValue.createMany({
    data: input.optionValueIds.map((optionValueId) => ({
      variantId: input.variantId,
      optionValueId,
    })),
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
  if (input.productTypeId === null) {
    await prisma.productVariantOptionValue.deleteMany({
      where: {
        variantId: input.variantId,
      },
    });
    return;
  }

  if (input.selections.length === 0) {
    await prisma.productVariantOptionValue.deleteMany({
      where: {
        variantId: input.variantId,
      },
    });
    return;
  }

  const optionValueIds: string[] = [];

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

    optionValueIds.push(optionValue.id);
  }

  await replaceVariantOptionValueLinks(prisma, {
    variantId: input.variantId,
    optionValueIds,
  });
}
