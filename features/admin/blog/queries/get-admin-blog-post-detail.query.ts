import { db } from "@/core/db";
import { SeoSubjectType } from "@/prisma-generated/client";
import { mapAdminBlogPostDetail } from "../mappers";
import type { AdminBlogPostDetail } from "../types";

export async function getAdminBlogPostDetail(
  input: { postId: string },
): Promise<AdminBlogPostDetail | null> {
  const post = await db.blogPost.findFirst({
    where: {
      id: input.postId,
      archivedAt: null,
    },
    select: {
      id: true,
      storeId: true,
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

  return mapAdminBlogPostDetail(post, seo);
}
