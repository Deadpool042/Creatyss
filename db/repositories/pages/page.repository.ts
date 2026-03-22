import type { PageDetail, PageType, PublishedPageSummary } from "./page.types";
import {
  findPublishedHomepageRow,
  findPublishedPageRowBySlug,
  listPublishedPageRowsByType,
} from "./queries/page.queries";

function mapPageDetail(
  row: Awaited<ReturnType<typeof findPublishedPageRowBySlug>>
): PageDetail | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    pageType: row.pageType,
    summary: row.summary,
    contentJson: row.contentJson,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    isIndexed: row.isIndexed,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
  };
}

function mapPublishedPageSummary(
  row: Awaited<ReturnType<typeof listPublishedPageRowsByType>>[number]
): PublishedPageSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    pageType: row.pageType,
    summary: row.summary,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
  };
}

export async function findPublishedPageBySlug(slug: string): Promise<PageDetail | null> {
  const row = await findPublishedPageRowBySlug(slug);
  return mapPageDetail(row);
}

export async function findPublishedHomepage(): Promise<PageDetail | null> {
  const row = await findPublishedHomepageRow();
  return mapPageDetail(row);
}

export async function listPublishedPagesByType(
  pageType: PageType
): Promise<PublishedPageSummary[]> {
  const rows = await listPublishedPageRowsByType(pageType);
  return rows.map(mapPublishedPageSummary);
}
