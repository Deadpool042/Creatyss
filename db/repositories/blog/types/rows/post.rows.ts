import type { Prisma } from "@prisma/client";

export const blogPostSummarySelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverMediaId: true,
  publishedAt: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BlogPostSelect;

export const blogPostDetailSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  content: true,
  coverMediaId: true,
  publishedAt: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BlogPostSelect;

export const adminBlogPostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  content: true,
  status: true,
  coverMediaId: true,
  publishedAt: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BlogPostSelect;

export type BlogPostSummaryRow = Prisma.BlogPostGetPayload<{
  select: typeof blogPostSummarySelect;
}>;

export type BlogPostDetailRow = Prisma.BlogPostGetPayload<{
  select: typeof blogPostDetailSelect;
}>;

export type AdminBlogPostRow = Prisma.BlogPostGetPayload<{
  select: typeof adminBlogPostSelect;
}>;
