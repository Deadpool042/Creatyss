import { HomepageSectionType, HomepageStatus } from "@/prisma-generated/client";

import { db } from "@/core/db";

export type StorefrontHomepageData = {
  hero: { title: string | null; text: string | null; imageStorageKey: string | null } | null;
  editorial: { title: string | null; text: string | null } | null;
  featuredProducts: Array<{
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    primaryImage: { filePath: string; altText: string | null } | null;
  }>;
  featuredCategories: Array<{
    id: string;
    name: string;
    slug: string;
    representativeImage: { filePath: string; altText: string | null } | null;
  }>;
  featuredPost: {
    slug: string;
    title: string;
    excerpt: string | null;
    publishedAt: Date | null;
  } | null;
};

export async function getStorefrontHomepage(): Promise<StorefrontHomepageData | null> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (store === null) {
    return null;
  }

  const homepage = await db.homepage.findFirst({
    where: {
      storeId: store.id,
      status: HomepageStatus.ACTIVE,
      archivedAt: null,
    },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    select: {
      sections: {
        where: {
          isActive: true,
          archivedAt: null,
        },
        orderBy: { sortOrder: "asc" },
        select: {
          type: true,
          title: true,
          body: true,
          primaryImage: {
            select: { storageKey: true },
          },
          featuredProducts: {
            orderBy: { sortOrder: "asc" },
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  shortDescription: true,
                  primaryImage: {
                    select: { storageKey: true, altText: true },
                  },
                },
              },
            },
          },
          featuredCategories: {
            orderBy: { sortOrder: "asc" },
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  primaryImage: {
                    select: { storageKey: true, altText: true },
                  },
                },
              },
            },
          },
          featuredPosts: {
            orderBy: { sortOrder: "asc" },
            take: 1,
            select: {
              blogPost: {
                select: {
                  slug: true,
                  title: true,
                  excerpt: true,
                  publishedAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (homepage === null) {
    return null;
  }

  let hero: StorefrontHomepageData["hero"] = null;
  let editorial: StorefrontHomepageData["editorial"] = null;
  const featuredProducts: StorefrontHomepageData["featuredProducts"] = [];
  const featuredCategories: StorefrontHomepageData["featuredCategories"] = [];
  let featuredPost: StorefrontHomepageData["featuredPost"] = null;

  for (const section of homepage.sections) {
    if (section.type === HomepageSectionType.HERO && hero === null) {
      hero = {
        title: section.title ?? null,
        text: section.body ?? null,
        imageStorageKey: section.primaryImage?.storageKey ?? null,
      };
    }

    if (section.type === HomepageSectionType.EDITORIAL && editorial === null) {
      editorial = {
        title: section.title ?? null,
        text: section.body ?? null,
      };
    }

    if (
      section.type === HomepageSectionType.FEATURED_PRODUCTS &&
      featuredProducts.length === 0
    ) {
      for (const fp of section.featuredProducts) {
        featuredProducts.push({
          id: fp.product.id,
          name: fp.product.name,
          slug: fp.product.slug,
          shortDescription: fp.product.shortDescription ?? null,
          primaryImage:
            fp.product.primaryImage !== null
              ? {
                  filePath: fp.product.primaryImage.storageKey,
                  altText: fp.product.primaryImage.altText ?? null,
                }
              : null,
        });
      }
    }

    if (
      section.type === HomepageSectionType.FEATURED_CATEGORIES &&
      featuredCategories.length === 0
    ) {
      for (const fc of section.featuredCategories) {
        featuredCategories.push({
          id: fc.category.id,
          name: fc.category.name,
          slug: fc.category.slug,
          representativeImage:
            fc.category.primaryImage !== null
              ? {
                  filePath: fc.category.primaryImage.storageKey,
                  altText: fc.category.primaryImage.altText ?? null,
                }
              : null,
        });
      }
    }

    if (
      section.type === HomepageSectionType.BLOG_POSTS &&
      featuredPost === null
    ) {
      const first = section.featuredPosts[0];
      if (first !== undefined) {
        featuredPost = {
          slug: first.blogPost.slug,
          title: first.blogPost.title,
          excerpt: first.blogPost.excerpt ?? null,
          publishedAt: first.blogPost.publishedAt ?? null,
        };
      }
    }
  }

  return { hero, editorial, featuredProducts, featuredCategories, featuredPost };
}
