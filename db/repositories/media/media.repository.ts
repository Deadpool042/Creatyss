import type { MediaAssetDetail, MediaAssetSummary } from "./media.types";
import { mapMediaAssetDetail, mapMediaAssetSummary } from "./helpers/mappers";
import { assertValidMediaId, normalizeMediaStorageKey } from "./helpers/validation";
import {
  findMediaAssetRowById,
  findMediaAssetRowByStorageKey,
  listMediaAssetRows,
} from "./queries/media.queries";

export async function listMediaAssets(): Promise<MediaAssetSummary[]> {
  const rows = await listMediaAssetRows();
  return rows.map(mapMediaAssetSummary);
}

export async function findMediaAssetById(id: string): Promise<MediaAssetDetail | null> {
  assertValidMediaId(id);

  const row = await findMediaAssetRowById(id);

  if (!row) {
    return null;
  }

  return mapMediaAssetDetail(row);
}

export async function findMediaAssetByStorageKey(
  storageKey: string
): Promise<MediaAssetDetail | null> {
  const normalizedStorageKey = normalizeMediaStorageKey(storageKey);
  const row = await findMediaAssetRowByStorageKey(normalizedStorageKey);

  if (!row) {
    return null;
  }

  return mapMediaAssetDetail(row);
}
