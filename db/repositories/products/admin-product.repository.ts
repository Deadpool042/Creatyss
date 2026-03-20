import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  clearNativeSimpleProductOfferFields,
  syncLegacyVariantCommercialFieldsFromSimpleProduct,
} from "@/db/repositories/products/simple-product-compat";
import {
  resolveSimpleProductOffer,
  type SimpleProductOffer,
  type SimpleProductOfferFields,
} from "@/entities/product/simple-product-offer";
import { canChangeProductTypeToSimple } from "@/entities/product/product-type-rules";
import { type ProductType } from "@/entities/product/product-input";
import {
  AdminProductRepositoryError,
  type AdminProductPublishContext,
  type AdminProductStatus,
  type AdminProductSummary,
  type AdminProductCategoryAssignment,
  type AdminProductDetail,
  type CreateAdminProductInput,
  type UpdateAdminProductInput,
  type UpdateAdminSimpleProductOfferInput,
} from "./admin-product.types";
import { ensureCategoriesExistInTx } from "./helpers/ensure-categories";
import { replaceProductCategoriesInTx } from "./helpers/replace-categories";
import { countVariantsInTx } from "./queries/count-variants";
import { readProductTypeInTx } from "./queries/read-product-type";
import type { TxClient } from "./types/tx-client";

// --- Internal helpers ---

function isValidProductId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

function normalizeCategoryIds(categoryIds: readonly string[]): string[] {
  return [...new Set(categoryIds)];
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
  // product_variants is introspected as 1:1 in Prisma (partial unique index on product_id) →
  // _count.product_variants is unavailable. Variant count is obtained via a separate groupBy
  // then joined in memory. category_count uses _count.product_categories (array relation).
  const [products, variantCounts] = await Promise.all([
    prisma.products.findMany({
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      include: { _count: { select: { product_categories: true } } },
    }),
    prisma.product_variants.groupBy({
      by: ["product_id"],
      _count: { id: true },
    }),
  ]);

  const variantCountMap = new Map(
    variantCounts.map((vc) => [vc.product_id.toString(), vc._count.id])
  );

  return products.map((p) => ({
    id: p.id.toString(),
    name: p.name,
    slug: p.slug,
    shortDescription: p.short_description,
    status: p.status as AdminProductStatus,
    productType: p.product_type as ProductType,
    isFeatured: p.is_featured,
    categoryCount: p._count.product_categories,
    variantCount: variantCountMap.get(p.id.toString()) ?? 0,
    createdAt: p.created_at.toISOString(),
    updatedAt: p.updated_at.toISOString(),
  }));
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
      const categoryIds = await ensureCategoriesExistInTx(
        tx,
        normalizeCategoryIds(input.categoryIds),
        () => {
          throw new AdminProductRepositoryError(
            "category_missing",
            "At least one selected category does not exist."
          );
        }
      );

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
      const categoryIds = await ensureCategoriesExistInTx(
        tx,
        normalizeCategoryIds(input.categoryIds),
        () => {
          throw new AdminProductRepositoryError(
            "category_missing",
            "At least one selected category does not exist."
          );
        }
      );
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

  return prisma.$transaction(async (tx) => {
    const existing = await tx.products.findUnique({
      where: { id: BigInt(id) },
      select: { status: true },
    });

    if (existing === null) {
      return null;
    }

    const newStatus: "draft" | "published" =
      existing.status === "published" ? "draft" : "published";

    const updated = await tx.products.update({
      where: { id: BigInt(id) },
      data: { status: newStatus },
      select: { status: true },
    });

    return updated.status as "draft" | "published";
  });
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
