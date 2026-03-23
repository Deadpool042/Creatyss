import type {
  PageDetail,
  PageSection,
  PageSectionKind,
  PageSeoIndexingState,
  PageSeoSnapshot,
  PageStatus,
  PageSummary,
} from "@db-pages/public";
import type { PageDetailRow, PageSectionRow, PageSummaryRow } from "@db-pages/types/rows";

export function mapPageStatusToPrisma(status: PageStatus): "DRAFT" | "ACTIVE" | "ARCHIVED" {
  switch (status) {
    case "draft":
      return "DRAFT";
    case "active":
      return "ACTIVE";
    case "archived":
      return "ARCHIVED";
  }
}

function mapPageStatus(status: "DRAFT" | "ACTIVE" | "ARCHIVED"): PageStatus {
  switch (status) {
    case "DRAFT":
      return "draft";
    case "ACTIVE":
      return "active";
    case "ARCHIVED":
      return "archived";
  }
}

function mapPageSectionKind(kind: PageSectionRow["kind"]): PageSectionKind {
  switch (kind) {
    case "HERO":
      return "hero";
    case "RICH_TEXT":
      return "rich_text";
    case "IMAGE":
      return "image";
    case "IMAGE_TEXT":
      return "image_text";
    case "FEATURED_PRODUCTS":
      return "featured_products";
    case "FEATURED_CATEGORIES":
      return "featured_categories";
    case "FEATURED_POSTS":
      return "featured_posts";
    case "EDITORIAL":
      return "editorial";
    case "CUSTOM":
      return "custom";
  }
}

function mapSeoIndexingState(state: "INDEX" | "NOINDEX"): PageSeoIndexingState {
  return state === "INDEX" ? "index" : "noindex";
}

function mapPageSeo(
  seo:
    | {
        metaTitle: string | null;
        metaDescription: string | null;
        canonicalUrl: string | null;
        indexingState: "INDEX" | "NOINDEX";
      }
    | null
): PageSeoSnapshot | null {
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

function mapPageSection(row: PageSectionRow): PageSection {
  return {
    id: row.id,
    kind: mapPageSectionKind(row.kind),
    title: row.title,
    subtitle: row.subtitle,
    content: row.content,
    imageAssetId: row.imageAssetId,
    sortOrder: row.sortOrder,
    isEnabled: row.isEnabled,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapPageSummary(row: PageSummaryRow): PageSummary {
  return {
    id: row.id,
    storeId: row.storeId,
    slug: row.slug,
    title: row.title,
    description: row.description,
    status: mapPageStatus(row.status),
    isHomepage: row.isHomepage,
    seo: mapPageSeo(row.seo),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapPageDetail(row: PageDetailRow): PageDetail {
  return {
    ...mapPageSummary(row),
    sections: row.sections.map(mapPageSection),
  };
}
