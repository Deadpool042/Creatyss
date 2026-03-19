import { prisma } from "@/db/prisma-client";
import type { AdminMediaAsset, CreateAdminMediaAssetInput } from "./admin-media.types";

// Structural type aligned with what Prisma returns for media_assets (without relations)
type PrismaMediaAssetData = {
  id: bigint;
  file_path: string;
  original_name: string;
  mime_type: string;
  byte_size: bigint;
  image_width: number | null;
  image_height: number | null;
  uploaded_by_admin_user_id: bigint | null;
  created_at: Date;
  updated_at: Date;
};

function mapPrismaMediaAsset(row: PrismaMediaAssetData): AdminMediaAsset {
  return {
    id: row.id.toString(),
    filePath: row.file_path,
    originalName: row.original_name,
    mimeType: row.mime_type,
    byteSize: row.byte_size.toString(),
    imageWidth: row.image_width,
    imageHeight: row.image_height,
    uploadedByAdminUserId:
      row.uploaded_by_admin_user_id !== null
        ? row.uploaded_by_admin_user_id.toString()
        : null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listAdminMediaAssets(): Promise<AdminMediaAsset[]> {
  const rows = await prisma.media_assets.findMany({
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
  });

  return rows.map(mapPrismaMediaAsset);
}

export async function getAdminMediaAssetById(id: string): Promise<AdminMediaAsset | null> {
  const row = await prisma.media_assets.findUnique({
    where: { id: BigInt(id) },
  });

  return row !== null ? mapPrismaMediaAsset(row) : null;
}

export async function createAdminMediaAsset(
  input: CreateAdminMediaAssetInput
): Promise<AdminMediaAsset> {
  const row = await prisma.media_assets.create({
    data: {
      file_path: input.filePath,
      original_name: input.originalName,
      mime_type: input.mimeType,
      byte_size: BigInt(input.byteSize),
      image_width: input.imageWidth,
      image_height: input.imageHeight,
      uploaded_by_admin_user_id:
        input.uploadedByAdminUserId !== null ? BigInt(input.uploadedByAdminUserId) : null,
    },
  });

  return mapPrismaMediaAsset(row);
}
