import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  syncNativeSimpleProductOfferFromLegacyVariant,
} from "@/db/repositories/simple-product-admin-compatibility";
import {
  canDeleteVariantForProductType,
  canCreateVariantForProductType,
  type ProductTypeCompatibilityErrorCode,
} from "@/entities/product/product-type-rules";
import { type ProductType } from "@/entities/product/product-input";

// --- Internal types ---

type AdminProductVariantStatus = "draft" | "published";

type ProductCompatibilityRow = {
  id: string;
  product_type: ProductType;
};

type RepositoryErrorCode = "sku_taken" | ProductTypeCompatibilityErrorCode;

// --- Public types ---

export type AdminProductVariant = {
  id: string;
  productId: string;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isDefault: boolean;
  status: AdminProductVariantStatus;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export class AdminProductVariantRepositoryError extends Error {
  readonly code: RepositoryErrorCode;

  constructor(code: RepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

// --- Internal helpers ---

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function mapVariantFromPrisma(v: {
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
  status: string;
  created_at: Date;
  updated_at: Date;
}): AdminProductVariant {
  return {
    id: v.id.toString(),
    productId: v.product_id.toString(),
    name: v.name,
    colorName: v.color_name,
    colorHex: v.color_hex,
    sku: v.sku,
    price: v.price.toString(),
    compareAtPrice: v.compare_at_price !== null ? v.compare_at_price.toString() : null,
    stockQuantity: v.stock_quantity,
    isDefault: v.is_default,
    status: v.status as AdminProductVariantStatus,
    isAvailable: v.status === "published" && v.stock_quantity > 0,
    createdAt: v.created_at.toISOString(),
    updatedAt: v.updated_at.toISOString(),
  };
}

function mapVariantPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (
      error.code === "P2002" &&
      typeof error.meta?.target === "object" &&
      Array.isArray(error.meta.target) &&
      error.meta.target.includes("sku")
    ) {
      throw new AdminProductVariantRepositoryError("sku_taken", "Variant SKU already exists.");
    }
  }

  throw error;
}

async function readProductTypeInTx(
  tx: Prisma.TransactionClient,
  productId: string
): Promise<ProductCompatibilityRow | null> {
  const row = await tx.products.findUnique({
    where: { id: BigInt(productId) },
    select: { id: true, product_type: true },
  });

  if (row === null) {
    return null;
  }

  return { id: row.id.toString(), product_type: row.product_type as ProductType };
}

async function countVariantsInTx(
  tx: Prisma.TransactionClient,
  productId: string
): Promise<number> {
  return tx.product_variants.count({ where: { product_id: BigInt(productId) } });
}

async function clearDefaultVariantInTx(
  tx: Prisma.TransactionClient,
  productId: string,
  excludedVariantId?: string
): Promise<void> {
  await tx.product_variants.updateMany({
    where: {
      product_id: BigInt(productId),
      is_default: true,
      ...(excludedVariantId ? { NOT: { id: BigInt(excludedVariantId) } } : {}),
    },
    data: { is_default: false },
  });
}

// --- Public functions ---

export async function listAdminProductVariants(productId: string): Promise<AdminProductVariant[]> {
  if (!isValidNumericId(productId)) {
    return [];
  }

  const rows = await prisma.product_variants.findMany({
    where: { product_id: BigInt(productId) },
    orderBy: [{ is_default: "desc" }, { id: "asc" }],
  });

  return rows.map(mapVariantFromPrisma);
}

export async function createAdminProductVariant(input: {
  productId: string;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isDefault: boolean;
  status: AdminProductVariantStatus;
}): Promise<AdminProductVariant | null> {
  if (!isValidNumericId(input.productId)) {
    return null;
  }

  return prisma
    .$transaction(async (tx) => {
      const product = await readProductTypeInTx(tx, input.productId);

      if (product === null) {
        return null;
      }

      const existingVariantCount = await countVariantsInTx(tx, input.productId);

      if (!canCreateVariantForProductType(product.product_type, existingVariantCount)) {
        throw new AdminProductVariantRepositoryError(
          "simple_product_single_variant_only",
          "A simple product can only have one sellable variant."
        );
      }

      if (input.isDefault) {
        await clearDefaultVariantInTx(tx, input.productId);
      }

      const row = await tx.product_variants.create({
        data: {
          product_id: BigInt(input.productId),
          name: input.name,
          color_name: input.colorName,
          color_hex: input.colorHex,
          sku: input.sku,
          price: input.price,
          compare_at_price: input.compareAtPrice,
          stock_quantity: input.stockQuantity,
          is_default: input.isDefault,
          status: input.status,
        },
      });

      if (product.product_type === "simple") {
        await syncNativeSimpleProductOfferFromLegacyVariant(tx, {
          productId: input.productId,
          variantId: row.id.toString(),
        });
      }

      return mapVariantFromPrisma(row);
    })
    .catch((error) => {
      if (error instanceof AdminProductVariantRepositoryError) {
        throw error;
      }

      mapVariantPrismaError(error);
    });
}

export async function updateAdminProductVariant(input: {
  id: string;
  productId: string;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isDefault: boolean;
  status: AdminProductVariantStatus;
}): Promise<AdminProductVariant | null> {
  if (!isValidNumericId(input.productId) || !isValidNumericId(input.id)) {
    return null;
  }

  return prisma
    .$transaction(async (tx) => {
      const product = await readProductTypeInTx(tx, input.productId);

      if (product === null) {
        return null;
      }

      if (input.isDefault) {
        await clearDefaultVariantInTx(tx, input.productId, input.id);
      }

      // updateMany preserves the original WHERE id + product_id condition atomically
      const updateResult = await tx.product_variants.updateMany({
        where: { id: BigInt(input.id), product_id: BigInt(input.productId) },
        data: {
          name: input.name,
          color_name: input.colorName,
          color_hex: input.colorHex,
          sku: input.sku,
          price: input.price,
          compare_at_price: input.compareAtPrice,
          stock_quantity: input.stockQuantity,
          is_default: input.isDefault,
          status: input.status,
        },
      });

      if (updateResult.count === 0) {
        return null;
      }

      const row = await tx.product_variants.findUnique({
        where: { id: BigInt(input.id) },
      });

      if (row === null) {
        return null;
      }

      if (product.product_type === "simple") {
        await syncNativeSimpleProductOfferFromLegacyVariant(tx, {
          productId: input.productId,
          variantId: input.id,
        });
      }

      return mapVariantFromPrisma(row);
    })
    .catch((error) => {
      if (error instanceof AdminProductVariantRepositoryError) {
        throw error;
      }

      mapVariantPrismaError(error);
    });
}

export async function deleteAdminProductVariant(
  productId: string,
  variantId: string
): Promise<boolean> {
  if (!isValidNumericId(productId) || !isValidNumericId(variantId)) {
    return false;
  }

  return prisma
    .$transaction(async (tx) => {
      const product = await readProductTypeInTx(tx, productId);

      if (product === null) {
        return false;
      }

      const existingVariantCount = await countVariantsInTx(tx, productId);

      if (!canDeleteVariantForProductType(product.product_type, existingVariantCount)) {
        throw new AdminProductVariantRepositoryError(
          "simple_product_requires_sellable_variant",
          "A simple product must keep its single sellable variant."
        );
      }

      const result = await tx.product_variants.deleteMany({
        where: { id: BigInt(variantId), product_id: BigInt(productId) },
      });

      if (result.count === 0) {
        return false;
      }

      if (product.product_type === "simple") {
        await syncNativeSimpleProductOfferFromLegacyVariant(tx, { productId });
      }

      return true;
    })
    .catch((error) => {
      if (error instanceof AdminProductVariantRepositoryError) {
        throw error;
      }

      throw error;
    });
}
