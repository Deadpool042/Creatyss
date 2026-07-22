import "server-only";

import type { Prisma } from "@/prisma-generated/client";
import { localUploadExists } from "@/core/uploads/check-local-upload";
import {
  getCatalogProductAvailabilityStatus,
  getCatalogVariantAvailability,
} from "@/features/storefront/catalog/helpers/catalog-availability";
import { formatCatalogMoney } from "@/features/storefront/catalog/helpers/catalog-pricing";
import type { CatalogProductListItem } from "@/features/storefront/catalog/types";

export type CatalogListingSort = "featured" | "newest" | "name" | "price-asc" | "price-desc";

export const publishedProductListingSelect = {
  id: true,
  storeId: true,
  slug: true,
  name: true,
  shortDescription: true,
  description: true,
  isFeatured: true,
  catalogPriceCents: true,
  publishedAt: true,
  updatedAt: true,
  prices: {
    where: {
      isActive: true,
      archivedAt: null,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 1,
    select: {
      amount: true,
      compareAtAmount: true,
    },
  },
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
      prices: {
        where: {
          isActive: true,
          archivedAt: null,
        },
        orderBy: {
          createdAt: "asc",
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
              id: true,
              option: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
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
      availabilityRecords: {
        where: {
          archivedAt: null,
        },
        select: {
          status: true,
          isSellable: true,
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

export type PublishedProductListingRecord = Prisma.ProductGetPayload<{
  select: typeof publishedProductListingSelect;
}>;

function decimalAmountToCents(value: { toString(): string } | null): number | null {
  if (value === null) {
    return null;
  }

  const normalized = value.toString().trim();
  const match = normalized.match(/^(\d+)(?:\.(\d{1,2}))?$/);

  if (!match) {
    return null;
  }

  const eurosPart = match[1];

  if (eurosPart === undefined) {
    return null;
  }

  const euros = Number.parseInt(eurosPart, 10);

  if (!Number.isSafeInteger(euros)) {
    return null;
  }

  const decimals = match[2] ?? "";
  const centsPart = decimals.length === 0 ? 0 : Number.parseInt(decimals.padEnd(2, "0"), 10);

  if (!Number.isSafeInteger(centsPart)) {
    return null;
  }

  const totalCents = euros * 100 + centsPart;

  return Number.isSafeInteger(totalCents) ? totalCents : null;
}

export function getPublishedProductDisplayPriceAmount(
  product: PublishedProductListingRecord
): { toString(): string } | null {
  return product.prices[0]?.amount ?? product.variants[0]?.prices[0]?.amount ?? null;
}

export function getPublishedProductDisplayCompareAtAmount(
  product: PublishedProductListingRecord
): { toString(): string } | null {
  const productLevelPrice = product.prices[0];

  if (productLevelPrice) {
    const displayPriceCents = decimalAmountToCents(productLevelPrice.amount);
    const compareAtCents = decimalAmountToCents(productLevelPrice.compareAtAmount);

    if (
      displayPriceCents === null ||
      compareAtCents === null ||
      compareAtCents <= displayPriceCents
    ) {
      return null;
    }

    return productLevelPrice.compareAtAmount;
  }

  const variantLevelPrice = product.variants[0]?.prices[0];

  if (!variantLevelPrice) {
    return null;
  }

  const displayPriceCents = decimalAmountToCents(variantLevelPrice.amount);
  const compareAtCents = decimalAmountToCents(variantLevelPrice.compareAtAmount);

  if (
    displayPriceCents === null ||
    compareAtCents === null ||
    compareAtCents <= displayPriceCents
  ) {
    return null;
  }

  return variantLevelPrice.compareAtAmount;
}

export function getPublishedProductDisplayPriceCents(
  product: PublishedProductListingRecord
): number | null {
  return decimalAmountToCents(getPublishedProductDisplayPriceAmount(product));
}

export function getPublishedProductsOrderBy(
  sort: CatalogListingSort
): Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "price-asc") {
    return [{ catalogPriceCents: { sort: "asc", nulls: "last" } }, { id: "asc" }];
  }

  if (sort === "price-desc") {
    return [{ catalogPriceCents: { sort: "desc", nulls: "last" } }, { id: "desc" }];
  }

  if (sort === "name") {
    return [{ name: "asc" }, { updatedAt: "desc" }, { id: "asc" }];
  }

  if (sort === "newest") {
    return [{ updatedAt: "desc" }, { id: "desc" }];
  }

  return [{ isFeatured: "desc" }, { updatedAt: "desc" }, { id: "desc" }];
}

export function mapPublishedProductListingRecord(
  product: PublishedProductListingRecord
): CatalogProductListItem {
  const availabilityStatus = getCatalogProductAvailabilityStatus(product.variants);
  const isAvailable = product.variants.some(getCatalogVariantAvailability);
  const variantCount = product.variants.length;

  const colorValueIds = new Set<string>();

  for (const variant of product.variants) {
    for (const optionValue of variant.optionValues) {
      const optionName = optionValue.optionValue.option.name.trim().toLowerCase();

      if (optionName === "couleur" || optionName === "color") {
        colorValueIds.add(optionValue.optionValue.id);
      }
    }
  }

  const primaryPrice = getPublishedProductDisplayPriceAmount(product);
  const compareAtPrice = getPublishedProductDisplayCompareAtAmount(product);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    isFeatured: product.isFeatured,
    isAvailable,
    availabilityStatus,
    price: primaryPrice === null ? null : formatCatalogMoney(primaryPrice),
    compareAtPrice: compareAtPrice === null ? null : formatCatalogMoney(compareAtPrice),
    variantCount,
    colorCount: colorValueIds.size,
    primaryImage: (() => {
      const key = product.primaryImage?.storageKey ?? null;
      return key !== null && localUploadExists(key)
        ? { filePath: key, altText: product.primaryImage?.altText ?? null }
        : null;
    })(),
  };
}

type PublishedProductsPageCursorPayload = {
  sort: CatalogListingSort;
  id: string;
  name: string;
  isFeatured: boolean;
  updatedAt: string;
  catalogPriceCents: number | null;
};

export function encodePublishedProductsPageCursor(
  item: PublishedProductListingRecord,
  sort: CatalogListingSort
): string {
  const payload: PublishedProductsPageCursorPayload = {
    sort,
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    updatedAt: item.updatedAt.toISOString(),
    catalogPriceCents:
      typeof item.catalogPriceCents === "number" && Number.isSafeInteger(item.catalogPriceCents)
        ? item.catalogPriceCents
        : null,
  };

  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodePublishedProductsPageCursor(
  cursor: string,
  expectedSort: CatalogListingSort
): PublishedProductsPageCursorPayload | null {
  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf8");
    const parsed: unknown = JSON.parse(decoded);

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    if (
      !("sort" in parsed) ||
      !("id" in parsed) ||
      !("name" in parsed) ||
      !("isFeatured" in parsed) ||
      !("updatedAt" in parsed) ||
      !("catalogPriceCents" in parsed)
    ) {
      return null;
    }

    if (
      parsed.sort !== "featured" &&
      parsed.sort !== "newest" &&
      parsed.sort !== "name" &&
      parsed.sort !== "price-asc" &&
      parsed.sort !== "price-desc"
    ) {
      return null;
    }

    if (parsed.sort !== expectedSort) {
      return null;
    }

    const catalogPriceCentsRaw = parsed.catalogPriceCents;
    const catalogPriceCents =
      typeof catalogPriceCentsRaw === "number" && Number.isSafeInteger(catalogPriceCentsRaw)
        ? catalogPriceCentsRaw
        : catalogPriceCentsRaw === null
          ? null
          : undefined;

    if (
      typeof parsed.id !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.isFeatured !== "boolean" ||
      typeof parsed.updatedAt !== "string" ||
      catalogPriceCents === undefined
    ) {
      return null;
    }

    return {
      sort: parsed.sort,
      id: parsed.id,
      name: parsed.name,
      isFeatured: parsed.isFeatured,
      updatedAt: parsed.updatedAt,
      catalogPriceCents,
    };
  } catch {
    return null;
  }
}

export function buildPublishedProductsCursorWhere(
  sort: CatalogListingSort,
  cursorPayload: PublishedProductsPageCursorPayload
): Prisma.ProductWhereInput {
  if (sort === "price-asc") {
    if (cursorPayload.catalogPriceCents === null) {
      return {
        catalogPriceCents: null,
        id: {
          gt: cursorPayload.id,
        },
      };
    }

    return {
      OR: [
        {
          catalogPriceCents: {
            gt: cursorPayload.catalogPriceCents,
          },
        },
        {
          catalogPriceCents: cursorPayload.catalogPriceCents,
          id: {
            gt: cursorPayload.id,
          },
        },
        {
          catalogPriceCents: null,
        },
      ],
    };
  }

  if (sort === "price-desc") {
    if (cursorPayload.catalogPriceCents === null) {
      return {
        catalogPriceCents: null,
        id: {
          lt: cursorPayload.id,
        },
      };
    }

    return {
      OR: [
        {
          catalogPriceCents: {
            lt: cursorPayload.catalogPriceCents,
          },
        },
        {
          catalogPriceCents: cursorPayload.catalogPriceCents,
          id: {
            lt: cursorPayload.id,
          },
        },
        {
          catalogPriceCents: null,
        },
      ],
    };
  }

  if (sort === "name") {
    return {
      OR: [
        { name: { gt: cursorPayload.name } },
        {
          name: cursorPayload.name,
          updatedAt: { lt: new Date(cursorPayload.updatedAt) },
        },
        {
          name: cursorPayload.name,
          updatedAt: new Date(cursorPayload.updatedAt),
          id: { gt: cursorPayload.id },
        },
      ],
    };
  }

  const updatedAtDate = new Date(cursorPayload.updatedAt);

  if (sort === "newest") {
    return {
      OR: [
        {
          updatedAt: updatedAtDate,
          id: {
            lt: cursorPayload.id,
          },
        },
        {
          updatedAt: {
            lt: updatedAtDate,
          },
        },
      ],
    };
  }

  const orFilters: Prisma.ProductWhereInput[] = [];

  if (cursorPayload.isFeatured) {
    orFilters.push({ isFeatured: false });
  }

  orFilters.push(
    {
      isFeatured: cursorPayload.isFeatured,
      updatedAt: {
        lt: updatedAtDate,
      },
    },
    {
      isFeatured: cursorPayload.isFeatured,
      updatedAt: updatedAtDate,
      id: {
        lt: cursorPayload.id,
      },
    }
  );

  return { OR: orFilters };
}
