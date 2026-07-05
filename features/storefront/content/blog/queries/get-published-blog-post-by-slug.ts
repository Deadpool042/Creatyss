import { db } from "@/core/db";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { SeoSubjectType } from "@/prisma-generated/client";
import type { CatalogBlogDetail } from "@/features/storefront/content/blog/types/catalog-blog.types";
import { resolveLocalizedBlogPostCopy } from "@/features/storefront/content/blog/queries/resolve-localized-blog-post-copy";

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

  const localized = (await resolveLocalizedBlogPostCopy([post])).get(post.id);

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
    title: localized?.title ?? post.title,
    excerpt: localized?.excerpt ?? post.excerpt,
    content: localized?.content ?? post.body,
    seoTitle: seo?.metaTitle ?? null,
    seoDescription: seo?.metaDescription ?? null,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    coverImagePath: post.coverImage?.storageKey ?? null,
  };
}
