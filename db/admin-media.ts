import { queryFirst, queryRows } from "./client";

type TimestampValue = Date | string;

type AdminMediaAssetRow = {
  id: string;
  file_path: string;
  original_name: string;
  mime_type: string;
  byte_size: string;
  image_width: number | null;
  image_height: number | null;
  uploaded_by_admin_user_id: string | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type CreateAdminMediaAssetInput = {
  filePath: string;
  originalName: string;
  mimeType: string;
  byteSize: string;
  imageWidth: number | null;
  imageHeight: number | null;
  uploadedByAdminUserId: string | null;
};

export type AdminMediaAsset = {
  id: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  byteSize: string;
  imageWidth: number | null;
  imageHeight: number | null;
  uploadedByAdminUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapAdminMediaAsset(row: AdminMediaAssetRow): AdminMediaAsset {
  return {
    id: row.id,
    filePath: row.file_path,
    originalName: row.original_name,
    mimeType: row.mime_type,
    byteSize: row.byte_size,
    imageWidth: row.image_width,
    imageHeight: row.image_height,
    uploadedByAdminUserId: row.uploaded_by_admin_user_id,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

export async function listAdminMediaAssets(): Promise<AdminMediaAsset[]> {
  const rows = await queryRows<AdminMediaAssetRow>(
    `
      select
        id::text as id,
        file_path,
        original_name,
        mime_type,
        byte_size::text as byte_size,
        image_width,
        image_height,
        uploaded_by_admin_user_id::text as uploaded_by_admin_user_id,
        created_at,
        updated_at
      from media_assets
      order by created_at desc, id desc
    `
  );

  return rows.map(mapAdminMediaAsset);
}

export async function createAdminMediaAsset(
  input: CreateAdminMediaAssetInput
): Promise<AdminMediaAsset> {
  const row = await queryFirst<AdminMediaAssetRow>(
    `
      insert into media_assets (
        file_path,
        original_name,
        mime_type,
        byte_size,
        image_width,
        image_height,
        uploaded_by_admin_user_id
      )
      values ($1, $2, $3, $4::bigint, $5, $6, $7::bigint)
      returning
        id::text as id,
        file_path,
        original_name,
        mime_type,
        byte_size::text as byte_size,
        image_width,
        image_height,
        uploaded_by_admin_user_id::text as uploaded_by_admin_user_id,
        created_at,
        updated_at
    `,
    [
      input.filePath,
      input.originalName,
      input.mimeType,
      input.byteSize,
      input.imageWidth,
      input.imageHeight,
      input.uploadedByAdminUserId
    ]
  );

  if (row === null) {
    throw new Error("Failed to create media asset.");
  }

  return mapAdminMediaAsset(row);
}
