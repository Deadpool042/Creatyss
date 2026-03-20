import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import { mapPrismaProductImage } from "../catalog.mappers";

import type { DbId, PublishedProductImage } from "../types/outputs";

export const primaryProductImageSelect = Prisma.validator<Prisma.product_imagesSelect>()({
  id: true,
  product_id: true,
  variant_id: true,
  file_path: true,
  alt_text: true,
  sort_order: true,
  is_primary: true,
  created_at: true,
  updated_at: true,
});

type PrimaryProductImageRecord = Prisma.product_imagesGetPayload<{
  select: typeof primaryProductImageSelect;
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

function compareBigIntAsc(left: bigint, right: bigint): number {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function comparePrimaryProductImages(
  left: PrimaryProductImageRecord,
  right: PrimaryProductImageRecord
): number {
  const leftVariantPriority = left.variant_id === null ? 0 : 1;
  const rightVariantPriority = right.variant_id === null ? 0 : 1;

  if (leftVariantPriority !== rightVariantPriority) {
    return leftVariantPriority - rightVariantPriority;
  }

  if (left.is_primary !== right.is_primary) {
    return left.is_primary ? -1 : 1;
  }

  if (left.sort_order !== right.sort_order) {
    return left.sort_order - right.sort_order;
  }

  return compareBigIntAsc(left.id, right.id);
}

export function selectPrimaryProductImage(
  candidates: readonly PrimaryProductImageRecord[]
): PublishedProductImage | null {
  let selectedCandidate: PrimaryProductImageRecord | null = null;

  for (const candidate of candidates) {
    if (
      selectedCandidate === null ||
      comparePrimaryProductImages(candidate, selectedCandidate) < 0
    ) {
      selectedCandidate = candidate;
    }
  }

  return selectedCandidate === null ? null : mapPrismaProductImage(selectedCandidate);
}

export async function loadPrimaryProductImagesByProductIds(
  productIds: readonly bigint[]
): Promise<Map<DbId, PublishedProductImage | null>> {
  const uniqueProductIds = uniqueBigIntIds(productIds);
  const imagesByProductId = new Map<DbId, PublishedProductImage | null>();

  if (uniqueProductIds.length === 0) {
    return imagesByProductId;
  }

  const imageRows = await prisma.product_images.findMany({
    where: {
      product_id: { in: uniqueProductIds },
      OR: [{ variant_id: null }, { product_variants: { status: "published" } }],
    },
    select: primaryProductImageSelect,
  });

  const candidatesByProductId = new Map<DbId, PrimaryProductImageRecord[]>();

  for (const imageRow of imageRows) {
    const productId = toDbId(imageRow.product_id);
    const productImages = candidatesByProductId.get(productId);

    if (productImages) {
      productImages.push(imageRow);
      continue;
    }

    candidatesByProductId.set(productId, [imageRow]);
  }

  for (const productId of uniqueProductIds) {
    const key = toDbId(productId);
    imagesByProductId.set(key, selectPrimaryProductImage(candidatesByProductId.get(key) ?? []));
  }

  return imagesByProductId;
}
