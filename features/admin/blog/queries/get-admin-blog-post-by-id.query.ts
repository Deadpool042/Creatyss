import { db } from "@/core/db";
import { SeoSubjectType } from "@/prisma-generated/client";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { mapAdminBlogPostDetail } from "../mappers";
import type { AdminBlogPostDetail } from "../types";

export async function getAdminBlogPostById(id: string): Promise<AdminBlogPostDetail | null> {
  const storeId = await getCurrentStoreId();

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
