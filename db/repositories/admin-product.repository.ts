import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  clearNativeSimpleProductOfferFields,
  syncLegacyVariantCommercialFieldsFromSimpleProduct,
} from "@/db/repositories/simple-product-admin-compatibility";
import {
  resolveSimpleProductOffer,
  type SimpleProductOffer,
  type SimpleProductOfferFields,
} from "@/entities/product/simple-product-offer";
import {
  canChangeProductTypeToSimple,
  type ProductTypeCompatibilityErrorCode,
} from "@/entities/product/product-type-rules";
import { type ProductType } from "@/entities/product/product-input";

// pg may return Date or string for timestamp columns depending on driver configuration
type TimestampValue = Date | string;

type AdminProductStatus = "draft" | "published";

// Used by listAdminProducts $queryRaw
type AdminProductSummaryRow = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  status: AdminProductStatus;
  product_type: ProductType;
  is_featured: boolean;
  category_count: number;
  variant_count: number;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type AdminProductTypeRow = {
  id: string;
  product_type: ProductType;
};

type CreateAdminProductInput = {
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: AdminProductStatus;
  productType: ProductType;
  isFeatured: boolean;
  categoryIds: string[];
};

type UpdateAdminProductInput = CreateAdminProductInput & {
  id: string;
};

type UpdateAdminSimpleProductOfferInput = {
  id: string;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
};

type RepositoryErrorCode =
  | "sku_taken"
  | "slug_taken"
  | "category_missing"
  | "product_referenced"
  | "simple_product_offer_requires_simple_product"
  | "simple_product_multiple_legacy_variants"
  | ProductTypeCompatibilityErrorCode;

export type AdminProductSummary = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  status: AdminProductStatus;
  productType: ProductType;
  isFeatured: boolean;
  categoryCount: number;
  variantCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminProductCategoryAssignment = {
  id: string;
  name: string;
  slug: string;
};

export type AdminProductDetail = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: AdminProductStatus;
  productType: ProductType;
  isFeatured: boolean;
  categories: AdminProductCategoryAssignment[];
  categoryIds: string[];
  simpleOfferFields: SimpleProductOfferFields;
  simpleOffer: SimpleProductOffer | null;
  createdAt: string;
  updatedAt: string;
};

export class AdminProductRepositoryError extends Error {
  readonly code: RepositoryErrorCode;

  constructor(code: RepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

// --- Internal helpers ---

function isValidProductId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function normalizeCategoryIds(categoryIds: readonly string[]): string[] {
  return [...new Set(categoryIds)];
}

function mapAdminProductSummary(row: AdminProductSummaryRow): AdminProductSummary {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    status: row.status,
    productType: row.product_type,
    isFeatured: row.is_featured,
    categoryCount: row.category_count,
    variantCount: row.variant_count,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

// Absorbs known Prisma errors and maps them to public domain errors.
// P2002 target inspection distinguishes slug (products) vs sku (product_variants).
function mapPrismaRepositoryError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      const targets = Array.isArray(target)
        ? target
        : typeof target === "string"
          ? [target]
          : [];

      const hasSlug = targets.some((t) => String(t).includes("slug"));
      const hasSku = targets.some((t) => String(t).includes("sku"));

      if (hasSlug) {
        throw new AdminProductRepositoryError("slug_taken", "Product slug already exists.");
      }

      if (hasSku) {
        throw new AdminProductRepositoryError("sku_taken", "Variant SKU already exists.");
      }
    }

    if (error.code === "P2003") {
      throw new AdminProductRepositoryError(
        "product_referenced",
        "Product is still referenced by other records."
      );
    }
  }

  throw error;
}

function assertCanSaveAsSimpleProduct(productType: ProductType, variantCount: number): void {
  if (productType === "simple" && !canChangeProductTypeToSimple(variantCount)) {
    throw new AdminProductRepositoryError(
      "simple_product_requires_single_variant",
      "A simple product can only have one sellable variant."
    );
  }
}

function assertProductSupportsNativeSimpleOffer(productType: ProductType): void {
  if (productType !== "simple") {
    throw new AdminProductRepositoryError(
      "simple_product_offer_requires_simple_product",
      "Native simple offer editing is reserved for simple products."
    );
  }
}

function assertCompatibleLegacyVariantCountForNativeSimpleOffer(variantCount: number): void {
  if (variantCount > 1) {
    throw new AdminProductRepositoryError(
      "simple_product_multiple_legacy_variants",
      "A simple product with multiple legacy variants is incoherent."
    );
  }
}

// --- Internal transaction helpers ---

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

async function ensureCategoriesExistInTx(
  tx: TxClient,
  categoryIds: readonly string[]
): Promise<string[]> {
  const normalizedIds = normalizeCategoryIds(categoryIds);

  if (normalizedIds.length === 0) {
    return [];
  }

  const count = await tx.categories.count({
    where: { id: { in: normalizedIds.map(BigInt) } },
  });

  if (count !== normalizedIds.length) {
    throw new AdminProductRepositoryError(
      "category_missing",
      "At least one selected category does not exist."
    );
  }

  return normalizedIds;
}

async function countVariantsInTx(tx: TxClient, productId: string): Promise<number> {
  return tx.product_variants.count({ where: { product_id: BigInt(productId) } });
}

async function readProductTypeInTx(
  tx: TxClient,
  productId: string
): Promise<AdminProductTypeRow | null> {
  const row = await tx.products.findUnique({
    where: { id: BigInt(productId) },
    select: { id: true, product_type: true },
  });

  if (row === null) {
    return null;
  }

  return { id: row.id.toString(), product_type: row.product_type as ProductType };
}

async function replaceProductCategoriesInTx(
  tx: TxClient,
  productId: string,
  categoryIds: readonly string[]
): Promise<void> {
  await tx.product_categories.deleteMany({ where: { product_id: BigInt(productId) } });

  if (categoryIds.length > 0) {
    await tx.product_categories.createMany({
      data: categoryIds.map((cid) => ({
        product_id: BigInt(productId),
        category_id: BigInt(cid),
      })),
    });
  }
}

// Mirrors findAdminProductById but uses tx for transactional consistency.
async function loadAdminProductDetailInTx(
  tx: TxClient,
  productId: string
): Promise<AdminProductDetail | null> {
  const product = await tx.products.findUnique({
    where: { id: BigInt(productId) },
    include: {
      product_categories: {
        include: { categories: true },
      },
    },
  });

  if (product === null) {
    return null;
  }

  const nativeSimpleOfferFields: SimpleProductOfferFields = {
    sku: product.simple_sku,
    price: product.simple_price !== null ? product.simple_price.toString() : null,
    compareAtPrice:
      product.simple_compare_at_price !== null
        ? product.simple_compare_at_price.toString()
        : null,
    stockQuantity: product.simple_stock_quantity,
  };

  const categories: AdminProductCategoryAssignment[] = [...product.product_categories]
    .sort((a, b) => {
      const nameCompare = a.categories.name
        .toLowerCase()
        .localeCompare(b.categories.name.toLowerCase());
      if (nameCompare !== 0) return nameCompare;
      return a.category_id < b.category_id ? -1 : a.category_id > b.category_id ? 1 : 0;
    })
    .map((pc) => ({
      id: pc.category_id.toString(),
      name: pc.categories.name,
      slug: pc.categories.slug,
    }));

  let simpleOffer: SimpleProductOffer | null = null;

  if (product.product_type === "simple") {
    const legacyVariants = await tx.product_variants.findMany({
      where: { product_id: BigInt(productId) },
      orderBy: [{ is_default: "desc" }, { id: "asc" }],
    });

    const legacyOffers: SimpleProductOfferFields[] = legacyVariants.map((v) => ({
      sku: v.sku,
      price: v.price.toString(),
      compareAtPrice: v.compare_at_price !== null ? v.compare_at_price.toString() : null,
      stockQuantity: v.stock_quantity,
    }));

    simpleOffer = resolveSimpleProductOffer({ native: nativeSimpleOfferFields, legacyOffers });
  }

  return {
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    shortDescription: product.short_description,
    description: product.description,
    seoTitle: product.seo_title,
    seoDescription: product.seo_description,
    status: product.status as AdminProductStatus,
    productType: product.product_type as ProductType,
    isFeatured: product.is_featured,
    categories,
    categoryIds: categories.map((c) => c.id),
    simpleOfferFields: nativeSimpleOfferFields,
    simpleOffer,
    createdAt: product.created_at.toISOString(),
    updatedAt: product.updated_at.toISOString(),
  };
}

// --- Public functions ---

export type AdminProductPublishContext = {
  status: "draft" | "published";
  productType: ProductType;
  variantCount: number;
};

export async function findAdminProductPublishContext(
  id: string
): Promise<AdminProductPublishContext | null> {
  if (!isValidProductId(id)) {
    return null;
  }

  // product_variants is introspected as 1:1 in Prisma → _count.product_variants unavailable.
  // Two queries: product fields + separate variant count.
  const product = await prisma.products.findUnique({
    where: { id: BigInt(id) },
    select: { status: true, product_type: true },
  });

  if (product === null) {
    return null;
  }

  const variantCount = await prisma.product_variants.count({
    where: { product_id: BigInt(id) },
  });

  return {
    status: product.status as "draft" | "published",
    productType: product.product_type as ProductType,
    variantCount,
  };
}

export async function listAdminProducts(): Promise<AdminProductSummary[]> {
  // product_variants is introspected as 1:1 in Prisma (partial unique index on product_id)
  // → _count.product_variants is unavailable. Using $queryRaw to preserve sub-query counts.
  const rows = await prisma.$queryRaw<AdminProductSummaryRow[]>(Prisma.sql`
    SELECT
      p.id::text AS id,
      p.name,
      p.slug,
      p.short_description,
      p.status,
      p.product_type,
      p.is_featured,
      (SELECT count(*)::int FROM product_categories pc WHERE pc.product_id = p.id) AS category_count,
      (SELECT count(*)::int FROM product_variants pv WHERE pv.product_id = p.id) AS variant_count,
      p.created_at,
      p.updated_at
    FROM products p
    ORDER BY p.created_at DESC, p.id DESC
  `);

  return rows.map(mapAdminProductSummary);
}

export async function findAdminProductById(id: string): Promise<AdminProductDetail | null> {
  if (!isValidProductId(id)) {
    return null;
  }

  const product = await prisma.products.findUnique({
    where: { id: BigInt(id) },
    include: {
      product_categories: {
        include: { categories: true },
      },
    },
  });

  if (product === null) {
    return null;
  }

  // Map native simple offer fields (Decimal → string)
  const nativeSimpleOfferFields: SimpleProductOfferFields = {
    sku: product.simple_sku,
    price: product.simple_price !== null ? product.simple_price.toString() : null,
    compareAtPrice:
      product.simple_compare_at_price !== null
        ? product.simple_compare_at_price.toString()
        : null,
    stockQuantity: product.simple_stock_quantity,
  };

  // Categories — sorted case-insensitively to mirror: lower(c.name) asc, c.id asc
  const categories: AdminProductCategoryAssignment[] = [...product.product_categories]
    .sort((a, b) => {
      const nameCompare = a.categories.name
        .toLowerCase()
        .localeCompare(b.categories.name.toLowerCase());
      if (nameCompare !== 0) return nameCompare;
      return a.category_id < b.category_id ? -1 : a.category_id > b.category_id ? 1 : 0;
    })
    .map((pc) => ({
      id: pc.category_id.toString(),
      name: pc.categories.name,
      slug: pc.categories.slug,
    }));

  // Resolve simple offer from native fields + legacy variants (simple products only)
  let simpleOffer: SimpleProductOffer | null = null;

  if (product.product_type === "simple") {
    const legacyVariants = await prisma.product_variants.findMany({
      where: { product_id: BigInt(id) },
      orderBy: [{ is_default: "desc" }, { id: "asc" }],
    });

    const legacyOffers: SimpleProductOfferFields[] = legacyVariants.map((v) => ({
      sku: v.sku,
      price: v.price.toString(),
      compareAtPrice: v.compare_at_price !== null ? v.compare_at_price.toString() : null,
      stockQuantity: v.stock_quantity,
    }));

    simpleOffer = resolveSimpleProductOffer({ native: nativeSimpleOfferFields, legacyOffers });
  }

  return {
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    shortDescription: product.short_description,
    description: product.description,
    seoTitle: product.seo_title,
    seoDescription: product.seo_description,
    status: product.status as AdminProductStatus,
    productType: product.product_type as ProductType,
    isFeatured: product.is_featured,
    categories,
    categoryIds: categories.map((c) => c.id),
    simpleOfferFields: nativeSimpleOfferFields,
    simpleOffer,
    createdAt: product.created_at.toISOString(),
    updatedAt: product.updated_at.toISOString(),
  };
}

export async function createAdminProduct(
  input: CreateAdminProductInput
): Promise<AdminProductDetail> {
  return prisma
    .$transaction(async (tx) => {
      const categoryIds = await ensureCategoriesExistInTx(tx, input.categoryIds);

      const product = await tx.products.create({
        data: {
          name: input.name,
          slug: input.slug,
          short_description: input.shortDescription,
          description: input.description,
          seo_title: input.seoTitle,
          seo_description: input.seoDescription,
          status: input.status,
          product_type: input.productType,
          is_featured: input.isFeatured,
        },
      });

      await replaceProductCategoriesInTx(tx, product.id.toString(), categoryIds);
      await clearNativeSimpleProductOfferFields(tx, product.id.toString());

      const detail = await loadAdminProductDetailInTx(tx, product.id.toString());

      if (detail === null) {
        throw new Error("Failed to reload product after creation.");
      }

      return detail;
    })
    .catch((error) => {
      if (error instanceof AdminProductRepositoryError) {
        throw error;
      }

      mapPrismaRepositoryError(error);
    });
}

export async function updateAdminProduct(
  input: UpdateAdminProductInput
): Promise<AdminProductDetail | null> {
  if (!isValidProductId(input.id)) {
    return null;
  }

  return prisma
    .$transaction(async (tx) => {
      const categoryIds = await ensureCategoriesExistInTx(tx, input.categoryIds);
      const variantCount = await countVariantsInTx(tx, input.id);

      assertCanSaveAsSimpleProduct(input.productType, variantCount);

      try {
        await tx.products.update({
          where: { id: BigInt(input.id) },
          data: {
            name: input.name,
            slug: input.slug,
            short_description: input.shortDescription,
            description: input.description,
            seo_title: input.seoTitle,
            seo_description: input.seoDescription,
            status: input.status,
            product_type: input.productType,
            is_featured: input.isFeatured,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
          return null;
        }

        throw e;
      }

      await replaceProductCategoriesInTx(tx, input.id, categoryIds);

      return loadAdminProductDetailInTx(tx, input.id);
    })
    .catch((error) => {
      if (error instanceof AdminProductRepositoryError) {
        throw error;
      }

      mapPrismaRepositoryError(error);
    });
}

export async function updateAdminSimpleProductOffer(
  input: UpdateAdminSimpleProductOfferInput
): Promise<AdminProductDetail | null> {
  if (!isValidProductId(input.id)) {
    return null;
  }

  return prisma
    .$transaction(async (tx) => {
      const product = await readProductTypeInTx(tx, input.id);

      if (product === null) {
        return null;
      }

      assertProductSupportsNativeSimpleOffer(product.product_type);

      const variantCount = await countVariantsInTx(tx, input.id);

      assertCompatibleLegacyVariantCountForNativeSimpleOffer(variantCount);

      try {
        await tx.products.update({
          where: { id: BigInt(input.id) },
          data: {
            simple_sku: input.sku,
            simple_price: input.price,
            simple_compare_at_price: input.compareAtPrice,
            simple_stock_quantity: input.stockQuantity,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
          return null;
        }

        throw e;
      }

      if (variantCount === 1) {
        await syncLegacyVariantCommercialFieldsFromSimpleProduct(tx, {
          productId: input.id,
          sku: input.sku,
          price: input.price,
          compareAtPrice: input.compareAtPrice,
          stockQuantity: input.stockQuantity,
        });
      }

      return loadAdminProductDetailInTx(tx, input.id);
    })
    .catch((error) => {
      if (error instanceof AdminProductRepositoryError) {
        throw error;
      }

      mapPrismaRepositoryError(error);
    });
}

export async function toggleAdminProductStatus(id: string): Promise<"draft" | "published" | null> {
  if (!isValidProductId(id)) {
    return null;
  }

  // Atomic toggle via $queryRaw — not expressible via Prisma ORM (row self-reference in SET clause)
  const rows = await prisma.$queryRaw<{ status: "draft" | "published" }[]>(Prisma.sql`
    UPDATE products
    SET
      status     = CASE WHEN status = 'published' THEN 'draft' ELSE 'published' END,
      updated_at = NOW()
    WHERE id = ${BigInt(id)}
    RETURNING status
  `);

  return rows[0]?.status ?? null;
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  if (!isValidProductId(id)) {
    return false;
  }

  try {
    await prisma.products.delete({ where: { id: BigInt(id) } });

    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return false;
    }

    mapPrismaRepositoryError(error);
  }
}
