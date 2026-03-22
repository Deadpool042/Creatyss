import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  AdminCategoryRepositoryError,
  type AdminCategoryDetail,
  type AdminCategorySummary,
  type CreateAdminCategoryInput,
  type UpdateAdminCategoryInput,
} from "./admin-category.types";
import { mapAdminCategoryDetail, mapAdminCategorySummary } from "./helpers/mappers";
import {
  normalizeCategorySlug,
  parseCreateAdminCategoryInput,
  parseUpdateAdminCategoryInput,
} from "./helpers/validation";
import {
  findAdminCategoryRowById,
  findAdminCategoryRowBySlug,
  listAdminCategoryRows,
} from "./queries/admin-category.queries";

async function ensureRepresentativeMediaExists(representativeMediaId: string): Promise<void> {
  const media = await prisma.mediaAsset.findUnique({
    where: { id: representativeMediaId },
    select: { id: true },
  });

  if (!media) {
    throw new AdminCategoryRepositoryError(
      "category_media_invalid",
      "Image de catégorie introuvable."
    );
  }
}

function mapPrismaCategoryError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new AdminCategoryRepositoryError(
      "category_slug_conflict",
      "Une catégorie avec ce slug existe déjà."
    );
  }

  throw error;
}

export async function listAdminCategories(): Promise<AdminCategorySummary[]> {
  const rows = await listAdminCategoryRows();
  return rows.map(mapAdminCategorySummary);
}

export async function findAdminCategoryById(id: string): Promise<AdminCategoryDetail | null> {
  const row = await findAdminCategoryRowById(id);

  if (!row) {
    return null;
  }

  return mapAdminCategoryDetail(row);
}

export async function findAdminCategoryBySlug(slug: string): Promise<AdminCategoryDetail | null> {
  const normalizedSlug = normalizeCategorySlug(slug);
  const row = await findAdminCategoryRowBySlug(normalizedSlug);

  if (!row) {
    return null;
  }

  return mapAdminCategoryDetail(row);
}

export async function createAdminCategory(
  input: CreateAdminCategoryInput
): Promise<AdminCategoryDetail> {
  const parsedInput = parseCreateAdminCategoryInput(input);
  const normalizedSlug = normalizeCategorySlug(parsedInput.slug);

  if (parsedInput.representativeMediaId) {
    await ensureRepresentativeMediaExists(parsedInput.representativeMediaId);
  }

  try {
    const created = await prisma.category.create({
      data: {
        slug: normalizedSlug,
        name: parsedInput.name,
        description: parsedInput.description ?? null,
        status: parsedInput.status ?? "active",
        isFeatured: parsedInput.isFeatured ?? false,
        displayOrder: parsedInput.displayOrder ?? 0,
        seoTitle: parsedInput.seoTitle ?? null,
        seoDescription: parsedInput.seoDescription ?? null,
        representativeMediaId: parsedInput.representativeMediaId ?? null,
      },
      select: {
        id: true,
      },
    });

    const row = await findAdminCategoryRowById(created.id);

    if (!row) {
      throw new AdminCategoryRepositoryError("category_not_found", "Catégorie introuvable.");
    }

    return mapAdminCategoryDetail(row);
  } catch (error) {
    mapPrismaCategoryError(error);
  }
}

export async function updateAdminCategory(
  input: UpdateAdminCategoryInput
): Promise<AdminCategoryDetail | null> {
  const parsedInput = parseUpdateAdminCategoryInput(input);
  const normalizedSlug = normalizeCategorySlug(parsedInput.slug);

  if (parsedInput.representativeMediaId) {
    await ensureRepresentativeMediaExists(parsedInput.representativeMediaId);
  }

  const data: {
    slug: string;
    name: string;
    description: string | null;
    status?: "active" | "hidden";
    isFeatured?: boolean;
    displayOrder?: number;
    seoTitle: string | null;
    seoDescription: string | null;
    representativeMediaId?: string | null;
  } = {
    slug: normalizedSlug,
    name: parsedInput.name,
    description: parsedInput.description ?? null,
    seoTitle: parsedInput.seoTitle ?? null,
    seoDescription: parsedInput.seoDescription ?? null,
  };

  if (parsedInput.status !== undefined) {
    data.status = parsedInput.status;
  }

  if (parsedInput.isFeatured !== undefined) {
    data.isFeatured = parsedInput.isFeatured;
  }

  if (parsedInput.displayOrder !== undefined) {
    data.displayOrder = parsedInput.displayOrder;
  }

  if (parsedInput.representativeMediaId !== undefined) {
    data.representativeMediaId = parsedInput.representativeMediaId;
  }

  try {
    const updated = await prisma.category.updateMany({
      where: {
        id: parsedInput.id,
      },
      data,
    });

    if (updated.count === 0) {
      return null;
    }

    const row = await findAdminCategoryRowById(parsedInput.id);

    if (!row) {
      return null;
    }

    return mapAdminCategoryDetail(row);
  } catch (error) {
    mapPrismaCategoryError(error);
  }
}

export async function deleteAdminCategory(id: string): Promise<boolean> {
  const deleted = await prisma.category.deleteMany({
    where: { id },
  });

  return deleted.count > 0;
}
