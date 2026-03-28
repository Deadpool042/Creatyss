import type { DbClient } from "../shared/db";
import type { ImportedProductInput } from "./product.types";

export async function createProduct(
  prisma: DbClient,
  storeId: string,
  input: ImportedProductInput
) {
  return prisma.product.create({
    data: {
      storeId,
      productTypeId: input.productTypeId,
      slug: input.slug,
      name: input.name,
      skuRoot: input.skuRoot,
      shortDescription: input.shortDescription,
      description: input.description,
      status: input.status,
      isFeatured: input.isFeatured,
      isStandalone: input.isStandalone,
      publishedAt: input.publishedAt,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      productTypeId: true,
    },
  });
}

export async function setProductPrimaryImage(
  prisma: DbClient,
  productId: string,
  primaryImageId: string | null
) {
  return prisma.product.update({
    where: {
      id: productId,
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
