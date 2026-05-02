import { computeCatalogPriceSnapshot } from "@/entities/catalog/catalog-price-snapshot";
import type { DbExecutor } from "@/core/db/types";
import type { CurrencyCode, PriceTargetType, Prisma } from "@/prisma-generated/client";

const productCatalogPriceSnapshotSelect = {
  id: true,
  catalogPriceCents: true,
  catalogPriceCurrencyCode: true,
  catalogPriceSource: true,
  prices: {
    where: {
      isActive: true,
      archivedAt: null,
      priceList: {
        isDefault: true,
        status: "ACTIVE",
        archivedAt: null,
      },
    },
    select: {
      amount: true,
      isActive: true,
      archivedAt: true,
      priceList: {
        select: {
          id: true,
          currencyCode: true,
          status: true,
          isDefault: true,
          archivedAt: true,
        },
      },
    },
  },
  variants: {
    where: {
      archivedAt: null,
    },
    select: {
      status: true,
      archivedAt: true,
      prices: {
        where: {
          isActive: true,
          archivedAt: null,
          priceList: {
            isDefault: true,
            status: "ACTIVE",
            archivedAt: null,
          },
        },
        select: {
          amount: true,
          isActive: true,
          archivedAt: true,
          priceList: {
            select: {
              id: true,
              currencyCode: true,
              status: true,
              isDefault: true,
              archivedAt: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

type ProductCatalogPriceSnapshotRecord = Prisma.ProductGetPayload<{
  select: typeof productCatalogPriceSnapshotSelect;
}>;

export type RecomputeProductCatalogPriceSnapshotResult = {
  catalogPriceCents: number | null;
  catalogPriceCurrencyCode: CurrencyCode | null;
  catalogPriceSource: PriceTargetType | null;
  changed: boolean;
};

export type RecomputeProductCatalogPriceSnapshotsResult = {
  updatedCount: number;
  unchangedCount: number;
};

export class ProductNotFoundForCatalogPriceSnapshotError extends Error {
  readonly productId: string;

  constructor(productId: string) {
    super(`product_not_found_for_catalog_price_snapshot:${productId}`);
    this.name = "ProductNotFoundForCatalogPriceSnapshotError";
    this.productId = productId;
  }
}

export async function recomputeProductCatalogPriceSnapshot(
  executor: DbExecutor,
  productId: string
): Promise<RecomputeProductCatalogPriceSnapshotResult> {
  const product = await executor.product.findUnique({
    where: {
      id: productId,
    },
    select: productCatalogPriceSnapshotSelect,
  });

  if (product === null) {
    throw new ProductNotFoundForCatalogPriceSnapshotError(productId);
  }

  return recomputeFromLoadedProduct(executor, product);
}

export async function recomputeProductCatalogPriceSnapshots(
  executor: DbExecutor,
  productIds: readonly string[]
): Promise<RecomputeProductCatalogPriceSnapshotsResult> {
  const uniqueProductIds = [...new Set(productIds.filter((id) => id.trim().length > 0))];

  if (uniqueProductIds.length === 0) {
    return {
      updatedCount: 0,
      unchangedCount: 0,
    };
  }

  const products = await executor.product.findMany({
    where: {
      id: {
        in: uniqueProductIds,
      },
    },
    select: productCatalogPriceSnapshotSelect,
  });

  const productsById = new Map(products.map((product) => [product.id, product]));

  let updatedCount = 0;
  let unchangedCount = 0;

  for (const productId of uniqueProductIds) {
    const product = productsById.get(productId);

    if (!product) {
      throw new ProductNotFoundForCatalogPriceSnapshotError(productId);
    }

    const result = await recomputeFromLoadedProduct(executor, product);

    if (result.changed) {
      updatedCount += 1;
    } else {
      unchangedCount += 1;
    }
  }

  return {
    updatedCount,
    unchangedCount,
  };
}

async function recomputeFromLoadedProduct(
  executor: DbExecutor,
  product: ProductCatalogPriceSnapshotRecord
): Promise<RecomputeProductCatalogPriceSnapshotResult> {
  const snapshot = computeCatalogPriceSnapshot({
    prices: product.prices,
    variants: product.variants,
  });

  const changed =
    snapshot.catalogPriceCents !== product.catalogPriceCents ||
    snapshot.catalogPriceCurrencyCode !== product.catalogPriceCurrencyCode ||
    snapshot.catalogPriceSource !== product.catalogPriceSource;

  if (changed) {
    await executor.product.update({
      where: {
        id: product.id,
      },
      data: {
        catalogPriceCents: snapshot.catalogPriceCents,
        catalogPriceCurrencyCode: snapshot.catalogPriceCurrencyCode,
        catalogPriceSource: snapshot.catalogPriceSource,
      },
    });
  }

  return {
    catalogPriceCents: snapshot.catalogPriceCents,
    catalogPriceCurrencyCode: snapshot.catalogPriceCurrencyCode,
    catalogPriceSource: snapshot.catalogPriceSource,
    changed,
  };
}
