import { HomepageSectionType } from "@/prisma-generated/client";
import { withTransaction, type DbExecutor } from "@/core/db";
import {
  AdminHomepageServiceError,
  type UpdateAdminHomepageInput,
} from "../types";

const HERO_SECTION_CODE = "hero";
const EDITORIAL_SECTION_CODE = "editorial";
const FEATURED_PRODUCTS_SECTION_CODE = "featured-products";
const FEATURED_CATEGORIES_SECTION_CODE = "featured-categories";
const FEATURED_BLOG_POSTS_SECTION_CODE = "featured-blog-posts";

type HomepageRecord = {
  id: string;
  storeId: string;
};

type HomepageSectionRecord = {
  id: string;
  code: string;
  type: HomepageSectionType;
};

async function getHomepageOrThrow(
  executor: DbExecutor,
  homepageId: string,
): Promise<HomepageRecord> {
  const homepage = await executor.homepage.findFirst({
    where: {
      id: homepageId,
    },
    select: {
      id: true,
      storeId: true,
    },
  });

  if (homepage === null) {
    throw new AdminHomepageServiceError("homepage_missing");
  }

  return homepage;
}

async function assertProductsExist(
  executor: DbExecutor,
  productIds: readonly string[],
): Promise<void> {
  if (productIds.length === 0) {
    return;
  }

  const products = await executor.product.findMany({
    where: {
      id: {
        in: [...productIds],
      },
    },
    select: {
      id: true,
    },
  });

  if (products.length !== productIds.length) {
    throw new AdminHomepageServiceError("product_missing");
  }
}

async function assertCategoriesExist(
  executor: DbExecutor,
  categoryIds: readonly string[],
): Promise<void> {
  if (categoryIds.length === 0) {
    return;
  }

  const categories = await executor.category.findMany({
    where: {
      id: {
        in: [...categoryIds],
      },
    },
    select: {
      id: true,
    },
  });

  if (categories.length !== categoryIds.length) {
    throw new AdminHomepageServiceError("category_missing");
  }
}

async function assertBlogPostsExist(
  executor: DbExecutor,
  blogPostIds: readonly string[],
): Promise<void> {
  if (blogPostIds.length === 0) {
    return;
  }

  const blogPosts = await executor.blogPost.findMany({
    where: {
      id: {
        in: [...blogPostIds],
      },
    },
    select: {
      id: true,
    },
  });

  if (blogPosts.length !== blogPostIds.length) {
    throw new AdminHomepageServiceError("blog_post_missing");
  }
}

async function ensureHomepageSections(
  executor: DbExecutor,
  homepageId: string,
): Promise<{
  heroSection: HomepageSectionRecord;
  editorialSection: HomepageSectionRecord;
  featuredProductsSection: HomepageSectionRecord;
  featuredCategoriesSection: HomepageSectionRecord;
  featuredBlogPostsSection: HomepageSectionRecord;
}> {
  const sections = await executor.homepageSection.findMany({
    where: {
      homepageId,
      archivedAt: null,
    },
    select: {
      id: true,
      code: true,
      type: true,
    },
  });

  async function ensureSection(
    code: string,
    type: HomepageSectionType,
    sortOrder: number,
  ): Promise<HomepageSectionRecord> {
    const existing =
      sections.find((section) => section.code === code) ??
      sections.find((section) => section.type === type) ??
      null;

    if (existing !== null) {
      return existing;
    }

    return executor.homepageSection.create({
      data: {
        homepageId,
        code,
        type,
        sortOrder,
        isActive: true,
      },
      select: {
        id: true,
        code: true,
        type: true,
      },
    });
  }

  return {
    heroSection: await ensureSection(HERO_SECTION_CODE, HomepageSectionType.HERO, 10),
    editorialSection: await ensureSection(
      EDITORIAL_SECTION_CODE,
      HomepageSectionType.EDITORIAL,
      20,
    ),
    featuredProductsSection: await ensureSection(
      FEATURED_PRODUCTS_SECTION_CODE,
      HomepageSectionType.FEATURED_PRODUCTS,
      30,
    ),
    featuredCategoriesSection: await ensureSection(
      FEATURED_CATEGORIES_SECTION_CODE,
      HomepageSectionType.FEATURED_CATEGORIES,
      40,
    ),
    featuredBlogPostsSection: await ensureSection(
      FEATURED_BLOG_POSTS_SECTION_CODE,
      HomepageSectionType.BLOG_POSTS,
      50,
    ),
  };
}

async function resolvePrimaryImageId(
  executor: DbExecutor,
  storeId: string,
  heroImagePath: string | null,
): Promise<string | null> {
  if (heroImagePath === null) {
    return null;
  }

  const mediaAsset = await executor.mediaAsset.findFirst({
    where: {
      storeId,
      storageKey: heroImagePath,
    },
    select: {
      id: true,
    },
  });

  return mediaAsset?.id ?? null;
}

export async function updateAdminHomepage(
  input: UpdateAdminHomepageInput,
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    const homepageRecord = await getHomepageOrThrow(tx, input.id);

    await assertProductsExist(
      tx,
      input.featuredProducts.map((item) => item.productId),
    );
    await assertCategoriesExist(
      tx,
      input.featuredCategories.map((item) => item.categoryId),
    );
    await assertBlogPostsExist(
      tx,
      input.featuredBlogPosts.map((item) => item.blogPostId),
    );

    const sections = await ensureHomepageSections(tx, input.id);
    const primaryImageId = await resolvePrimaryImageId(
      tx,
      homepageRecord.storeId,
      input.heroImagePath,
    );

    const homepage = await tx.homepage.update({
      where: {
        id: input.id,
      },
      data: {
        updatedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    await tx.homepageSection.update({
      where: {
        id: sections.heroSection.id,
      },
      data: {
        title: input.heroTitle,
        body: input.heroText,
        primaryImage:
          primaryImageId !== null
            ? {
                connect: {
                  id: primaryImageId,
                },
              }
            : {
                disconnect: true,
              },
      },
    });

    await tx.homepageSection.update({
      where: {
        id: sections.editorialSection.id,
      },
      data: {
        title: input.editorialTitle,
        body: input.editorialText,
      },
    });

    await tx.homepageFeaturedProduct.deleteMany({
      where: {
        homepageSectionId: sections.featuredProductsSection.id,
      },
    });

    await tx.homepageFeaturedCategory.deleteMany({
      where: {
        homepageSectionId: sections.featuredCategoriesSection.id,
      },
    });

    await tx.homepageFeaturedBlogPost.deleteMany({
      where: {
        homepageSectionId: sections.featuredBlogPostsSection.id,
      },
    });

    if (input.featuredProducts.length > 0) {
      await tx.homepageFeaturedProduct.createMany({
        data: input.featuredProducts.map((item) => ({
          homepageSectionId: sections.featuredProductsSection.id,
          productId: item.productId,
          sortOrder: item.sortOrder,
        })),
      });
    }

    if (input.featuredCategories.length > 0) {
      await tx.homepageFeaturedCategory.createMany({
        data: input.featuredCategories.map((item) => ({
          homepageSectionId: sections.featuredCategoriesSection.id,
          categoryId: item.categoryId,
          sortOrder: item.sortOrder,
        })),
      });
    }

    if (input.featuredBlogPosts.length > 0) {
      await tx.homepageFeaturedBlogPost.createMany({
        data: input.featuredBlogPosts.map((item) => ({
          homepageSectionId: sections.featuredBlogPostsSection.id,
          blogPostId: item.blogPostId,
          sortOrder: item.sortOrder,
        })),
      });
    }

    return homepage;
  });
}
