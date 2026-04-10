import { db } from "@/core/db";
import { mapAdminBlogPostSummary } from "../mappers";
import type { AdminBlogPostSummary } from "../types";

async function getDefaultStoreId(): Promise<string | null> {
  const store = await db.store.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
    },
  });

  return store?.id ?? null;
}

export async function listAdminBlogPosts(): Promise<readonly AdminBlogPostSummary[]> {
  const storeId = await getDefaultStoreId();

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
