import { prisma } from "@db/prisma-client";
import { adminBlogPostSelect } from "@db-blog/types/rows";

export async function findAdminBlogPostRowById(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    select: adminBlogPostSelect,
  });
}

export async function findAdminBlogPostRowBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug },
    select: adminBlogPostSelect,
  });
}

export async function listAdminBlogPostRows() {
  return prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: adminBlogPostSelect,
  });
}
