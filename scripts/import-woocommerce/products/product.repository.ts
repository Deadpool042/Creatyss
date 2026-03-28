import type { DbClient } from "../shared/db";
import type { ImportedProductInput } from "./product.types";

export async function findProductBySlug(
  prisma: DbClient,
  input: {
    storeId: string;
    slug: string;
  }
) {
  return prisma.product.findFirst({
    where: {
      storeId: input.storeId,
      slug: input.slug,
    },
    select: {
      id: true,
      slug: true,
      productTypeId: true,
      primaryImageId: true,
    },
  });
}

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
      primaryImageId: true,
    },
  });
}

export async function updateProduct(
  prisma: DbClient,
  productId: string,
  input: ImportedProductInput
) {
  return prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      productTypeId: input.productTypeId,
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
      primaryImageId: true,
    },
  });
}

export async function upsertImportedProduct(
  prisma: DbClient,
  storeId: string,
  input: ImportedProductInput
) {
  const existing = await findProductBySlug(prisma, {
    storeId,
    slug: input.slug,
  });

  if (existing) {
    return updateProduct(prisma, existing.id, input);
  }

  return createProduct(prisma, storeId, input);
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
