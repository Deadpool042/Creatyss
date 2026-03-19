import {
  resolveSimpleProductOffer,
  type SimpleProductOfferFields,
} from "@/entities/product/simple-product-offer";
import type {
  DbId,
  CatalogFilterCategory,
  PublishedProductImage,
  PublishedProductVariant,
  PublishedBlogPostSummary,
} from "./catalog.types";

type TimestampValue = Date | string;

// --- Timestamp helpers ---

export function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function toNullableIsoTimestamp(value: TimestampValue | null): string | null {
  if (value === null) {
    return null;
  }

  return toIsoTimestamp(value);
}

export function mapCatalogFilterCategory(row: {
  id: bigint;
  name: string;
  slug: string;
}): CatalogFilterCategory {
  return {
    id: row.id.toString(),
    name: row.name,
    slug: row.slug,
  };
}

export function resolvePublishedSimpleOffer(input: {
  productType: "simple" | "variable";
  native: SimpleProductOfferFields;
  legacyOffers: readonly SimpleProductOfferFields[];
}) {
  if (input.productType !== "simple") {
    return null;
  }

  return resolveSimpleProductOffer({
    native: input.native,
    legacyOffers: input.legacyOffers,
  });
}

export function mapPrismaProductImage(pi: {
  id: bigint;
  product_id: bigint;
  variant_id: bigint | null;
  file_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}): PublishedProductImage {
  return {
    id: pi.id.toString(),
    productId: pi.product_id.toString(),
    variantId: pi.variant_id?.toString() ?? null,
    filePath: pi.file_path,
    altText: pi.alt_text,
    sortOrder: pi.sort_order,
    isPrimary: pi.is_primary,
    createdAt: pi.created_at.toISOString(),
    updatedAt: pi.updated_at.toISOString(),
  };
}

export function mapPrismaProductVariant(
  pv: {
    id: bigint;
    product_id: bigint;
    name: string;
    color_name: string;
    color_hex: string | null;
    sku: string;
    price: { toString(): string };
    compare_at_price: { toString(): string } | null;
    stock_quantity: number;
    is_default: boolean;
    created_at: Date;
    updated_at: Date;
  },
  images: PublishedProductImage[]
): PublishedProductVariant {
  return {
    id: pv.id.toString(),
    productId: pv.product_id.toString(),
    name: pv.name,
    colorName: pv.color_name,
    colorHex: pv.color_hex,
    sku: pv.sku,
    price: pv.price.toString(),
    compareAtPrice: pv.compare_at_price?.toString() ?? null,
    stockQuantity: pv.stock_quantity,
    isDefault: pv.is_default,
    isAvailable: pv.stock_quantity > 0,
    createdAt: pv.created_at.toISOString(),
    updatedAt: pv.updated_at.toISOString(),
    images,
  };
}

export function getVariantSimpleOfferFields(pv: {
  sku: string;
  price: { toString(): string };
  compare_at_price: { toString(): string } | null;
  stock_quantity: number;
}): SimpleProductOfferFields {
  return {
    sku: pv.sku,
    price: pv.price.toString(),
    compareAtPrice: pv.compare_at_price?.toString() ?? null,
    stockQuantity: pv.stock_quantity,
  };
}

export function groupVariantImagesByVariantId(
  images: PublishedProductImage[]
): Map<DbId, PublishedProductImage[]> {
  const imagesByVariantId = new Map<DbId, PublishedProductImage[]>();

  for (const image of images) {
    if (image.variantId === null) {
      continue;
    }

    const variantImages = imagesByVariantId.get(image.variantId);

    if (variantImages) {
      variantImages.push(image);
      continue;
    }

    imagesByVariantId.set(image.variantId, [image]);
  }

  return imagesByVariantId;
}

export function getPublishedProductAvailability(input: {
  productType: "simple" | "variable";
  simpleOffer: ReturnType<typeof resolvePublishedSimpleOffer>;
  variants: readonly PublishedProductVariant[];
}): boolean {
  if (input.productType === "simple") {
    return input.simpleOffer?.isAvailable ?? false;
  }

  return input.variants.some((variant) => variant.isAvailable);
}

export function mapBlogPostSummary(row: {
  id: bigint | DbId;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_path: string | null;
  published_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}): PublishedBlogPostSummary {
  const id = typeof row.id === "bigint" ? row.id.toString() : row.id;

  return {
    id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImagePath: row.cover_image_path,
    publishedAt: row.published_at !== null ? toNullableIsoTimestamp(row.published_at) : null,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}
