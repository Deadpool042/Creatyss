//features/admin/products/details/queries/read-admin-product-details-by-slug.query.ts
import { db } from "@core/db";
import { mapProductDetails } from "../mappers/map-product-details";
import type { AdminProductDetails } from "../types/product-detail-types";

export async function readAdminProductDetailsBySlug(
  slug: string
): Promise<AdminProductDetails | null> {
  const normalizedSlug = slug.trim();

  if (normalizedSlug.length === 0) {
    return null;
  }

  const product = await db.product.findFirst({
    where: {
      slug: normalizedSlug,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      shortDescription: true,
      description: true,
      status: true,
      isFeatured: true,
      updatedAt: true,
      productType: {
        select: {
          code: true,
        },
      },
      primaryImage: {
        select: {
          publicUrl: true,
          altText: true,
        },
      },
      productCategories: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          isPrimary: true,
          sortOrder: true,
          category: {
            select: {
              id: true,
              slug: true,
              name: true,
            },
          },
        },
      },
      prices: {
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          amount: true,
          compareAtAmount: true,
        },
      },
      variants: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
        select: {
          id: true,
          slug: true,
          name: true,
          sku: true,
          status: true,
          primaryImage: {
            select: {
              publicUrl: true,
              altText: true,
            },
          },
          prices: {
            where: {
              isActive: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              amount: true,
              compareAtAmount: true,
            },
          },
          optionValues: {
            select: {
              optionValue: {
                select: {
                  label: true,
                  value: true,
                  option: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return mapProductDetails(product);
}
