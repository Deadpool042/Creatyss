import type { DbClient } from "../shared/db";
import type { ImportedCategoryInput } from "./category.types";

export async function createCategory(
  prisma: DbClient,
  storeId: string,
  input: ImportedCategoryInput
) {
  return prisma.category.create({
    data: {
      storeId,
      code: input.code,
      slug: input.slug,
      name: input.name,
      shortDescription: input.shortDescription,
      description: input.description,
      status: input.status,
      isFeatured: input.isFeatured,
      sortOrder: input.sortOrder,
      publishedAt: input.publishedAt,
    },
    select: {
      id: true,
      code: true,
      slug: true,
      name: true,
    },
  });
}

export async function setCategoryParent(
  prisma: DbClient,
  categoryId: string,
  parentId: string | null
) {
  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      parentId,
    },
    select: {
      id: true,
      parentId: true,
    },
  });
}

export async function setCategoryPrimaryImage(
  prisma: DbClient,
  categoryId: string,
  primaryImageId: string | null
) {
  return prisma.category.update({
    where: {
      id: categoryId,
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
