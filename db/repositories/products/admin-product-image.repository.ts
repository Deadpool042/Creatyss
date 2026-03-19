import { prisma } from "@/db/prisma-client";

// Structural type aligned with what Prisma returns for product_images (without relations)
type PrismaProductImageData = {
  id: bigint;
  product_id: bigint;
  variant_id: bigint | null;
  file_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
};

import {
  AdminProductImageRepositoryError,
  type AdminProductImage,
  type CreateAdminProductImageInput,
  type UpdateAdminProductImageInput,
  type UpsertAdminPrimaryProductImageInput,
  type UpsertAdminPrimaryVariantImageInput,
} from "./admin-product-image.types";

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function mapPrismaProductImage(row: PrismaProductImageData): AdminProductImage {
  return {
    id: row.id.toString(),
    productId: row.product_id.toString(),
    variantId: row.variant_id !== null ? row.variant_id.toString() : null,
    filePath: row.file_path,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    isPrimary: row.is_primary,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

// --- Internal transaction helpers ---

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

async function productExistsInTx(tx: TxClient, productId: string): Promise<boolean> {
  return (await tx.products.count({ where: { id: BigInt(productId) } })) > 0;
}

async function variantExistsInTx(
  tx: TxClient,
  productId: string,
  variantId: string
): Promise<boolean> {
  return (
    (await tx.product_variants.count({
      where: { id: BigInt(variantId), product_id: BigInt(productId) },
    })) > 0
  );
}

// Mirrors the original: product scope filters on product_id + variant_id IS NULL,
// variant scope filters on variant_id only (matching original SQL).
async function clearPrimaryImageInScopeTx(
  tx: TxClient,
  productId: string,
  variantId: string | null,
  excludedImageId?: string
): Promise<void> {
  if (variantId === null) {
    await tx.product_images.updateMany({
      where: {
        product_id: BigInt(productId),
        variant_id: null,
        is_primary: true,
        ...(excludedImageId ? { NOT: { id: BigInt(excludedImageId) } } : {}),
      },
      data: { is_primary: false },
    });
  } else {
    await tx.product_images.updateMany({
      where: {
        variant_id: BigInt(variantId),
        is_primary: true,
        ...(excludedImageId ? { NOT: { id: BigInt(excludedImageId) } } : {}),
      },
      data: { is_primary: false },
    });
  }
}

async function setPrimaryImageInScopeTx(
  tx: TxClient,
  productId: string,
  variantId: string | null,
  filePath: string
): Promise<AdminProductImage> {
  const scopeWhere =
    variantId !== null
      ? { product_id: BigInt(productId), variant_id: BigInt(variantId) }
      : { product_id: BigInt(productId), variant_id: null };

  const existingPrimary = await tx.product_images.findFirst({
    where: { ...scopeWhere, is_primary: true },
  });

  const existingScoped = await tx.product_images.findFirst({
    where: { ...scopeWhere, file_path: filePath },
    orderBy: { id: "asc" },
  });

  const targetImage = existingScoped ?? existingPrimary ?? null;

  if (targetImage !== null) {
    await clearPrimaryImageInScopeTx(
      tx,
      productId,
      variantId,
      targetImage.id.toString()
    );

    const updated = await tx.product_images.update({
      where: { id: targetImage.id },
      data: { file_path: filePath, alt_text: null, sort_order: 0, is_primary: true },
    });

    return mapPrismaProductImage(updated);
  }

  await clearPrimaryImageInScopeTx(tx, productId, variantId);

  const created = await tx.product_images.create({
    data: {
      product_id: BigInt(productId),
      variant_id: variantId !== null ? BigInt(variantId) : null,
      file_path: filePath,
      alt_text: null,
      sort_order: 0,
      is_primary: true,
    },
  });

  return mapPrismaProductImage(created);
}

// --- Public functions ---

export async function listAdminProductImages(productId: string): Promise<AdminProductImage[]> {
  if (!isValidNumericId(productId)) {
    return [];
  }

  const rows = await prisma.product_images.findMany({
    where: { product_id: BigInt(productId) },
    orderBy: [{ variant_id: { sort: "asc", nulls: "first" } }, { sort_order: "asc" }, { id: "asc" }],
  });

  return rows.map(mapPrismaProductImage);
}

export async function findAdminPrimaryProductImage(
  productId: string
): Promise<AdminProductImage | null> {
  if (!isValidNumericId(productId)) {
    return null;
  }

  const row = await prisma.product_images.findFirst({
    where: { product_id: BigInt(productId), variant_id: null, is_primary: true },
  });

  return row !== null ? mapPrismaProductImage(row) : null;
}

export async function findAdminPrimaryVariantImage(
  productId: string,
  variantId: string
): Promise<AdminProductImage | null> {
  if (!isValidNumericId(productId) || !isValidNumericId(variantId)) {
    return null;
  }

  const row = await prisma.product_images.findFirst({
    where: { product_id: BigInt(productId), variant_id: BigInt(variantId), is_primary: true },
  });

  return row !== null ? mapPrismaProductImage(row) : null;
}

export async function createAdminProductImage(
  input: CreateAdminProductImageInput
): Promise<AdminProductImage | null> {
  if (!isValidNumericId(input.productId)) {
    return null;
  }

  if (input.variantId !== null && !isValidNumericId(input.variantId)) {
    throw new AdminProductImageRepositoryError("Selected variant does not belong to this product.");
  }

  return prisma.$transaction(async (tx) => {
    if (!(await productExistsInTx(tx, input.productId))) {
      return null;
    }

    if (
      input.variantId !== null &&
      !(await variantExistsInTx(tx, input.productId, input.variantId))
    ) {
      throw new AdminProductImageRepositoryError(
        "Selected variant does not belong to this product."
      );
    }

    if (input.isPrimary) {
      await clearPrimaryImageInScopeTx(tx, input.productId, input.variantId);
    }

    const row = await tx.product_images.create({
      data: {
        product_id: BigInt(input.productId),
        variant_id: input.variantId !== null ? BigInt(input.variantId) : null,
        file_path: input.filePath,
        alt_text: input.altText,
        sort_order: input.sortOrder,
        is_primary: input.isPrimary,
      },
    });

    return mapPrismaProductImage(row);
  });
}

export async function upsertAdminPrimaryProductImage(
  input: UpsertAdminPrimaryProductImageInput
): Promise<AdminProductImage | null> {
  if (!isValidNumericId(input.productId)) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    if (!(await productExistsInTx(tx, input.productId))) {
      return null;
    }

    return setPrimaryImageInScopeTx(tx, input.productId, null, input.filePath);
  });
}

export async function upsertAdminPrimaryVariantImage(
  input: UpsertAdminPrimaryVariantImageInput
): Promise<AdminProductImage | null> {
  if (!isValidNumericId(input.productId) || !isValidNumericId(input.variantId)) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    if (!(await productExistsInTx(tx, input.productId))) {
      return null;
    }

    if (!(await variantExistsInTx(tx, input.productId, input.variantId))) {
      throw new AdminProductImageRepositoryError(
        "Selected variant does not belong to this product."
      );
    }

    return setPrimaryImageInScopeTx(tx, input.productId, input.variantId, input.filePath);
  });
}

export async function updateAdminProductImage(
  input: UpdateAdminProductImageInput
): Promise<AdminProductImage | null> {
  if (!isValidNumericId(input.productId) || !isValidNumericId(input.id)) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    const currentImage = await tx.product_images.findFirst({
      where: { id: BigInt(input.id), product_id: BigInt(input.productId) },
    });

    if (currentImage === null) {
      return null;
    }

    if (input.isPrimary) {
      const variantId =
        currentImage.variant_id !== null ? currentImage.variant_id.toString() : null;

      await clearPrimaryImageInScopeTx(tx, input.productId, variantId, input.id);
    }

    const updated = await tx.product_images.update({
      where: { id: BigInt(input.id) },
      data: { alt_text: input.altText, sort_order: input.sortOrder, is_primary: input.isPrimary },
    });

    return mapPrismaProductImage(updated);
  });
}

export async function deleteAdminProductImage(
  productId: string,
  imageId: string
): Promise<boolean> {
  if (!isValidNumericId(productId) || !isValidNumericId(imageId)) {
    return false;
  }

  const result = await prisma.product_images.deleteMany({
    where: { id: BigInt(imageId), product_id: BigInt(productId) },
  });

  return result.count > 0;
}

export async function deleteAdminPrimaryProductImage(productId: string): Promise<boolean> {
  if (!isValidNumericId(productId)) {
    return false;
  }

  const result = await prisma.product_images.deleteMany({
    where: { product_id: BigInt(productId), variant_id: null, is_primary: true },
  });

  return result.count > 0;
}

export async function deleteAdminPrimaryVariantImage(
  productId: string,
  variantId: string
): Promise<boolean> {
  if (!isValidNumericId(productId) || !isValidNumericId(variantId)) {
    return false;
  }

  const result = await prisma.product_images.deleteMany({
    where: { product_id: BigInt(productId), variant_id: BigInt(variantId), is_primary: true },
  });

  return result.count > 0;
}
