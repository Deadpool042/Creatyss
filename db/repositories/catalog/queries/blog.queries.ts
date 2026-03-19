import { prisma } from "@/db/prisma-client";

export async function listPublishedBlogPostRows() {
  return prisma.blog_posts.findMany({
    where: { status: "published" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      cover_image_path: true,
      published_at: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: [{ published_at: { sort: "desc", nulls: "last" } }, { id: "desc" }],
  });
}

export async function getPublishedBlogPostRowBySlug(slug: string) {
  return prisma.blog_posts.findFirst({
    where: { status: "published", slug },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      cover_image_path: true,
      published_at: true,
      seo_title: true,
      seo_description: true,
      created_at: true,
      updated_at: true,
    },
  });
}
