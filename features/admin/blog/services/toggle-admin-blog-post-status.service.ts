import { BlogPostStatus } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";
import type { AdminBlogPostStatus } from "../types";
import { recordBlogPostPublicationDomainEvent } from "./record-blog-post-publication-domain-event";

function toAdminStatus(status: BlogPostStatus): AdminBlogPostStatus {
  return status === BlogPostStatus.ACTIVE ? "published" : "draft";
}

export async function toggleAdminBlogPostStatus(
  id: string,
): Promise<AdminBlogPostStatus | null> {
  return withTransaction(async (tx) => {
    const existing = await tx.blogPost.findFirst({
      where: {
        id,
        archivedAt: null,
      },
      select: {
        id: true,
        storeId: true,
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
      },
    });

    if (existing === null) {
      return null;
    }

    const nextStatus =
      existing.status === BlogPostStatus.ACTIVE
        ? BlogPostStatus.DRAFT
        : BlogPostStatus.ACTIVE;

    const updated = await tx.blogPost.update({
      where: {
        id,
      },
      data: {
        status: nextStatus,
        publishedAt:
          nextStatus === BlogPostStatus.ACTIVE
            ? (existing.publishedAt ?? new Date())
            : null,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
      },
    });

    await recordBlogPostPublicationDomainEvent({
      executor: tx,
      storeId: existing.storeId,
      postId: existing.id,
      slug: updated.slug,
      title: updated.title,
      previousStatus: existing.status,
      nextStatus: updated.status,
      previousPublishedAt: existing.publishedAt,
      nextPublishedAt: updated.publishedAt,
    });

    return toAdminStatus(updated.status);
  });
}
