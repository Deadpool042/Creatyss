import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { mapAdminBlogPostSummary } from "../mappers";
import type { AdminBlogPostSummary } from "../types";

export async function listAdminBlogPosts(): Promise<readonly AdminBlogPostSummary[]> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  const posts = await db.blogPost.findMany({
    where: {
      storeId,
      archivedAt: null,
    },
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      body: true,
      status: true,
      publishedAt: true,
    },
  });

  return posts.map(mapAdminBlogPostSummary);
}
