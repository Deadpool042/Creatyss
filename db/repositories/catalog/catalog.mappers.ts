import {
  resolveSimpleProductOffer,
  type SimpleProductOfferFields,
} from "@/entities/product/simple-product-offer";
import type {
  DbId,
  MoneyAmount,
  FeaturedCategory,
  CatalogFilterCategory,
  PublishedProductImage,
  PublishedProductSummary,
  PublishedCatalogProductSummary,
  PublishedProductVariant,
  PublishedBlogPostSummary,
} from "./catalog.types";

// --- Internal Row types for $queryRaw results ---

type TimestampValue = Date | string;

export type CategoryRow = {
  id: DbId;
  name: string;
  slug: string;
  description: string | null;
  rep_image_file_path: string | null;
  rep_image_alt_text: string | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type ProductSimpleFieldsRow = {
  simple_sku: string | null;
  simple_price: MoneyAmount | null;
  simple_compare_at_price: MoneyAmount | null;
  simple_stock_quantity: number | null;
};

export type ProductSummaryRow = ProductSimpleFieldsRow & {
  id: DbId;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  product_type: "simple" | "variable";
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;

  primary_image_id: DbId | null;
  primary_image_product_id: DbId | null;
  primary_image_variant_id: DbId | null;
  primary_image_file_path: string | null;
  primary_image_alt_text: string | null;
  primary_image_sort_order: number | null;
  primary_image_is_primary: boolean | null;
  primary_image_created_at: TimestampValue | null;
  primary_image_updated_at: TimestampValue | null;
};

export type ProductCatalogSummaryRow = ProductSummaryRow & {
  is_available: boolean;
  legacy_exploitable_variant_count: number;
  legacy_variant_sku: string | null;
  legacy_variant_price: MoneyAmount | null;
  legacy_variant_compare_at_price: MoneyAmount | null;
  legacy_variant_stock_quantity: number | null;
};

export type BlogPostSummaryRow = {
  id: DbId;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_path: string | null;
  published_at: TimestampValue | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

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

// --- Mappers ---

export function mapCategory(row: CategoryRow): FeaturedCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    representativeImage:
      row.rep_image_file_path !== null
        ? { filePath: row.rep_image_file_path, altText: row.rep_image_alt_text }
        : null,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
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

function mapPrimaryProductImage(row: ProductSummaryRow): PublishedProductImage | null {
  if (
    row.primary_image_id === null ||
    row.primary_image_product_id === null ||
    row.primary_image_file_path === null ||
    row.primary_image_sort_order === null ||
    row.primary_image_is_primary === null ||
    row.primary_image_created_at === null ||
    row.primary_image_updated_at === null
  ) {
    return null;
  }

  return {
    id: row.primary_image_id,
    productId: row.primary_image_product_id,
    variantId: row.primary_image_variant_id,
    filePath: row.primary_image_file_path,
    altText: row.primary_image_alt_text,
    sortOrder: row.primary_image_sort_order,
    isPrimary: row.primary_image_is_primary,
    createdAt: toIsoTimestamp(row.primary_image_created_at),
    updatedAt: toIsoTimestamp(row.primary_image_updated_at),
  };
}

export function mapProductSummaryRow(row: ProductSummaryRow): PublishedProductSummary {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    productType: row.product_type,
    isFeatured: row.is_featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
    primaryImage: mapPrimaryProductImage(row),
  };
}

function getNativeSimpleOfferFields(row: ProductSimpleFieldsRow): SimpleProductOfferFields {
  return {
    sku: row.simple_sku,
    price: row.simple_price,
    compareAtPrice: row.simple_compare_at_price,
    stockQuantity: row.simple_stock_quantity,
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

function getCatalogLegacySimpleOffers(row: ProductCatalogSummaryRow): SimpleProductOfferFields[] {
  if (row.legacy_exploitable_variant_count !== 1) {
    return [];
  }

  return [
    {
      sku: row.legacy_variant_sku,
      price: row.legacy_variant_price,
      compareAtPrice: row.legacy_variant_compare_at_price,
      stockQuantity: row.legacy_variant_stock_quantity,
    },
  ];
}

export function mapCatalogProductSummaryRow(
  row: ProductCatalogSummaryRow
): PublishedCatalogProductSummary {
  const simpleOffer = resolvePublishedSimpleOffer({
    productType: row.product_type,
    native: getNativeSimpleOfferFields(row),
    legacyOffers: getCatalogLegacySimpleOffers(row),
  });

  return {
    ...mapProductSummaryRow(row),
    isAvailable: row.is_available,
    simpleOffer,
  };
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
