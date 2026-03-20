import { loadPrimaryProductImagesByProductIds } from "./primary-image";
import { prisma } from "@/db/prisma-client";

import type { DbId, FeaturedCategory, PublishedProductImage } from "../types/outputs";

type ProductRecencyRecord = {
  id: bigint;
  created_at: Date;
};

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

function compareBigIntAsc(left: bigint, right: bigint): number {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function compareBigIntDesc(left: bigint, right: bigint): number {
  return compareBigIntAsc(right, left);
}

function isMoreRecentProduct(
  candidate: ProductRecencyRecord,
  current: ProductRecencyRecord
): boolean {
  const createdAtDelta = candidate.created_at.getTime() - current.created_at.getTime();

  if (createdAtDelta !== 0) {
    return createdAtDelta > 0;
  }

  return compareBigIntDesc(candidate.id, current.id) < 0;
}

function getRepresentativeImage(
  primaryImage: PublishedProductImage | null
): FeaturedCategory["representativeImage"] {
  if (primaryImage === null) {
    return null;
  }

  return {
    filePath: primaryImage.filePath,
    altText: primaryImage.altText,
  };
}

export async function loadRepresentativeImagesByCategoryIds(
  categoryIds: readonly bigint[]
): Promise<Map<DbId, FeaturedCategory["representativeImage"]>> {
  const uniqueCategoryIds = uniqueBigIntIds(categoryIds);
  const representativeImagesByCategoryId = new Map<DbId, FeaturedCategory["representativeImage"]>();

  if (uniqueCategoryIds.length === 0) {
    return representativeImagesByCategoryId;
  }

  const productCategoryRows = await prisma.product_categories.findMany({
    where: { category_id: { in: uniqueCategoryIds } },
    select: {
      category_id: true,
      product_id: true,
    },
  });

  const productIds = uniqueBigIntIds(productCategoryRows.map((row) => row.product_id));

  if (productIds.length === 0) {
    return representativeImagesByCategoryId;
  }

  const publishedProducts = await prisma.products.findMany({
    where: {
      id: { in: productIds },
      status: "published",
    },
    select: {
      id: true,
      created_at: true,
    },
  });

  const publishedProductsById = new Map<DbId, ProductRecencyRecord>();

  for (const product of publishedProducts) {
    publishedProductsById.set(toDbId(product.id), product);
  }

  const latestProductByCategoryId = new Map<DbId, ProductRecencyRecord>();

  for (const row of productCategoryRows) {
    const categoryId = toDbId(row.category_id);
    const publishedProduct = publishedProductsById.get(toDbId(row.product_id));

    if (publishedProduct === undefined) {
      continue;
    }

    const currentProduct = latestProductByCategoryId.get(categoryId);

    if (currentProduct === undefined || isMoreRecentProduct(publishedProduct, currentProduct)) {
      latestProductByCategoryId.set(categoryId, publishedProduct);
    }
  }

  const representativeProductIds = uniqueBigIntIds(
    [...latestProductByCategoryId.values()].map((product) => product.id)
  );
  const primaryImagesByProductId =
    await loadPrimaryProductImagesByProductIds(representativeProductIds);

  for (const categoryId of uniqueCategoryIds) {
    const key = toDbId(categoryId);
    const latestProduct = latestProductByCategoryId.get(key);

    if (latestProduct === undefined) {
      representativeImagesByCategoryId.set(key, null);
      continue;
    }

    representativeImagesByCategoryId.set(
      key,
      getRepresentativeImage(primaryImagesByProductId.get(toDbId(latestProduct.id)) ?? null)
    );
  }

  return representativeImagesByCategoryId;
}
