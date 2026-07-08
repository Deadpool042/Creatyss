import { withTransaction } from "@/core/db";
import { recordBlogPostArchivedDomainEvent } from "./record-blog-post-editorial-domain-events";

export async function deleteAdminBlogPost(id: string): Promise<boolean> {
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
        archivedAt: true,
      },
    });

    if (existing === null) {
      return false;
    }

    const archivedPost = await tx.blogPost.update({
      where: {
        id,
      },
      data: {
        archivedAt: new Date(),
        status: "ARCHIVED",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        archivedAt: true,
      },
    });

    await recordBlogPostArchivedDomainEvent({
      executor: tx,
      storeId: existing.storeId,
      previous: existing,
      next: {
        ...archivedPost,
        publishedAt: existing.publishedAt,
      },
    });

    // Archivage soft : les `LocalizedValue` de l'article sont conservées,
    // aucun hard delete n'existe donc pas d'orphelins possibles.
    return true;
  });
}
