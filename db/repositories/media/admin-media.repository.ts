import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  AdminMediaRepositoryError,
  type AdminMediaAssetDetail,
  type AdminMediaAssetSummary,
  type CreateAdminMediaAssetInput,
  type UpdateAdminMediaAssetInput,
} from "./admin-media.types";
import { mapAdminMediaAssetDetail, mapAdminMediaAssetSummary } from "./helpers/mappers";
import {
  normalizeMediaStorageKey,
  parseCreateAdminMediaAssetInput,
  parseUpdateAdminMediaAssetInput,
} from "./helpers/validation";
import { deleteMediaAssetInTx } from "./helpers/transactions";
import {
  findAdminMediaAssetRowById,
  findAdminMediaAssetRowByStorageKey,
  listAdminMediaAssetRows,
} from "./queries/admin-media.queries";

async function ensureUploadedByUserExists(uploadedByUserId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: uploadedByUserId },
    select: { id: true },
  });

  if (!user) {
    throw new AdminMediaRepositoryError(
      "media_uploaded_by_user_invalid",
      "Utilisateur du média introuvable."
    );
  }
}

function mapPrismaMediaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(",")
      : String(error.meta?.target ?? "");

    if (target.includes("storageKey")) {
      throw new AdminMediaRepositoryError(
        "media_storage_key_conflict",
        "Un média avec cette clé de stockage existe déjà."
      );
    }

    if (target.includes("checksumSha256")) {
      throw new AdminMediaRepositoryError(
        "media_checksum_conflict",
        "Un média avec cette empreinte existe déjà."
      );
    }
  }

  throw error;
}

export async function listAdminMediaAssets(): Promise<AdminMediaAssetSummary[]> {
  const rows = await listAdminMediaAssetRows();
  return rows.map(mapAdminMediaAssetSummary);
}

export async function findAdminMediaAssetById(id: string): Promise<AdminMediaAssetDetail | null> {
  const row = await findAdminMediaAssetRowById(id);

  if (!row) {
    return null;
  }

  return mapAdminMediaAssetDetail(row);
}

export async function findAdminMediaAssetByStorageKey(
  storageKey: string
): Promise<AdminMediaAssetDetail | null> {
  const normalizedStorageKey = normalizeMediaStorageKey(storageKey);
  const row = await findAdminMediaAssetRowByStorageKey(normalizedStorageKey);

  if (!row) {
    return null;
  }

  return mapAdminMediaAssetDetail(row);
}

export async function createAdminMediaAsset(
  input: CreateAdminMediaAssetInput
): Promise<AdminMediaAssetDetail> {
  const parsedInput = parseCreateAdminMediaAssetInput(input);
  const normalizedStorageKey = normalizeMediaStorageKey(parsedInput.storageKey);

  if (parsedInput.uploadedByUserId) {
    await ensureUploadedByUserExists(parsedInput.uploadedByUserId);
  }

  try {
    const created = await prisma.mediaAsset.create({
      data: {
        storageKey: normalizedStorageKey,
        originalName: parsedInput.originalName,
        mimeType: parsedInput.mimeType,
        byteSize: parsedInput.byteSize,
        width: parsedInput.width ?? null,
        height: parsedInput.height ?? null,
        altText: parsedInput.altText ?? null,
        checksumSha256: parsedInput.checksumSha256 ?? null,
        uploadedByUserId: parsedInput.uploadedByUserId ?? null,
      },
      select: {
        id: true,
      },
    });

    const row = await findAdminMediaAssetRowById(created.id);

    if (!row) {
      throw new AdminMediaRepositoryError("media_not_found", "Média introuvable.");
    }

    return mapAdminMediaAssetDetail(row);
  } catch (error) {
    mapPrismaMediaError(error);
  }
}

export async function updateAdminMediaAsset(
  input: UpdateAdminMediaAssetInput
): Promise<AdminMediaAssetDetail | null> {
  const parsedInput = parseUpdateAdminMediaAssetInput(input);

  const data: {
    altText?: string | null;
  } = {};

  if (parsedInput.altText !== undefined) {
    data.altText = parsedInput.altText;
  }

  const updated = await prisma.mediaAsset.updateMany({
    where: {
      id: parsedInput.id,
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findAdminMediaAssetRowById(parsedInput.id);

  if (!row) {
    return null;
  }

  return mapAdminMediaAssetDetail(row);
}

export async function deleteAdminMediaAsset(id: string): Promise<boolean> {
  const deletedCount = await prisma.$transaction(async (tx) => {
    return deleteMediaAssetInTx(tx, id);
  });

  return deletedCount > 0;
}
