import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  mapCategoryDetail,
  mapCategoryStatusToPrisma,
  mapCategorySummary,
} from "@db-categories/helpers/mappers";
import {
  normalizeCategorySlug,
  parseCreateAdminCategoryInput,
  parseUpdateAdminCategoryInput,
} from "@db-categories/helpers/validation";
import {
  findCategorySummaryRowById,
  listCategorySummaryRowsByStoreId,
} from "@db-categories/queries/admin-category.queries";
import { findCategoryDetailRowById } from "@db-categories/queries/public-category.queries";
import {
  AdminCategoryRepositoryError,
  type AdminCategoryDetail,
  type AdminCategorySummary,
  type CreateAdminCategoryInput,
  type UpdateAdminCategoryInput,
} from "@db-categories/admin/types/category.types";

async function ensureParentCategoryExists(
  storeId: string,
  parentId: string | null | undefined,
  currentCategoryId?: string
): Promise<void> {
  if (parentId === undefined || parentId === null) {
    return;
  }

  if (parentId === currentCategoryId) {
    throw new AdminCategoryRepositoryError(
      "category_parent_invalid",
      "Une catégorie ne peut pas être son propre parent."
    );
  }

  const parent = await prisma.category.findFirst({
    where: {
      id: parentId,
      storeId,
    },
    select: {
      id: true,
    },
  });

  if (!parent) {
    throw new AdminCategoryRepositoryError(
      "category_parent_not_found",
      "Catégorie parente introuvable."
    );
  }
}

function mapCategoryWriteError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new AdminCategoryRepositoryError(
      "category_slug_conflict",
      "Une catégorie avec ce slug existe déjà pour cette boutique."
    );
  }

  throw error;
}

export async function listAdminCategoriesByStoreId(storeId: string): Promise<AdminCategorySummary[]> {
  const rows = await listCategorySummaryRowsByStoreId(storeId);
  return rows.map(mapCategorySummary);
}

export async function findAdminCategoryById(id: string): Promise<AdminCategoryDetail | null> {
  const row = await findCategoryDetailRowById(id);
  return row ? mapCategoryDetail(row) : null;
}

export async function createAdminCategory(
  input: CreateAdminCategoryInput
): Promise<AdminCategoryDetail> {
  const parsedInput = parseCreateAdminCategoryInput(input);

  await ensureParentCategoryExists(parsedInput.storeId, parsedInput.parentId);

  try {
    const created = await prisma.category.create({
      data: {
        storeId: parsedInput.storeId,
        parentId: parsedInput.parentId ?? null,
        slug: normalizeCategorySlug(parsedInput.slug),
        name: parsedInput.name,
        description: parsedInput.description ?? null,
        status: mapCategoryStatusToPrisma(parsedInput.status),
        sortOrder: parsedInput.sortOrder,
        isFeatured: parsedInput.isFeatured,
      },
      select: {
        id: true,
      },
    });

    const row = await findCategoryDetailRowById(created.id);

    if (!row) {
      throw new AdminCategoryRepositoryError("category_not_found", "Catégorie introuvable.");
    }

    return mapCategoryDetail(row);
  } catch (error) {
    mapCategoryWriteError(error);
  }
}

export async function updateAdminCategory(
  input: UpdateAdminCategoryInput
): Promise<AdminCategoryDetail | null> {
  const parsedInput = parseUpdateAdminCategoryInput(input);
  const currentRow = await findCategorySummaryRowById(parsedInput.id);

  if (!currentRow) {
    return null;
  }

  await ensureParentCategoryExists(currentRow.storeId, parsedInput.parentId, parsedInput.id);

  const data: Prisma.CategoryUncheckedUpdateInput = {};

  if (parsedInput.parentId !== undefined) {
    data.parentId = parsedInput.parentId;
  }

  if (parsedInput.slug !== undefined) {
    data.slug = normalizeCategorySlug(parsedInput.slug);
  }

  if (parsedInput.name !== undefined) {
    data.name = parsedInput.name;
  }

  if (parsedInput.description !== undefined) {
    data.description = parsedInput.description;
  }

  if (parsedInput.status !== undefined) {
    data.status = mapCategoryStatusToPrisma(parsedInput.status);
  }

  if (parsedInput.sortOrder !== undefined) {
    data.sortOrder = parsedInput.sortOrder;
  }

  if (parsedInput.isFeatured !== undefined) {
    data.isFeatured = parsedInput.isFeatured;
  }

  try {
    await prisma.category.update({
      where: {
        id: parsedInput.id,
      },
      data,
      select: {
        id: true,
      },
    });

    const row = await findCategoryDetailRowById(parsedInput.id);
    return row ? mapCategoryDetail(row) : null;
  } catch (error) {
    mapCategoryWriteError(error);
  }
}

export async function deleteAdminCategory(id: string): Promise<boolean> {
  const deleted = await prisma.category.deleteMany({
    where: {
      id,
    },
  });

  return deleted.count > 0;
}
