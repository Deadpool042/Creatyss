import type { CategoryDetail, CategorySummary } from "../category.types";
import type { AdminCategoryDetail, AdminCategorySummary } from "../admin-category.types";
import type { CategoryRow } from "../types/rows";

export function mapCategorySummary(row: CategoryRow): CategorySummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    status: row.status,
    isFeatured: row.isFeatured,
    displayOrder: row.displayOrder,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    representativeMediaId: row.representativeMediaId,
    representativeMediaStorageKey: row.representativeMedia?.storageKey ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapCategoryDetail(row: CategoryRow): CategoryDetail {
  return mapCategorySummary(row);
}

export function mapAdminCategorySummary(row: CategoryRow): AdminCategorySummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    status: row.status,
    isFeatured: row.isFeatured,
    displayOrder: row.displayOrder,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    representativeMediaId: row.representativeMediaId,
    representativeMediaStorageKey: row.representativeMedia?.storageKey ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapAdminCategoryDetail(row: CategoryRow): AdminCategoryDetail {
  return mapAdminCategorySummary(row);
}
