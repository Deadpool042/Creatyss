import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  getVariantSimpleOfferFields,
  resolvePublishedSimpleOffer,
} from "../catalog.mappers";
import {
  loadPrimaryProductImagesByProductIds,
} from "../helpers/primary-image";
import { mapPublishedProductSummaryRecord } from "../helpers/product-summary";
import {
  publishedProductSummarySelect,
  type PublishedProductSummaryRecord,
} from "./recent-products.queries";

import type {
  DbId,
  PublishedProductListFilters,
  PublishedCatalogProductSummary,
} from "../types/outputs";

const publishedVariantOfferSelect = Prisma.validator<Prisma.product_variantsSelect>()({
  product_id: true,
  sku: true,
  price: true,
  compare_at_price: true,
  stock_quantity: true,
});

type PublishedVariantOfferRecord = Prisma.product_variantsGetPayload<{
  select: typeof publishedVariantOfferSelect;
}>;

function uniqueBigIntIds(ids: readonly bigint[]): bigint[] {
  const seen = new Set<string>();
  const uniqueIds: bigint[] = [];

  for (const id of ids) {
    const key = id.toString();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueIds.push(id);
  }

  return uniqueIds;
}

function toDbId(id: bigint): DbId {
  return id.toString();
}

function toPublishedProductType(value: string): "simple" | "variable" {
  return value as "simple" | "variable";
}

export type SimpleOfferNativeSource = Pick<
  PublishedProductSummaryRecord,
  "simple_sku" | "simple_price" | "simple_compare_at_price" | "simple_stock_quantity"
>;

export function getNativeSimpleOfferFields(source: SimpleOfferNativeSource) {
  return {
    sku: source.simple_sku,
    price: source.simple_price?.toString() ?? null,
    compareAtPrice: source.simple_compare_at_price?.toString() ?? null,
    stockQuantity: source.simple_stock_quantity,
  };
}

export async function loadPublishedVariantOffersByProductIds(
  productIds: readonly bigint[]
): Promise<Map<DbId, PublishedVariantOfferRecord[]>> {
  const uniqueProductIds = uniqueBigIntIds(productIds);
  const variantRowsByProductId = new Map<DbId, PublishedVariantOfferRecord[]>();

  if (uniqueProductIds.length === 0) {
    return variantRowsByProductId;
  }

  const variantRows = await prisma.product_variants.findMany({
    where: {
      product_id: { in: uniqueProductIds },
      status: "published",
    },
    select: publishedVariantOfferSelect,
  });

  for (const variantRow of variantRows) {
    const productId = toDbId(variantRow.product_id);
    const productVariants = variantRowsByProductId.get(productId);

    if (productVariants) {
      productVariants.push(variantRow);
      continue;
    }

    variantRowsByProductId.set(productId, [variantRow]);
  }

  return variantRowsByProductId;
}

export async function getPublishedProductIdsMatchingVariantColor(
  searchQuery: string
): Promise<bigint[]> {
  const rows = await prisma.product_variants.findMany({
    where: {
      status: "published",
      color_name: {
        contains: searchQuery,
        mode: "insensitive",
      },
    },
    select: { product_id: true },
  });

  return uniqueBigIntIds(rows.map((row) => row.product_id));
}

export async function buildPublishedProductsWhere(
  filters: PublishedProductListFilters
): Promise<Prisma.productsWhereInput> {
  const where: Prisma.productsWhereInput = {
    status: "published",
  };
  const andClauses: Prisma.productsWhereInput[] = [];

  if (filters.searchQuery !== null) {
    const matchingVariantProductIds = await getPublishedProductIdsMatchingVariantColor(
      filters.searchQuery
    );

    andClauses.push({
      OR: [
        {
          name: {
            contains: filters.searchQuery,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: filters.searchQuery,
            mode: "insensitive",
          },
        },
        {
          product_categories: {
            some: {
              categories: {
                OR: [
                  {
                    name: {
                      contains: filters.searchQuery,
                      mode: "insensitive",
                    },
                  },
                  {
                    slug: {
                      contains: filters.searchQuery,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          },
        },
        ...(matchingVariantProductIds.length > 0
          ? [
              {
                id: {
                  in: matchingVariantProductIds,
                },
              },
            ]
          : []),
      ],
    });
  }

  if (filters.categorySlug !== null) {
    andClauses.push({
      product_categories: {
        some: {
          categories: {
            slug: filters.categorySlug,
          },
        },
      },
    });
  }

  if (andClauses.length > 0) {
    where.AND = andClauses;
  }

  return where;
}

export function getPublishedProductsOrderBy(
  filters: PublishedProductListFilters
): Prisma.productsOrderByWithRelationInput[] {
  if (
    filters.searchQuery === null &&
    filters.categorySlug === null &&
    !filters.onlyAvailable
  ) {
    return [{ is_featured: "desc" }, { created_at: "desc" }, { id: "desc" }];
  }

  return [{ created_at: "desc" }, { id: "desc" }];
}

export async function listPublishedProductRows(
  filters: PublishedProductListFilters
): Promise<PublishedCatalogProductSummary[]> {
  const where = await buildPublishedProductsWhere(filters);
  const products = await prisma.products.findMany({
    where,
    orderBy: getPublishedProductsOrderBy(filters),
    select: publishedProductSummarySelect,
  });
  const productIds = products.map((product) => product.id);
  const [primaryImagesByProductId, variantOffersByProductId] = await Promise.all([
    loadPrimaryProductImagesByProductIds(productIds),
    loadPublishedVariantOffersByProductIds(productIds),
  ]);

  const publishedProducts = products.map((product) => {
    const productId = toDbId(product.id);
    const publishedVariantOffers = variantOffersByProductId.get(productId) ?? [];
    const simpleOffer = resolvePublishedSimpleOffer({
      productType: toPublishedProductType(product.product_type),
      native: getNativeSimpleOfferFields(product),
      legacyOffers: publishedVariantOffers.map(getVariantSimpleOfferFields),
    });
    const isAvailable =
      product.product_type === "simple"
        ? simpleOffer?.isAvailable ?? false
        : publishedVariantOffers.some((variant) => variant.stock_quantity > 0);

    return {
      ...mapPublishedProductSummaryRecord(
        product,
        primaryImagesByProductId.get(productId) ?? null
      ),
      isAvailable,
      simpleOffer,
    } satisfies PublishedCatalogProductSummary;
  });

  if (!filters.onlyAvailable) {
    return publishedProducts;
  }

  return publishedProducts.filter((product) => product.isAvailable);
}
