import { Prisma, SeoSubjectType } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { toPrismaBlogPostStatus } from "../mappers";
import {
  AdminBlogServiceError,
  type CreateAdminBlogPostInput,
} from "../types";

export async function createAdminBlogPost(
  input: CreateAdminBlogPostInput,
): Promise<{ id: string }> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    throw new AdminBlogServiceError("blog_post_missing");
  }

  return withTransaction(async (tx) => {
    const primaryImage =
      input.primaryImagePath === null
        ? null
        : await tx.mediaAsset.findFirst({
            where: {
              storeId,
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
              storeId,
              storageKey: input.coverImagePath,
            },
            select: {
              id: true,
            },
          });

    let createdPost: { id: string };

    try {
      createdPost = await tx.blogPost.create({
        data: {
          storeId,
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          body: input.content,
          status: toPrismaBlogPostStatus(input.status),
          publishedAt: input.status === "published" ? new Date() : null,
          primaryImageId: primaryImage?.id ?? null,
          coverImageId: coverImage?.id ?? null,
        },
        select: {
          id: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AdminBlogServiceError("slug_taken");
      }

      throw error;
    }

    if (input.seoTitle !== null || input.seoDescription !== null) {
      await tx.seoMetadata.create({
        data: {
          storeId,
          subjectType: SeoSubjectType.BLOG_POST,
          subjectId: createdPost.id,
          metaTitle: input.seoTitle ?? null,
          metaDescription: input.seoDescription ?? null,
        },
      });
    }

    return createdPost;
  });
}
