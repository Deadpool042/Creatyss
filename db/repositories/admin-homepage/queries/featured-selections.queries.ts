import { prisma } from "@/db/prisma-client";

type HomepageFeaturedProductSelection = {
  productId: string;
  sortOrder: number;
};

type HomepageFeaturedCategorySelection = {
  categoryId: string;
  sortOrder: number;
};

type HomepageFeaturedBlogPostSelection = {
  blogPostId: string;
  sortOrder: number;
};

export async function listHomepageFeaturedProducts(
  homepageId: string
): Promise<HomepageFeaturedProductSelection[]> {
  const rows = await prisma.homepage_featured_products.findMany({
    where: { homepage_content_id: BigInt(homepageId) },
    orderBy: [{ sort_order: "asc" }, { product_id: "asc" }],
  });

  return rows.map((row) => ({
    productId: row.product_id.toString(),
    sortOrder: row.sort_order,
  }));
}

export async function listHomepageFeaturedCategories(
  homepageId: string
): Promise<HomepageFeaturedCategorySelection[]> {
  const rows = await prisma.homepage_featured_categories.findMany({
    where: { homepage_content_id: BigInt(homepageId) },
    orderBy: [{ sort_order: "asc" }, { category_id: "asc" }],
  });

  return rows.map((row) => ({
    categoryId: row.category_id.toString(),
    sortOrder: row.sort_order,
  }));
}

export async function listHomepageFeaturedBlogPosts(
  homepageId: string
): Promise<HomepageFeaturedBlogPostSelection[]> {
  const rows = await prisma.homepage_featured_blog_posts.findMany({
    where: { homepage_content_id: BigInt(homepageId) },
    orderBy: [{ sort_order: "asc" }, { blog_post_id: "asc" }],
  });

  return rows.map((row) => ({
    blogPostId: row.blog_post_id.toString(),
    sortOrder: row.sort_order,
  }));
}

export async function loadHomepageFeaturedSelections(homepageId: string): Promise<{
  featuredProducts: HomepageFeaturedProductSelection[];
  featuredCategories: HomepageFeaturedCategorySelection[];
  featuredBlogPosts: HomepageFeaturedBlogPostSelection[];
}> {
  const [featuredProducts, featuredCategories, featuredBlogPosts] = await Promise.all([
    listHomepageFeaturedProducts(homepageId),
    listHomepageFeaturedCategories(homepageId),
    listHomepageFeaturedBlogPosts(homepageId),
  ]);

  return { featuredProducts, featuredCategories, featuredBlogPosts };
}
