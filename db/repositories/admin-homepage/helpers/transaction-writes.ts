import type { TxClient } from "../types/tx";

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

export async function replaceHomepageFeaturedProductsInTx(
  tx: TxClient,
  homepageId: string,
  selections: readonly HomepageFeaturedProductSelection[]
): Promise<void> {
  await tx.homepage_featured_products.deleteMany({
    where: { homepage_content_id: BigInt(homepageId) },
  });

  if (selections.length > 0) {
    await tx.homepage_featured_products.createMany({
      data: selections.map((selection) => ({
        homepage_content_id: BigInt(homepageId),
        product_id: BigInt(selection.productId),
        sort_order: selection.sortOrder,
      })),
    });
  }
}

export async function replaceHomepageFeaturedCategoriesInTx(
  tx: TxClient,
  homepageId: string,
  selections: readonly HomepageFeaturedCategorySelection[]
): Promise<void> {
  await tx.homepage_featured_categories.deleteMany({
    where: { homepage_content_id: BigInt(homepageId) },
  });

  if (selections.length > 0) {
    await tx.homepage_featured_categories.createMany({
      data: selections.map((selection) => ({
        homepage_content_id: BigInt(homepageId),
        category_id: BigInt(selection.categoryId),
        sort_order: selection.sortOrder,
      })),
    });
  }
}

export async function replaceHomepageFeaturedBlogPostsInTx(
  tx: TxClient,
  homepageId: string,
  selections: readonly HomepageFeaturedBlogPostSelection[]
): Promise<void> {
  await tx.homepage_featured_blog_posts.deleteMany({
    where: { homepage_content_id: BigInt(homepageId) },
  });

  if (selections.length > 0) {
    await tx.homepage_featured_blog_posts.createMany({
      data: selections.map((selection) => ({
        homepage_content_id: BigInt(homepageId),
        blog_post_id: BigInt(selection.blogPostId),
        sort_order: selection.sortOrder,
      })),
    });
  }
}
