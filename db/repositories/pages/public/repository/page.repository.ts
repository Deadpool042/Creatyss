import { mapPageDetail, mapPageSummary } from "@db-pages/helpers/mappers";
import { normalizePageSlug } from "@db-pages/helpers/validation";
import {
  findActiveHomepageRowByStoreId,
  findActivePageDetailRowBySlug,
  findPageDetailRowById,
  listActivePageSummaryRowsByStoreId,
} from "@db-pages/queries/public-page.queries";
import type { PageDetail, PageSummary } from "@db-pages/public";

export async function findPageById(id: string): Promise<PageDetail | null> {
  const row = await findPageDetailRowById(id);
  return row ? mapPageDetail(row) : null;
}

export async function findActivePageBySlug(
  storeId: string,
  slug: string
): Promise<PageDetail | null> {
  const row = await findActivePageDetailRowBySlug(storeId, normalizePageSlug(slug));
  return row ? mapPageDetail(row) : null;
}

export async function findActiveHomepageByStoreId(storeId: string): Promise<PageDetail | null> {
  const row = await findActiveHomepageRowByStoreId(storeId);
  return row ? mapPageDetail(row) : null;
}

export async function listActivePagesByStoreId(storeId: string): Promise<PageSummary[]> {
  const rows = await listActivePageSummaryRowsByStoreId(storeId);
  return rows.map(mapPageSummary);
}
