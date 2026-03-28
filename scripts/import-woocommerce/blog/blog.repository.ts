import { BlogPostStatus } from "../../../src/generated/prisma/client";
import type { DbClient } from "../shared/db";
import type { ImportedBlogPostInput } from "./blog.types";

export async function findBlogPostBySlug(
  prisma: DbClient,
  input: {
    storeId: string;
    slug: string;
  }
) {
  return prisma.blogPost.findFirst({
    where: {
      storeId: input.storeId,
      slug: input.slug,
    },
    select: {
      id: true,
      slug: true,
      primaryImageId: true,
    },
  });
}

export async function createBlogPost(
  prisma: DbClient,
  storeId: string,
  input: ImportedBlogPostInput
) {
  return prisma.blogPost.create({
    data: {
      storeId,
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      body: input.content,
      status: input.status,
      isFeatured: false,
      authorName: null,
      readingTimeMinutes: null,
      publishedAt: input.publishedAt,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      primaryImageId: true,
    },
  });
}

export async function updateBlogPost(
  prisma: DbClient,
  blogPostId: string,
  input: ImportedBlogPostInput
) {
  return prisma.blogPost.update({
    where: {
      id: blogPostId,
    },
    data: {
      title: input.title,
      excerpt: input.excerpt,
      body: input.content,
      status: input.status,
      publishedAt: input.publishedAt,
      archivedAt: input.status === BlogPostStatus.ARCHIVED ? new Date() : null,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      primaryImageId: true,
    },
  });
}

export async function upsertImportedBlogPost(
  prisma: DbClient,
  storeId: string,
  input: ImportedBlogPostInput
) {
  const existing = await findBlogPostBySlug(prisma, {
    storeId,
    slug: input.slug,
  });

  if (existing) {
    return updateBlogPost(prisma, existing.id, input);
  }

  return createBlogPost(prisma, storeId, input);
}

export async function setBlogPostPrimaryImage(
  prisma: DbClient,
  blogPostId: string,
  primaryImageId: string | null
) {
  return prisma.blogPost.update({
    where: {
      id: blogPostId,
    },
    data: {
      primaryImageId,
    },
    select: {
      id: true,
      primaryImageId: true,
    },
  });
}

export async function archiveMissingImportedBlogPosts(
  prisma: DbClient,
  input: {
    storeId: string;
    preservedSlugs: readonly string[];
  }
) {
  if (input.preservedSlugs.length === 0) {
    return prisma.blogPost.updateMany({
      where: {
        storeId: input.storeId,
        slug: {
          startsWith: "wp-",
        },
        status: {
          not: BlogPostStatus.ARCHIVED,
        },
      },
      data: {
        status: BlogPostStatus.ARCHIVED,
        archivedAt: new Date(),
      },
    });
  }

  return prisma.blogPost.updateMany({
    where: {
      storeId: input.storeId,
      slug: {
        startsWith: "wp-",
        notIn: [...input.preservedSlugs],
      },
      status: {
        not: BlogPostStatus.ARCHIVED,
      },
    },
    data: {
      status: BlogPostStatus.ARCHIVED,
      archivedAt: new Date(),
    },
  });
}
