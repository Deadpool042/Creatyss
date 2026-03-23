import type {
  CategoryChildSummary,
  CategoryDetail,
  CategorySeoIndexingState,
  CategorySeoSnapshot,
  CategoryStatus,
  CategorySummary,
} from "@db-categories/public";
import type {
  CategoryDetailRow,
  CategorySummaryRow,
  NestedCategoryChildRow,
} from "@db-categories/types/rows";

export function mapCategoryStatusToPrisma(
  status: CategoryStatus
): "DRAFT" | "ACTIVE" | "ARCHIVED" {
  switch (status) {
    case "draft":
      return "DRAFT";
    case "active":
      return "ACTIVE";
    case "archived":
      return "ARCHIVED";
  }
}

function mapCategoryStatus(status: "DRAFT" | "ACTIVE" | "ARCHIVED"): CategoryStatus {
  switch (status) {
    case "DRAFT":
      return "draft";
    case "ACTIVE":
      return "active";
    case "ARCHIVED":
      return "archived";
  }
}

function mapSeoIndexingState(state: "INDEX" | "NOINDEX"): CategorySeoIndexingState {
  return state === "INDEX" ? "index" : "noindex";
}

function mapCategorySeo(
  seo:
    | {
        metaTitle: string | null;
        metaDescription: string | null;
        canonicalUrl: string | null;
        indexingState: "INDEX" | "NOINDEX";
      }
    | null
): CategorySeoSnapshot | null {
  if (!seo) {
    return null;
  }

  return {
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    canonicalUrl: seo.canonicalUrl,
    indexingState: mapSeoIndexingState(seo.indexingState),
  };
}

function mapCategoryChild(row: NestedCategoryChildRow): CategoryChildSummary {
  return {
    id: row.id,
    storeId: row.storeId,
    parentId: row.parentId,
    slug: row.slug,
    name: row.name,
    description: row.description,
    status: mapCategoryStatus(row.status),
    sortOrder: row.sortOrder,
    isFeatured: row.isFeatured,
  };
}

export function mapCategorySummary(row: CategorySummaryRow): CategorySummary {
  return {
    id: row.id,
    storeId: row.storeId,
    parentId: row.parentId,
    slug: row.slug,
    name: row.name,
    description: row.description,
    status: mapCategoryStatus(row.status),
    sortOrder: row.sortOrder,
    isFeatured: row.isFeatured,
    seo: mapCategorySeo(row.seo),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapCategoryDetail(row: CategoryDetailRow): CategoryDetail {
  return {
    ...mapCategorySummary(row),
    parent: row.parent
      ? {
          id: row.parent.id,
          slug: row.parent.slug,
          name: row.parent.name,
        }
      : null,
    children: row.children.map(mapCategoryChild),
  };
}
