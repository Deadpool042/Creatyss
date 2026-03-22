import type {
  CreateAdminProductVariantInput,
  UpdateAdminProductVariantInput,
} from "@db-products/admin/variant";
import { countVariantsInTx } from "@db-products/queries/variant";
import { productExistsInTx, readProductTypeInTx } from "@db-products/queries/product";
import type { ProductTxClient } from "@db-products/types/tx";
import { clearDefaultVariantInTx } from "@db-products/helpers/invariants";

export async function createProductVariantInTx(
  tx: ProductTxClient,
  input: CreateAdminProductVariantInput
): Promise<string> {
  const productExists = await productExistsInTx(tx, input.productId);

  if (!productExists) {
    throw new Error("PRODUCT_VARIANT_PRODUCT_NOT_FOUND");
  }

  const productTypeRow = await readProductTypeInTx(tx, input.productId);

  if (!productTypeRow) {
    throw new Error("PRODUCT_VARIANT_PRODUCT_NOT_FOUND");
  }

  const productRow = await tx.product.findUnique({
    where: { id: input.productId },
    select: {
      productKind: true,
    },
  });

  if (!productRow) {
    throw new Error("PRODUCT_VARIANT_PRODUCT_NOT_FOUND");
  }

  if (productRow.productKind === "digital") {
    throw new Error("PRODUCT_SIMPLE_VARIANT_MISMATCH");
  }

  if (productTypeRow.productType !== "variable") {
    throw new Error("PRODUCT_SIMPLE_VARIANT_MISMATCH");
  }

  if (input.isDefault === true) {
    await clearDefaultVariantInTx(tx, input.productId);
  }

  const created = await tx.productVariant.create({
    data: {
      productId: input.productId,
      name: input.name,
      colorName: input.colorName ?? null,
      colorHex: input.colorHex ?? null,
      sku: input.sku ?? null,
      priceCents: input.priceCents ?? null,
      compareAtCents: input.compareAtCents ?? null,
      stockQuantity: input.stockQuantity ?? null,
      trackInventory: input.trackInventory ?? true,
      isDefault: input.isDefault ?? false,
      status: input.status ?? "draft",
      sortOrder: input.sortOrder ?? 0,
    },
    select: {
      id: true,
    },
  });

  return created.id;
}

export async function updateProductVariantInTx(
  tx: ProductTxClient,
  input: UpdateAdminProductVariantInput
): Promise<boolean> {
  const existing = await tx.productVariant.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      productId: true,
    },
  });

  if (!existing) {
    return false;
  }

  const productRow = await tx.product.findUnique({
    where: {
      id: existing.productId,
    },
    select: {
      productKind: true,
    },
  });

  if (!productRow) {
    return false;
  }

  if (productRow.productKind === "digital") {
    throw new Error("PRODUCT_SIMPLE_VARIANT_MISMATCH");
  }

  if (input.isDefault === true) {
    await clearDefaultVariantInTx(tx, existing.productId);
  }

  const variantData: {
    name: string;
    colorName: string | null;
    colorHex: string | null;
    sku: string | null;
    priceCents: number | null;
    compareAtCents: number | null;
    stockQuantity: number | null;
    trackInventory?: boolean;
    isDefault?: boolean;
    status?: "draft" | "published" | "archived";
    sortOrder?: number;
  } = {
    name: input.name,
    colorName: input.colorName ?? null,
    colorHex: input.colorHex ?? null,
    sku: input.sku ?? null,
    priceCents: input.priceCents ?? null,
    compareAtCents: input.compareAtCents ?? null,
    stockQuantity: input.stockQuantity ?? null,
  };

  if (input.trackInventory !== undefined) {
    variantData.trackInventory = input.trackInventory;
  }

  if (input.isDefault !== undefined) {
    variantData.isDefault = input.isDefault;
  }

  if (input.status !== undefined) {
    variantData.status = input.status;
  }

  if (input.sortOrder !== undefined) {
    variantData.sortOrder = input.sortOrder;
  }

  await tx.productVariant.update({
    where: {
      id: input.id,
    },
    data: variantData,
  });

  return true;
}

export async function deleteProductVariantInTx(
  tx: ProductTxClient,
  variantId: string
): Promise<boolean> {
  const existing = await tx.productVariant.findUnique({
    where: {
      id: variantId,
    },
    select: {
      id: true,
      productId: true,
      isDefault: true,
    },
  });

  if (!existing) {
    return false;
  }

  const variantCount = await countVariantsInTx(tx, existing.productId);

  if (existing.isDefault && variantCount > 1) {
    const fallback = await tx.productVariant.findFirst({
      where: {
        productId: existing.productId,
        id: {
          not: existing.id,
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
      },
    });

    if (fallback) {
      await tx.productVariant.update({
        where: {
          id: fallback.id,
        },
        data: {
          isDefault: true,
        },
      });
    }
  }

  await tx.productVariant.delete({
    where: {
      id: variantId,
    },
  });

  return true;
}
