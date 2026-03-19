import { type Prisma } from "@prisma/client";

type LegacySimpleProductCommercialFieldsRow = {
  sku: string;
  price: string;
  compare_at_price: string | null;
  stock_quantity: number;
};

type SyncLegacyVariantFromNativeSimpleProductInput = {
  productId: string;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
};

async function readLegacyVariantCommercialFields(
  tx: Prisma.TransactionClient,
  productId: string,
  variantId?: string
): Promise<LegacySimpleProductCommercialFieldsRow | null> {
  const row = await tx.product_variants.findFirst({
    where: {
      product_id: BigInt(productId),
      ...(variantId ? { id: BigInt(variantId) } : {}),
    },
    orderBy: [{ is_default: "desc" }, { id: "asc" }],
  });

  if (row === null) {
    return null;
  }

  return {
    sku: row.sku,
    price: row.price.toString(),
    compare_at_price: row.compare_at_price !== null ? row.compare_at_price.toString() : null,
    stock_quantity: row.stock_quantity,
  };
}

async function readSingleLegacyVariantId(
  tx: Prisma.TransactionClient,
  productId: string
): Promise<string | null> {
  const row = await tx.product_variants.findFirst({
    where: { product_id: BigInt(productId) },
    select: { id: true },
    orderBy: [{ is_default: "desc" }, { id: "asc" }],
  });

  return row !== null ? row.id.toString() : null;
}

export async function clearNativeSimpleProductOfferFields(
  tx: Prisma.TransactionClient,
  productId: string
): Promise<void> {
  await tx.products.update({
    where: { id: BigInt(productId) },
    data: {
      simple_sku: null,
      simple_price: null,
      simple_compare_at_price: null,
      simple_stock_quantity: null,
    },
  });
}

export async function syncNativeSimpleProductOfferFromLegacyVariant(
  tx: Prisma.TransactionClient,
  input: {
    productId: string;
    variantId?: string;
  }
): Promise<void> {
  const legacyVariantFields = await readLegacyVariantCommercialFields(
    tx,
    input.productId,
    input.variantId
  );

  if (legacyVariantFields === null) {
    await clearNativeSimpleProductOfferFields(tx, input.productId);
    return;
  }

  await tx.products.update({
    where: { id: BigInt(input.productId) },
    data: {
      simple_sku: legacyVariantFields.sku,
      simple_price: legacyVariantFields.price,
      simple_compare_at_price: legacyVariantFields.compare_at_price,
      simple_stock_quantity: legacyVariantFields.stock_quantity,
    },
  });
}

export async function syncLegacyVariantCommercialFieldsFromSimpleProduct(
  tx: Prisma.TransactionClient,
  input: SyncLegacyVariantFromNativeSimpleProductInput
): Promise<void> {
  const legacyVariantId = await readSingleLegacyVariantId(tx, input.productId);

  if (legacyVariantId === null) {
    throw new Error("Missing legacy variant to synchronize.");
  }

  const result = await tx.product_variants.updateMany({
    where: {
      id: BigInt(legacyVariantId),
      product_id: BigInt(input.productId),
    },
    data: {
      sku: input.sku,
      price: input.price,
      compare_at_price: input.compareAtPrice,
      stock_quantity: input.stockQuantity,
    },
  });

  if (result.count === 0) {
    throw new Error("Failed to synchronize legacy variant.");
  }
}
