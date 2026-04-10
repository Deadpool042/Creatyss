import {
  BlogPostStatus,
  CategoryStatus,
  HomepageStatus,
  ProductStatus,
} from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapAdminHomepageEditorData } from "../mappers";
import type { AdminHomepageEditorData } from "../types";

async function getDefaultStoreId(): Promise<string | null> {
  const store = await db.store.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
    },
  });

  return store?.id ?? null;
}

export async function getAdminHomepageEditorData(): Promise<AdminHomepageEditorData | null> {
  const storeId = await getDefaultStoreId();

  if (storeId === null) {
    return null;
  }

  const [homepage, productOptions, categoryOptions, blogPostOptions] = await Promise.all([
    db.homepage.findFirst({
      where: {
        storeId,
        archivedAt: null,
        status: {
          in: [HomepageStatus.DRAFT, HomepageStatus.ACTIVE],
        },
      },
      orderBy: [
        { isDefault: "desc" },
        { updatedAt: "desc" },
      ],
      select: {
        id: true,
        sections: {
          where: {
            archivedAt: null,
          },
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            code: true,
            type: true,
            title: true,
            body: true,
            primaryImage: {
              select: {
                storageKey: true,
              },
            },
            featuredProducts: {
              orderBy: {
                sortOrder: "asc",
              },
              select: {
                productId: true,
                sortOrder: true,
              },
            },
            featuredCategories: {
              orderBy: {
                sortOrder: "asc",
              },
              select: {
                categoryId: true,
                sortOrder: true,
              },
            },
            featuredPosts: {
              orderBy: {
                sortOrder: "asc",
              },
              select: {
                blogPostId: true,
                sortOrder: true,
              },
            },
          },
        },
      },
    }),
    db.product.findMany({
      where: {
        storeId,
        archivedAt: null,
        status: ProductStatus.ACTIVE,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    db.category.findMany({
      where: {
        archivedAt: null,
        status: CategoryStatus.ACTIVE,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    db.blogPost.findMany({
      where: {
        storeId,
        archivedAt: null,
        status: BlogPostStatus.ACTIVE,
      },
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
      },
    }),
  ]);

  if (homepage === null) {
    return null;
  }

  return mapAdminHomepageEditorData({
    homepage,
    productOptions,
    categoryOptions,
    blogPostOptions,
  });
}
