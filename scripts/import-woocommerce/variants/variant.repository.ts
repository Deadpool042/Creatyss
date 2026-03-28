import { ProductVariantStatus } from "../../../src/generated/prisma/client";
import type { DbClient } from "../shared/db";
import type { ImportedVariantInput } from "./variant.types";

export async function findVariantBySku(
  prisma: DbClient,
  input: {
    productId: string;
    sku: string;
  }
) {
  return prisma.productVariant.findFirst({
    where: {
      productId: input.productId,
      sku: input.sku,
    },
    select: {
      id: true,
      sku: true,
      primaryImageId: true,
      isDefault: true,
    },
  });
}

export async function createVariant(
  prisma: DbClient,
  input: {
    productId: string;
    variant: ImportedVariantInput;
  }
) {
  return prisma.productVariant.create({
    data: {
      productId: input.productId,
      sku: input.variant.sku,
      slug: input.variant.slug,
      name: input.variant.name,
      status: input.variant.status,
      isDefault: input.variant.isDefault,
      sortOrder: input.variant.sortOrder,
      externalReference: input.variant.externalReference,
      publishedAt: input.variant.status === ProductVariantStatus.ACTIVE ? new Date() : null,
    },
    select: {
      id: true,
      sku: true,
      isDefault: true,
      primaryImageId: true,
    },
  });
}

export async function updateVariant(
  prisma: DbClient,
  variantId: string,
  input: ImportedVariantInput
) {
  return prisma.productVariant.update({
    where: {
      id: variantId,
    },
    data: {
      slug: input.slug,
      name: input.name,
      status: input.status,
      isDefault: input.isDefault,
      sortOrder: input.sortOrder,
      externalReference: input.externalReference,
      publishedAt: input.status === ProductVariantStatus.ACTIVE ? new Date() : null,
    },
    select: {
      id: true,
      sku: true,
      isDefault: true,
      primaryImageId: true,
    },
  });
}

export async function upsertImportedVariant(
  prisma: DbClient,
  input: {
    productId: string;
    variant: ImportedVariantInput;
  }
) {
  const existing = await findVariantBySku(prisma, {
    productId: input.productId,
    sku: input.variant.sku,
  });

  if (existing) {
    return updateVariant(prisma, existing.id, input.variant);
  }

  return createVariant(prisma, input);
}

export async function setVariantPrimaryImage(
  prisma: DbClient,
  variantId: string,
  primaryImageId: string | null
) {
  return prisma.productVariant.update({
    where: {
      id: variantId,
    },
    data: {
      primaryImageId,
    },
    select: {
      id: true,
      primaryImageId: true,
    },
  });
}
