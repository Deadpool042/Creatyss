import { prisma } from "@db/prisma-client";
import { blogPostDetailSelect, blogPostSummarySelect } from "@db-blog/types/rows";

export async function findBlogPostRowById(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    select: blogPostDetailSelect,
  });
}

export async function findBlogPostRowBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      status: "published",
    },
    select: blogPostDetailSelect,
  });
}

export async function listPublishedBlogPostRows() {
  return prisma.blogPost.findMany({
    where: {
      status: "published",
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: blogPostSummarySelect,
  });
}
