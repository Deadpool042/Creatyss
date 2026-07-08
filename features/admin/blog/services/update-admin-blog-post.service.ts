import { Prisma, SeoSubjectType, type BlogPostStatus } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";
import { toPrismaBlogPostStatus } from "../mappers";
import {
  AdminBlogServiceError,
  type UpdateAdminBlogPostInput,
} from "../types";
import { recordBlogPostUpdatedVisibleDomainEvent } from "./record-blog-post-editorial-domain-events";
import { recordBlogPostPublicationDomainEvent } from "./record-blog-post-publication-domain-event";

export async function updateAdminBlogPost(
  input: UpdateAdminBlogPostInput,
): Promise<{ id: string } | null> {
  return withTransaction(async (tx) => {
    const existing = await tx.blogPost.findFirst({
      where: {
        id: input.id,
        archivedAt: null,
      },
      select: {
        id: true,
        storeId: true,
        slug: true,
        title: true,
        excerpt: true,
        body: true,
        status: true,
        publishedAt: true,
        primaryImageId: true,
        coverImageId: true,
        updatedAt: true,
      },
    });

    if (existing === null) {
      return null;
    }

    const primaryImage =
      input.primaryImagePath === null
        ? null
        : await tx.mediaAsset.findFirst({
            where: {
              storeId: existing.storeId,
              storageKey: input.primaryImagePath,
            },
            select: {
              id: true,
            },
          });

    const coverImage =
      input.coverImagePath === null
        ? null
        : await tx.mediaAsset.findFirst({
            where: {
              storeId: existing.storeId,
              storageKey: input.coverImagePath,
            },
            select: {
              id: true,
            },
          });

    let updatedPost: {
      id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      body: string | null;
      status: BlogPostStatus;
      publishedAt: Date | null;
      primaryImageId: string | null;
      coverImageId: string | null;
      updatedAt: Date;
    };

    try {
      updatedPost = await tx.blogPost.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          body: input.content,
          status: toPrismaBlogPostStatus(input.status),
          publishedAt:
            input.status === "published" ? (existing.publishedAt ?? new Date()) : null,
          primaryImageId: primaryImage?.id ?? null,
          coverImageId: coverImage?.id ?? null,
        },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          body: true,
          status: true,
          publishedAt: true,
          primaryImageId: true,
          coverImageId: true,
          updatedAt: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AdminBlogServiceError("slug_taken");
      }

      throw error;
    }

    await tx.seoMetadata.upsert({
      where: {
        storeId_subjectType_subjectId: {
          storeId: existing.storeId,
          subjectType: SeoSubjectType.BLOG_POST,
          subjectId: input.id,
        },
      },
      create: {
        storeId: existing.storeId,
        subjectType: SeoSubjectType.BLOG_POST,
        subjectId: input.id,
        metaTitle: input.seoTitle ?? null,
        metaDescription: input.seoDescription ?? null,
      },
      update: {
        metaTitle: input.seoTitle ?? null,
        metaDescription: input.seoDescription ?? null,
      },
    });

    await recordBlogPostPublicationDomainEvent({
      executor: tx,
      storeId: existing.storeId,
      postId: existing.id,
      slug: updatedPost.slug,
      title: updatedPost.title,
      previousStatus: existing.status,
      nextStatus: updatedPost.status,
      previousPublishedAt: existing.publishedAt,
      nextPublishedAt: updatedPost.publishedAt,
    });

    await recordBlogPostUpdatedVisibleDomainEvent({
      executor: tx,
      storeId: existing.storeId,
      previous: existing,
      next: updatedPost,
    });

    return updatedPost;
  });
}
