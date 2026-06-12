import { HomepageSectionType, HomepageStatus } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";

const DEFAULT_HOMEPAGE_CODE = "default";
const DEFAULT_HOMEPAGE_TITLE = "Page d'accueil";

const HERO_SECTION_CODE = "hero";
const EDITORIAL_SECTION_CODE = "editorial";
const FEATURED_PRODUCTS_SECTION_CODE = "featured-products";
const FEATURED_CATEGORIES_SECTION_CODE = "featured-categories";
const FEATURED_BLOG_POSTS_SECTION_CODE = "featured-blog-posts";

type CreateAdminHomepageResult = {
  id: string;
};

export async function createAdminHomepage(): Promise<CreateAdminHomepageResult | null> {
  return withTransaction(async (tx) => {
    // Convention socle : boutique unique, résolue comme premier store créé
    // (même convention que settings, panier et contact — cf. lot R5).
    const store = await tx.store.findFirst({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
      },
    });

    if (store === null) {
      throw new Error("default_store_missing");
    }

    const existingHomepage = await tx.homepage.findFirst({
      where: {
        storeId: store.id,
        archivedAt: null,
      },
      orderBy: [
        { isDefault: "desc" },
        { updatedAt: "desc" },
      ],
      select: {
        id: true,
      },
    });

    if (existingHomepage !== null) {
      return existingHomepage;
    }

    return tx.homepage.upsert({
      where: {
        storeId_code: {
          storeId: store.id,
          code: DEFAULT_HOMEPAGE_CODE,
        },
      },
      update: {},
      create: {
        storeId: store.id,
        code: DEFAULT_HOMEPAGE_CODE,
        title: DEFAULT_HOMEPAGE_TITLE,
        status: HomepageStatus.DRAFT,
        isDefault: true,
        sections: {
          create: [
            {
              code: HERO_SECTION_CODE,
              type: HomepageSectionType.HERO,
              sortOrder: 10,
              isActive: true,
            },
            {
              code: EDITORIAL_SECTION_CODE,
              type: HomepageSectionType.EDITORIAL,
              sortOrder: 20,
              isActive: true,
            },
            {
              code: FEATURED_PRODUCTS_SECTION_CODE,
              type: HomepageSectionType.FEATURED_PRODUCTS,
              sortOrder: 30,
              isActive: true,
            },
            {
              code: FEATURED_CATEGORIES_SECTION_CODE,
              type: HomepageSectionType.FEATURED_CATEGORIES,
              sortOrder: 40,
              isActive: true,
            },
            {
              code: FEATURED_BLOG_POSTS_SECTION_CODE,
              type: HomepageSectionType.BLOG_POSTS,
              sortOrder: 50,
              isActive: true,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
  });
}
