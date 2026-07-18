import { db } from "@/core/db";
import { getUploadsPublicPath } from "@/core/uploads";
import { toSeoPlainTextOrNull } from "@/entities/product/seo-text";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { buildCatalogImageUrl } from "@/features/storefront/catalog/helpers/catalog-images";
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
      authorName: true,
      publishedAt: true,
      updatedAt: true,
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
      indexingMode: true,
      canonicalPath: true,
      openGraphTitle: true,
      openGraphDescription: true,
      openGraphImage: {
        select: {
          storageKey: true,
        },
      },
      twitterTitle: true,
      twitterDescription: true,
      twitterImage: {
        select: {
          storageKey: true,
        },
      },
    },
  });

  const uploadsPublicPath = getUploadsPublicPath();
  const ogImageStorageKey = seo?.openGraphImage?.storageKey ?? null;
  const twitterImageStorageKey = seo?.twitterImage?.storageKey ?? null;

  return {
    id: post.id,
    slug: post.slug,
    title: localized?.title ?? post.title,
    excerpt: localized?.excerpt ?? post.excerpt,
    content: localized?.content ?? post.body,
    seoTitle: seo?.metaTitle ?? null,
    seoDescription: seo?.metaDescription ?? null,
    seoIndexingMode: seo?.indexingMode ?? null,
    seoCanonicalPath: toSeoPlainTextOrNull(seo?.canonicalPath ?? null),
    seoOpenGraphTitle: toSeoPlainTextOrNull(seo?.openGraphTitle ?? null),
    seoOpenGraphDescription: toSeoPlainTextOrNull(seo?.openGraphDescription ?? null),
    seoOpenGraphImageUrl: ogImageStorageKey
      ? buildCatalogImageUrl(ogImageStorageKey, uploadsPublicPath)
      : null,
    seoTwitterTitle: toSeoPlainTextOrNull(seo?.twitterTitle ?? null),
    seoTwitterDescription: toSeoPlainTextOrNull(seo?.twitterDescription ?? null),
    seoTwitterImageUrl: twitterImageStorageKey
      ? buildCatalogImageUrl(twitterImageStorageKey, uploadsPublicPath)
      : null,
    authorName: toSeoPlainTextOrNull(post.authorName ?? null),
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    updatedAt: post.updatedAt.toISOString(),
    coverImagePath: post.coverImage?.storageKey ?? null,
  };
}
