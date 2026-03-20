import { AdminHomepageRepositoryError } from "../types/internal";
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

function normalizeUniqueIds(ids: readonly string[]): string[] {
  return [...new Set(ids)];
}

export async function ensureHomepageExistsInTx(
  tx: TxClient,
  homepageId: string
): Promise<void> {
  const count = await tx.homepage_content.count({
    where: { id: BigInt(homepageId), status: "published" },
  });

  if (count === 0) {
    throw new AdminHomepageRepositoryError("homepage_missing", "Published homepage was not found.");
  }
}

export async function ensurePublishedProductsExistInTx(
  tx: TxClient,
  selections: readonly HomepageFeaturedProductSelection[]
): Promise<void> {
  const productIds = normalizeUniqueIds(selections.map((selection) => selection.productId));

  if (productIds.length === 0) {
    return;
  }

  const count = await tx.products.count({
    where: { id: { in: productIds.map(BigInt) }, status: "published" },
  });

  if (count !== productIds.length) {
    throw new AdminHomepageRepositoryError(
      "product_missing",
      "At least one selected product is missing or unpublished."
    );
  }
}

export async function ensureCategoriesExistInTx(
  tx: TxClient,
  selections: readonly HomepageFeaturedCategorySelection[]
): Promise<void> {
  const categoryIds = normalizeUniqueIds(selections.map((selection) => selection.categoryId));

  if (categoryIds.length === 0) {
    return;
  }

  const count = await tx.categories.count({
    where: { id: { in: categoryIds.map(BigInt) } },
  });

  if (count !== categoryIds.length) {
    throw new AdminHomepageRepositoryError(
      "category_missing",
      "At least one selected category is missing."
    );
  }
}

export async function ensurePublishedBlogPostsExistInTx(
  tx: TxClient,
  selections: readonly HomepageFeaturedBlogPostSelection[]
): Promise<void> {
  const blogPostIds = normalizeUniqueIds(selections.map((selection) => selection.blogPostId));

  if (blogPostIds.length === 0) {
    return;
  }

  const count = await tx.blog_posts.count({
    where: { id: { in: blogPostIds.map(BigInt) }, status: "published" },
  });

  if (count !== blogPostIds.length) {
    throw new AdminHomepageRepositoryError(
      "blog_post_missing",
      "At least one selected blog post is missing or unpublished."
    );
  }
}
