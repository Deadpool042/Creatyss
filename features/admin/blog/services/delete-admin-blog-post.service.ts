import { withTransaction } from "@/core/db";

export async function deleteAdminBlogPost(id: string): Promise<boolean> {
  return withTransaction(async (tx) => {
    const existing = await tx.blogPost.findFirst({
      where: {
        id,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (existing === null) {
      return false;
    }

    await tx.blogPost.update({
      where: {
        id,
      },
      data: {
        archivedAt: new Date(),
        status: "ARCHIVED",
      },
    });

    return true;
  });
}
