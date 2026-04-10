import { BlogPostStatus } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";
import type { AdminBlogPostStatus } from "../types";

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
        status: true,
      },
    });

    return toAdminStatus(updated.status);
  });
}
