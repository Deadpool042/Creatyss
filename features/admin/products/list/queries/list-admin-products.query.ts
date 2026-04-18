//features/admin/products/list/queries/list-admin-products.query.ts
import { db } from "@/core/db";
import { mapAdminProductStatus } from "@/features/admin/products/mappers";
import type { AdminProductFeedItem } from "../types";

export type AdminProductsListView = "active" | "trash";

function formatMoney(value: { toString(): string } | null): string {
  if (value === null) {
    return "—";
  }

  const parsed = Number.parseFloat(value.toString());

  if (!Number.isFinite(parsed)) {
    return "—";
  }

  return `${parsed.toFixed(2)} €`;
}

export async function listAdminProducts(
  view: AdminProductsListView = "active"
): Promise<AdminProductFeedItem[]> {
  const products = await db.product.findMany({
    where: view === "trash" ? { archivedAt: { not: null } } : { archivedAt: null },
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
        orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          inventoryItems: {
            where: {
              archivedAt: null,
              status: "ACTIVE",
            },
            select: {
              onHandQuantity: true,
              reservedQuantity: true,
            },
          },
          prices: {
            where: {
              archivedAt: null,
              isActive: true,
            },
            orderBy: [{ createdAt: "asc" }],
            take: 1,
            select: {
              amount: true,
              compareAtAmount: true,
            },
          },
        },
      },
    },
  });

  return products.map((product) => {
    const categoryNames = product.productCategories.map((link) => link.category.name);

    const stockQuantity = product.variants.reduce((productTotal, variant) => {
      const variantTotal = variant.inventoryItems.reduce((sum, inventoryItem) => {
        return sum + inventoryItem.onHandQuantity - inventoryItem.reservedQuantity;
      }, 0);

      return productTotal + variantTotal;
    }, 0);

    const activePrices = product.variants
      .map((variant) => variant.prices[0] ?? null)
      .filter((price): price is NonNullable<typeof price> => price !== null);

    let minAmount: { toString(): string } | null = null;
    let minCompareAtAmount: { toString(): string } | null = null;
    let hasPromotion = false;

    for (const price of activePrices) {
      const amountValue = Number.parseFloat(price.amount.toString());
      const compareAtValue =
        price.compareAtAmount === null ? null : Number.parseFloat(price.compareAtAmount.toString());

      if (minAmount === null || amountValue < Number.parseFloat(minAmount.toString())) {
        minAmount = price.amount;
      }

      if (
        price.compareAtAmount !== null &&
        (minCompareAtAmount === null ||
          compareAtValue! < Number.parseFloat(minCompareAtAmount.toString()))
      ) {
        minCompareAtAmount = price.compareAtAmount;
      }

      if (compareAtValue !== null && compareAtValue > amountValue) {
        hasPromotion = true;
      }
    }

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDescription: product.shortDescription,
      status: mapAdminProductStatus(product.status),
      isFeatured: product.isFeatured,
      primaryImageUrl: product.primaryImage?.publicUrl ?? null,
      primaryImageAlt: product.primaryImage?.altText ?? null,
      categoryNames,
      categoryPathLabel: categoryNames.length > 0 ? categoryNames.join(" / ") : "",
      productTypeName: product.productType?.name ?? null,
      variantCount: product.variants.length,
      stockState: stockQuantity > 0 ? "in-stock" : "out-of-stock",
      stockQuantity,
      priceLabel: formatMoney(minAmount),
      compareAtPriceLabel: hasPromotion ? formatMoney(minCompareAtAmount) : "",
      hasPromotion,
      updatedAt: product.updatedAt.toISOString(),
    };
  });
}
