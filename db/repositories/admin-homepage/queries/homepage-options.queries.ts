import { prisma } from "@/db/prisma-client";

function compareNameThenIdAsc(
  left: { id: bigint; name: string },
  right: { id: bigint; name: string }
): number {
  const nameCompare = left.name.toLowerCase().localeCompare(right.name.toLowerCase());

  if (nameCompare !== 0) {
    return nameCompare;
  }

  if (left.id < right.id) {
    return -1;
  }

  if (left.id > right.id) {
    return 1;
  }

  return 0;
}

export async function loadHomepageOptions(): Promise<{
  productOptions: { id: string; name: string; slug: string }[];
  categoryOptions: { id: string; name: string; slug: string }[];
  blogPostOptions: { id: string; title: string; slug: string }[];
}> {
  const [productRows, categoryRows, blogPostRows] = await Promise.all([
    prisma.products
      .findMany({
        where: { status: "published" },
        select: { id: true, name: true, slug: true },
      })
      .then((rows) => [...rows].sort(compareNameThenIdAsc)),
    prisma.categories
      .findMany({ select: { id: true, name: true, slug: true } })
      .then((rows) => [...rows].sort(compareNameThenIdAsc)),
    prisma.blog_posts.findMany({
      where: { status: "published" },
      select: { id: true, title: true, slug: true },
      orderBy: [
        { published_at: { sort: "desc", nulls: "last" } },
        { created_at: "desc" },
        { id: "desc" },
      ],
    }),
  ]);

  return {
    productOptions: productRows.map((row) => ({
      id: row.id.toString(),
      name: row.name,
      slug: row.slug,
    })),
    categoryOptions: categoryRows.map((row) => ({
      id: row.id.toString(),
      name: row.name,
      slug: row.slug,
    })),
    blogPostOptions: blogPostRows.map((row) => ({
      id: row.id.toString(),
      title: row.title,
      slug: row.slug,
    })),
  };
}
