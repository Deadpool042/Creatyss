import { ProductVariantStatus } from "../../../src/generated/prisma/client";
import type { DbClient } from "../shared/db";
import type { ImportedVariantInput } from "./variant.types";

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
    },
  });
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
