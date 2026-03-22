import type { CreateAdminBlogPostInput, UpdateAdminBlogPostInput } from "@db-blog/admin/post";
import type { BlogTxClient } from "@db-blog/types/tx";

export async function createBlogPostInTx(
  tx: BlogTxClient,
  input: CreateAdminBlogPostInput
): Promise<string> {
  if (input.coverMediaId) {
    const media = await tx.mediaAsset.findUnique({
      where: {
        id: input.coverMediaId,
      },
      select: {
        id: true,
      },
    });

    if (!media) {
      throw new Error("BLOG_POST_COVER_MEDIA_INVALID");
    }
  }

  const created = await tx.blogPost.create({
    data: {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt ?? null,
      content: input.content,
      status: input.status ?? "draft",
      coverMediaId: input.coverMediaId ?? null,
      publishedAt: input.publishedAt ?? null,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
    },
    select: {
      id: true,
    },
  });

  return created.id;
}

export async function updateBlogPostInTx(
  tx: BlogTxClient,
  input: UpdateAdminBlogPostInput
): Promise<boolean> {
  const existing = await tx.blogPost.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    return false;
  }

  if (input.coverMediaId) {
    const media = await tx.mediaAsset.findUnique({
      where: {
        id: input.coverMediaId,
      },
      select: {
        id: true,
      },
    });

    if (!media) {
      throw new Error("BLOG_POST_COVER_MEDIA_INVALID");
    }
  }

  await tx.blogPost.update({
    where: {
      id: input.id,
    },
    data: {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt ?? null,
      content: input.content,
      status: input.status ?? "draft",
      coverMediaId: input.coverMediaId ?? null,
      publishedAt: input.publishedAt ?? null,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
    },
  });

  return true;
}
