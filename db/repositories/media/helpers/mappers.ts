import type { AdminMediaAssetDetail, AdminMediaAssetSummary } from "../admin-media.types";
import type { MediaAssetDetail, MediaAssetSummary } from "../media.types";
import type { MediaAssetRow } from "../types/rows";

export function mapMediaAssetSummary(row: MediaAssetRow): MediaAssetSummary {
  return {
    id: row.id,
    storageKey: row.storageKey,
    originalName: row.originalName,
    mimeType: row.mimeType,
    byteSize: row.byteSize,
    width: row.width,
    height: row.height,
    altText: row.altText,
    checksumSha256: row.checksumSha256,
    uploadedByUserId: row.uploadedByUserId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapMediaAssetDetail(row: MediaAssetRow): MediaAssetDetail {
  return mapMediaAssetSummary(row);
}

export function mapAdminMediaAssetSummary(row: MediaAssetRow): AdminMediaAssetSummary {
  return {
    id: row.id,
    storageKey: row.storageKey,
    originalName: row.originalName,
    mimeType: row.mimeType,
    byteSize: row.byteSize,
    width: row.width,
    height: row.height,
    altText: row.altText,
    checksumSha256: row.checksumSha256,
    uploadedByUserId: row.uploadedByUserId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapAdminMediaAssetDetail(row: MediaAssetRow): AdminMediaAssetDetail {
  return mapAdminMediaAssetSummary(row);
}
