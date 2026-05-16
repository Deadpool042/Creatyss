import { db } from "@/core/db";
import { SeoSubjectType } from "@/prisma-generated/client";
import { mapAdminBlogPostDetail } from "../mappers";
import type { AdminBlogPostDetail } from "../types";

async function getDefaultStoreId(): Promise<string | null> {
  const store = await db.store.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
    },
  });

  return store?.id ?? null;
}

export async function getAdminBlogPostById(id: string): Promise<AdminBlogPostDetail | null> {
  const storeId = await getDefaultStoreId();

  if (storeId === null) {
    return null;
  }

  const [post, seo] = await Promise.all([
    db.blogPost.findFirst({
      where: {
        id,
        storeId,
        archivedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        body: true,
        status: true,
        publishedAt: true,
        primaryImage: {
          select: {
            storageKey: true,
          },
        },
        coverImage: {
          select: {
            storageKey: true,
          },
        },
      },
    }),
    db.seoMetadata.findUnique({
      where: {
        storeId_subjectType_subjectId: {
          storeId,
          subjectType: SeoSubjectType.BLOG_POST,
          subjectId: id,
        },
      },
      select: {
        metaTitle: true,
        metaDescription: true,
      },
    }),
  ]);

  if (post === null) {
    return null;
  }

  return mapAdminBlogPostDetail(post, seo);
}
