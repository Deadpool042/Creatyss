import { db } from "@/core/db";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import type { CatalogBlogListItem } from "@/features/storefront/content/blog/types/catalog-blog.types";
import { resolveLocalizedBlogPostCopy } from "@/features/storefront/content/blog/queries/resolve-localized-blog-post-copy";

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
      storeId: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      publishedAt: true,
    },
  });

  const localizedByPostId = await resolveLocalizedBlogPostCopy(posts);

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: localizedByPostId.get(post.id)?.title ?? post.title,
    excerpt: localizedByPostId.get(post.id)?.excerpt ?? post.excerpt,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
  }));
}
