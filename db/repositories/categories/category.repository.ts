import type { CategoryDetail, CategorySummary } from "./category.types";
import { mapCategoryDetail, mapCategorySummary } from "./helpers/mappers";
import { assertValidCategoryId, normalizeCategorySlug } from "./helpers/validation";
import {
  findCategoryRowById,
  findCategoryRowBySlug,
  listActiveCategoryRows,
  listFeaturedCategoryRows,
} from "./queries/category.queries";

export async function findCategoryById(id: string): Promise<CategoryDetail | null> {
  assertValidCategoryId(id);

  const row = await findCategoryRowById(id);

  if (!row) {
    return null;
  }

  return mapCategoryDetail(row);
}

export async function findCategoryBySlug(slug: string): Promise<CategoryDetail | null> {
  const normalizedSlug = normalizeCategorySlug(slug);
  const row = await findCategoryRowBySlug(normalizedSlug);

  if (!row) {
    return null;
  }

  return mapCategoryDetail(row);
}

export async function listActiveCategories(): Promise<CategorySummary[]> {
  const rows = await listActiveCategoryRows();
  return rows.map(mapCategorySummary);
}

export async function listFeaturedCategories(): Promise<CategorySummary[]> {
  const rows = await listFeaturedCategoryRows();
  return rows.map(mapCategorySummary);
}
