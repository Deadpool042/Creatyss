import { db } from "@/core/db";
import type { AdminProductFeedItem } from "../types";

function mapProductStatus(status: string): AdminProductFeedItem["status"] {
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

export async function listAdminProducts(): Promise<AdminProductFeedItem[]> {
  const products = await db.product.findMany({
    where: {
      archivedAt: null,
    },
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      shortDescription: true,
      status: true,
      isFeatured: true,
      updatedAt: true,
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
      variants: {
        where: {
          archivedAt: null,
        },
        select: {
          id: true,
        },
      },
    },
  });

  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    status: mapProductStatus(product.status),
    isFeatured: product.isFeatured,
    primaryImageUrl: product.primaryImage?.publicUrl ?? null,
    primaryImageAlt: product.primaryImage?.altText ?? null,
    categoryNames: product.productCategories.map((link) => link.category.name),
    categoryPathLabel:
      product.productCategories.length > 0
        ? product.productCategories.map((link) => link.category.name).join(" / ")
        : null,
    productTypeName: product.productType?.name ?? null,
    variantCount: product.variants.length,
    stockState: product.variants.length > 0 ? "in-stock" : "out-of-stock",
    stockQuantity: null,
    priceLabel: "",
    compareAtPriceLabel: "",
    hasPromotion: false,
    updatedAt: product.updatedAt.toISOString(),
  }));
}
