import { db } from "@/core/db";
import type { CatalogBlogDetail } from "@/features/storefront/catalog/types";

export async function getPublishedBlogPostBySlug(slug: string): Promise<CatalogBlogDetail | null> {
  const post = await db.blogPost.findFirst({
    where: {
      slug,
      status: "ACTIVE",
      archivedAt: null,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      publishedAt: true,
      coverImage: {
        select: {
          storageKey: true,
        },
      },
    },
  });

  if (post === null) {
    return null;
  }

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.body,
    seoTitle: null,
    seoDescription: null,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    coverImagePath: post.coverImage?.storageKey ?? null,
  };
}
