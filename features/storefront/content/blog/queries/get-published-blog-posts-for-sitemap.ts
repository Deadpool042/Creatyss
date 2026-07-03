import { db } from "@/core/db";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export type CatalogSitemapBlogPost = {
  slug: string;
  updatedAt: Date;
  sitemapIncluded: boolean;
};

export async function getPublishedBlogPostsForSitemap(): Promise<CatalogSitemapBlogPost[]> {
  if (!(await meetsFeatureLevel("content.blog", "publish"))) {
    return [];
  }

  const posts = await db.blogPost.findMany({
    where: {
      status: "ACTIVE",
      archivedAt: null,
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      updatedAt: true,
    },
  });

  if (posts.length === 0) {
    return [];
  }

  const postIds = posts.map((p) => p.id);

  const seoMetadataList = await db.seoMetadata.findMany({
    where: {
      subjectType: "BLOG_POST",
      subjectId: { in: postIds },
      archivedAt: null,
    },
    select: {
      subjectId: true,
      sitemapIncluded: true,
    },
  });

  const seoMap = new Map(seoMetadataList.map((s) => [s.subjectId, s.sitemapIncluded]));

  return posts.map((post) => ({
    slug: post.slug,
    updatedAt: post.updatedAt,
    sitemapIncluded: seoMap.get(post.id) ?? true,
  }));
}
