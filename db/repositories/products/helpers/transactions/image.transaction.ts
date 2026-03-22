import type {
  CreateAdminProductImageInput,
  UpdateAdminProductImageInput,
} from "@db-products/admin/image";
import { productExistsInTx } from "@db-products/queries/product";
import { variantExistsInTx } from "@db-products/queries/variant";
import type { ProductTxClient } from "@db-products/types/tx";
import {
  clearPrimaryProductImageInTx,
  clearPrimaryVariantImageInTx,
} from "@db-products/helpers/invariants";

export async function createProductImageInTx(
  tx: ProductTxClient,
  input: CreateAdminProductImageInput
): Promise<string> {
  const hasProductScope = input.productId !== undefined && input.productId !== null;
  const hasVariantScope = input.productVariantId !== undefined && input.productVariantId !== null;

  if (hasProductScope === hasVariantScope) {
    throw new Error("PRODUCT_IMAGE_SCOPE_INVALID");
  }

  const media = await tx.mediaAsset.findUnique({
    where: {
      id: input.mediaAssetId,
    },
    select: {
      id: true,
    },
  });

  if (!media) {
    throw new Error("PRODUCT_IMAGE_MEDIA_INVALID");
  }

  if (hasProductScope) {
    const productId = input.productId as string;
    const exists = await productExistsInTx(tx, productId);

    if (!exists) {
      throw new Error("PRODUCT_IMAGE_PRODUCT_NOT_FOUND");
    }

    if (input.isPrimary === true) {
      await clearPrimaryProductImageInTx(tx, productId);
    }

    const created = await tx.productImage.create({
      data: {
        productId,
        mediaAssetId: input.mediaAssetId,
        isPrimary: input.isPrimary ?? false,
        sortOrder: input.sortOrder ?? 0,
      },
      select: {
        id: true,
      },
    });

    return created.id;
  }

  const productVariantId = input.productVariantId as string;
  const variantExists = await variantExistsInTx(tx, productVariantId);

  if (!variantExists) {
    throw new Error("PRODUCT_IMAGE_VARIANT_NOT_FOUND");
  }

  if (input.isPrimary === true) {
    await clearPrimaryVariantImageInTx(tx, productVariantId);
  }

  const created = await tx.productVariantImage.create({
    data: {
      productVariantId,
      mediaAssetId: input.mediaAssetId,
      isPrimary: input.isPrimary ?? false,
      sortOrder: input.sortOrder ?? 0,
    },
    select: {
      id: true,
    },
  });

  return created.id;
}

export async function updateProductImageInTx(
  tx: ProductTxClient,
  input: UpdateAdminProductImageInput
): Promise<boolean> {
  const productImage = await tx.productImage.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      productId: true,
    },
  });

  if (productImage) {
    if (input.isPrimary === true) {
      await clearPrimaryProductImageInTx(tx, productImage.productId);
    }

    const productImageData: {
      isPrimary?: boolean;
      sortOrder?: number;
    } = {};

    if (input.isPrimary !== undefined) {
      productImageData.isPrimary = input.isPrimary;
    }

    if (input.sortOrder !== undefined) {
      productImageData.sortOrder = input.sortOrder;
    }

    await tx.productImage.update({
      where: {
        id: input.id,
      },
      data: productImageData,
    });

    return true;
  }

  const variantImage = await tx.productVariantImage.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      productVariantId: true,
    },
  });

  if (!variantImage) {
    return false;
  }

  if (input.isPrimary === true) {
    await clearPrimaryVariantImageInTx(tx, variantImage.productVariantId);
  }

  const variantImageData: {
    isPrimary?: boolean;
    sortOrder?: number;
  } = {};

  if (input.isPrimary !== undefined) {
    variantImageData.isPrimary = input.isPrimary;
  }

  if (input.sortOrder !== undefined) {
    variantImageData.sortOrder = input.sortOrder;
  }

  await tx.productVariantImage.update({
    where: {
      id: input.id,
    },
    data: variantImageData,
  });

  return true;
}
