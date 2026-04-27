import { db } from "@/core/db";
import { getCatalogVariantAvailability } from "@/features/storefront/catalog/helpers/catalog-availability";
import type { CatalogProductListItem } from "@/features/storefront/catalog/types";

export async function listPublishedProducts(input: {
  searchQuery: string | null;
  categorySlug: string | null;
  onlyAvailable: boolean;
}): Promise<CatalogProductListItem[]> {
  const products = await db.product.findMany({
    where: {
      status: "ACTIVE",
      archivedAt: null,
      ...(input.searchQuery
        ? {
            OR: [
              { name: { contains: input.searchQuery, mode: "insensitive" } },
              { slug: { contains: input.searchQuery, mode: "insensitive" } },
              { shortDescription: { contains: input.searchQuery, mode: "insensitive" } },
              { description: { contains: input.searchQuery, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(input.categorySlug
        ? {
            productCategories: {
              some: {
                category: {
                  slug: input.categorySlug,
                },
              },
            },
          }
        : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      shortDescription: true,
      description: true,
      isFeatured: true,
      primaryImage: {
        select: {
          storageKey: true,
          altText: true,
        },
      },
      variants: {
        where: {
          status: "ACTIVE",
          archivedAt: null,
        },
        select: {
          inventoryItems: {
            where: {
              status: "ACTIVE",
              archivedAt: null,
            },
            select: {
              onHandQuantity: true,
              reservedQuantity: true,
            },
          },
        },
      },
    },
  });

  const mapped = products.map((product) => {
    const isAvailable = product.variants.some(getCatalogVariantAvailability);

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      isFeatured: product.isFeatured,
      isAvailable,
      primaryImage: product.primaryImage
        ? {
            filePath: product.primaryImage.storageKey,
            altText: product.primaryImage.altText,
          }
        : null,
    };
  });

  return input.onlyAvailable ? mapped.filter((product) => product.isAvailable) : mapped;
}
