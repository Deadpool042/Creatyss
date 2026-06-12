import { HomepageSectionType, HomepageStatus } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { localUploadExists } from "@/core/uploads/check-local-upload";

export type StorefrontHomepageData = {
  hero: { title: string | null; text: string | null; imageStorageKey: string | null } | null;
  editorial: { title: string | null; text: string | null } | null;
  savoirFaire: {
    title: string | null;
    body: string | null;
    imageStorageKey: string | null;
  } | null;
  about: {
    title: string | null;
    subtitle: string | null;
    body: string | null;
    ctaLabel: string | null;
    ctaHref: string | null;
  } | null;
  newsletter: {
    title: string | null;
    subtitle: string | null;
  } | null;
  guarantees: {
    body: string | null;
  } | null;
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
  instagramUrl: string | null;
  facebookUrl: string | null;
};

export async function getStorefrontHomepage(): Promise<StorefrontHomepageData | null> {
  // Convention socle : boutique unique, résolue comme premier store créé
  // (même convention que settings, panier et contact — cf. lot R5).
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      instagramUrl: true,
      facebookUrl: true,
    },
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
          code: true,
          type: true,
          title: true,
          subtitle: true,
          body: true,
          ctaLabel: true,
          ctaHref: true,
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
  let savoirFaire: StorefrontHomepageData["savoirFaire"] = null;
  let about: StorefrontHomepageData["about"] = null;
  let newsletter: StorefrontHomepageData["newsletter"] = null;
  let guarantees: StorefrontHomepageData["guarantees"] = null;
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

    if (section.type === HomepageSectionType.EDITORIAL && section.code === "savoir-faire" && savoirFaire === null) {
      const imageKey = section.primaryImage?.storageKey ?? null;
      savoirFaire = {
        title: section.title ?? null,
        body: section.body ?? null,
        imageStorageKey: imageKey !== null && localUploadExists(imageKey) ? imageKey : null,
      };
    }

    if (section.type === HomepageSectionType.EDITORIAL && section.code === "about" && about === null) {
      about = {
        title: section.title ?? null,
        subtitle: section.subtitle ?? null,
        body: section.body ?? null,
        ctaLabel: section.ctaLabel ?? null,
        ctaHref: section.ctaHref ?? null,
      };
    }

    if (section.type === HomepageSectionType.EDITORIAL && section.code === "newsletter" && newsletter === null) {
      newsletter = {
        title: section.title ?? null,
        subtitle: section.subtitle ?? null,
      };
    }

    if (section.type === HomepageSectionType.EDITORIAL && section.code === "guarantees" && guarantees === null) {
      guarantees = { body: section.body ?? null };
    }

    if (section.type === HomepageSectionType.EDITORIAL && section.code !== "savoir-faire" && section.code !== "about" && section.code !== "newsletter" && section.code !== "guarantees" && editorial === null) {
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
          primaryImage: (() => {
              const key = fp.product.primaryImage?.storageKey ?? null;
              return key !== null && localUploadExists(key)
                ? { filePath: key, altText: fp.product.primaryImage?.altText ?? null }
                : null;
            })(),
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
          representativeImage: (() => {
              const key = fc.category.primaryImage?.storageKey ?? null;
              return key !== null && localUploadExists(key)
                ? { filePath: key, altText: fc.category.primaryImage?.altText ?? null }
                : null;
            })(),
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

  return {
    hero,
    editorial,
    savoirFaire,
    about,
    newsletter,
    guarantees,
    featuredProducts,
    featuredCategories,
    featuredPost,
    instagramUrl: store.instagramUrl ?? null,
    facebookUrl: store.facebookUrl ?? null,
  };
}
