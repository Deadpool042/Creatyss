import { Prisma } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";
import { toPrismaBlogPostStatus } from "../mappers";
import {
  AdminBlogServiceError,
  type UpdateAdminBlogPostInput,
} from "../types";

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
        publishedAt: true,
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

    try {
      return await tx.blogPost.update({
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
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AdminBlogServiceError("slug_taken");
      }

      throw error;
    }
  });
}
