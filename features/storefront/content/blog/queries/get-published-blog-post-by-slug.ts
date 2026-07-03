import { db } from "@/core/db";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { SeoSubjectType } from "@/prisma-generated/client";
import type { CatalogBlogDetail } from "@/features/storefront/content/blog/types/catalog-blog.types";

export async function getPublishedBlogPostBySlug(slug: string): Promise<CatalogBlogDetail | null> {
  if (!(await meetsFeatureLevel("content.blog", "publish"))) {
    return null;
  }

  const post = await db.blogPost.findFirst({
    where: {
      slug,
      status: "ACTIVE",
      archivedAt: null,
    },
    select: {
      id: true,
      storeId: true,
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

  const seo = await db.seoMetadata.findUnique({
    where: {
      storeId_subjectType_subjectId: {
        storeId: post.storeId,
        subjectType: SeoSubjectType.BLOG_POST,
        subjectId: post.id,
      },
    },
    select: {
      metaTitle: true,
      metaDescription: true,
    },
  });

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.body,
    seoTitle: seo?.metaTitle ?? null,
    seoDescription: seo?.metaDescription ?? null,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    coverImagePath: post.coverImage?.storageKey ?? null,
  };
}
