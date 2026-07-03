import { db } from "@/core/db";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import type { CatalogBlogListItem } from "@/features/storefront/content/blog/types/catalog-blog.types";

export async function listPublishedBlogPosts(): Promise<CatalogBlogListItem[]> {
  if (!(await meetsFeatureLevel("content.blog", "publish"))) {
    return [];
  }

  const posts = await db.blogPost.findMany({
    where: {
      status: "ACTIVE",
      archivedAt: null,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
    },
  });

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
  }));
}
