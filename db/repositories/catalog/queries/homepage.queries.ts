import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  publishedProductSummarySelect,
  type PublishedProductSummaryRecord,
} from "./recent-products.queries";

export const featuredCategorySelect = Prisma.validator<Prisma.categoriesSelect>()({
  id: true,
  name: true,
  slug: true,
  description: true,
  created_at: true,
  updated_at: true,
});

export type FeaturedCategoryRecord = Prisma.categoriesGetPayload<{
  select: typeof featuredCategorySelect;
}>;

type PublishedBlogPostSummaryRow = {
  blog_posts: {
    id: bigint;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image_path: string | null;
    published_at: Date | null;
    created_at: Date;
    updated_at: Date;
  };
};

export async function getPublishedHomepageRow() {
  return prisma.homepage_content.findFirst({
    where: { status: "published" },
  });
}

export async function listHomepageFeaturedCategoryRecords(
  homepageContentId: string
): Promise<FeaturedCategoryRecord[]> {
  const rows = await prisma.homepage_featured_categories.findMany({
    where: { homepage_content_id: BigInt(homepageContentId) },
    orderBy: [{ sort_order: "asc" }, { category_id: "asc" }],
    select: {
      categories: {
        select: featuredCategorySelect,
      },
    },
  });

  return rows.map((row) => row.categories);
}

export async function listHomepageFeaturedProductRows(
  homepageContentId: string
): Promise<PublishedProductSummaryRecord[]> {
  const rows = await prisma.homepage_featured_products.findMany({
    where: {
      homepage_content_id: BigInt(homepageContentId),
      products: { status: "published" },
    },
    orderBy: [{ sort_order: "asc" }, { product_id: "asc" }],
    select: {
      products: {
        select: publishedProductSummarySelect,
      },
    },
  });

  return rows.map((row) => row.products);
}

export async function listHomepageFeaturedBlogPostRows(
  homepageContentId: string
): Promise<PublishedBlogPostSummaryRow[]> {
  return prisma.homepage_featured_blog_posts.findMany({
    where: {
      homepage_content_id: BigInt(homepageContentId),
      blog_posts: { status: "published" },
    },
    orderBy: [{ sort_order: "asc" }, { blog_post_id: "asc" }],
    select: {
      blog_posts: {
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
      },
    },
  });
}
