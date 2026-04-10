import { db } from "@/core/db";
import type { AdminProductDetails, AdminProductDisplayStatus } from "../types";

function mapStatus(status: string): AdminProductDisplayStatus {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "INACTIVE":
      return "inactive";
    case "ARCHIVED":
      return "archived";
    default:
      return "draft";
  }
}

export async function readAdminProductDetailsBySlug(
  slug: string
): Promise<AdminProductDetails | null> {
  const product = await db.product.findFirst({
    where: {
      slug,
      archivedAt: null,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      status: true,
      isFeatured: true,
      description: true,
      shortDescription: true,
      primaryImage: {
        select: {
          publicUrl: true,
          altText: true,
        },
      },
      productType: {
        select: {
          name: true,
        },
      },
      productCategories: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (product === null) {
    return null;
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    status: mapStatus(product.status),
    isFeatured: product.isFeatured,
    description: product.description,
    shortDescription: product.shortDescription,
    imageUrl: product.primaryImage?.publicUrl ?? null,
    imageAlt: product.primaryImage?.altText ?? null,
    productTypeName: product.productType?.name ?? null,
    categoryNames: product.productCategories.map((link) => link.category.name),
  };
}
