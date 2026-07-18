import type { SeoIndexingMode } from "@/entities/seo";

export type CatalogBlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
};

export type CatalogBlogDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoIndexingMode: SeoIndexingMode | null;
  seoCanonicalPath: string | null;
  seoOpenGraphTitle: string | null;
  seoOpenGraphDescription: string | null;
  seoOpenGraphImageUrl: string | null;
  seoTwitterTitle: string | null;
  seoTwitterDescription: string | null;
  seoTwitterImageUrl: string | null;
  authorName: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  coverImagePath: string | null;
};
