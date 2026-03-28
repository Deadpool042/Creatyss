import { CategoryStatus } from "../../../src/generated/prisma/client";
import type { DbClient } from "../shared/db";
import type { ImportedCategoryInput } from "./category.types";

export async function findCategoryByCode(
  prisma: DbClient,
  input: {
    storeId: string;
    code: string;
  }
) {
  return prisma.category.findFirst({
    where: {
      storeId: input.storeId,
      code: input.code,
    },
    select: {
      id: true,
      code: true,
      primaryImageId: true,
    },
  });
}

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
      primaryImageId: true,
    },
  });
}

export async function updateCategory(
  prisma: DbClient,
  categoryId: string,
  input: ImportedCategoryInput
) {
  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
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
      primaryImageId: true,
    },
  });
}

export async function upsertImportedCategory(
  prisma: DbClient,
  storeId: string,
  input: ImportedCategoryInput
) {
  const existing = await findCategoryByCode(prisma, {
    storeId,
    code: input.code,
  });

  if (existing) {
    return updateCategory(prisma, existing.id, input);
  }

  return createCategory(prisma, storeId, input);
}

export async function archiveMissingImportedCategories(
  prisma: DbClient,
  input: {
    storeId: string;
    preservedCodes: readonly string[];
  }
) {
  if (input.preservedCodes.length === 0) {
    return prisma.category.updateMany({
      where: {
        storeId: input.storeId,
        code: {
          startsWith: "woo_cat_",
        },
        status: {
          not: CategoryStatus.ARCHIVED,
        },
      },
      data: {
        status: CategoryStatus.ARCHIVED,
      },
    });
  }

  return prisma.category.updateMany({
    where: {
      storeId: input.storeId,
      code: {
        startsWith: "woo_cat_",
        notIn: [...input.preservedCodes],
      },
      status: {
        not: CategoryStatus.ARCHIVED,
      },
    },
    data: {
      status: CategoryStatus.ARCHIVED,
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
