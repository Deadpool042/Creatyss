import { db } from "@/core/db";
import { mapAdminBlogPostDetail } from "../mappers";
import type { AdminBlogPostDetail } from "../types";

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

export async function getAdminBlogPostById(id: string): Promise<AdminBlogPostDetail | null> {
  const storeId = await getDefaultStoreId();

  if (storeId === null) {
    return null;
  }

  const post = await db.blogPost.findFirst({
    where: {
      id,
      storeId,
      archivedAt: null,
    },
    select: {
      id: true,
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

  return mapAdminBlogPostDetail(post);
}
