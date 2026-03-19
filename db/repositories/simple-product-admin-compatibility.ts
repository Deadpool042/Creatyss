import { type PoolClient } from "pg";

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
  client: PoolClient,
  productId: string,
  variantId?: string
): Promise<LegacySimpleProductCommercialFieldsRow | null> {
  const result = await client.query<LegacySimpleProductCommercialFieldsRow>(
    `
      select
        pv.sku,
        pv.price::text as price,
        pv.compare_at_price::text as compare_at_price,
        pv.stock_quantity
      from product_variants pv
      where pv.product_id = $1::bigint
        and ($2::bigint is null or pv.id = $2::bigint)
      order by pv.is_default desc, pv.id asc
      limit 1
    `,
    [productId, variantId ?? null]
  );

  return result.rows[0] ?? null;
}

async function readSingleLegacyVariantId(
  client: PoolClient,
  productId: string
): Promise<string | null> {
  const result = await client.query<{ id: string }>(
    `
      select
        pv.id::text as id
      from product_variants pv
      where pv.product_id = $1::bigint
      order by pv.is_default desc, pv.id asc
      limit 1
    `,
    [productId]
  );

  return result.rows[0]?.id ?? null;
}

export async function clearNativeSimpleProductOfferFields(
  client: PoolClient,
  productId: string
): Promise<void> {
  await client.query(
    `
      update products
      set
        simple_sku = null,
        simple_price = null,
        simple_compare_at_price = null,
        simple_stock_quantity = null
      where id = $1::bigint
    `,
    [productId]
  );
}

export async function syncNativeSimpleProductOfferFromLegacyVariant(
  client: PoolClient,
  input: {
    productId: string;
    variantId?: string;
  }
): Promise<void> {
  const legacyVariantFields = await readLegacyVariantCommercialFields(
    client,
    input.productId,
    input.variantId
  );

  if (legacyVariantFields === null) {
    await clearNativeSimpleProductOfferFields(client, input.productId);
    return;
  }

  await client.query(
    `
      update products
      set
        simple_sku = $2,
        simple_price = $3::numeric,
        simple_compare_at_price = $4::numeric,
        simple_stock_quantity = $5
      where id = $1::bigint
    `,
    [
      input.productId,
      legacyVariantFields.sku,
      legacyVariantFields.price,
      legacyVariantFields.compare_at_price,
      legacyVariantFields.stock_quantity,
    ]
  );
}

export async function syncLegacyVariantCommercialFieldsFromSimpleProduct(
  client: PoolClient,
  input: SyncLegacyVariantFromNativeSimpleProductInput
): Promise<void> {
  const legacyVariantId = await readSingleLegacyVariantId(client, input.productId);

  if (legacyVariantId === null) {
    throw new Error("Missing legacy variant to synchronize.");
  }

  const result = await client.query<{ id: string }>(
    `
      update product_variants
      set
        sku = $2,
        price = $3::numeric,
        compare_at_price = $4::numeric,
        stock_quantity = $5
      where id = $6::bigint
        and product_id = $1::bigint
      returning id::text as id
    `,
    [
      input.productId,
      input.sku,
      input.price,
      input.compareAtPrice,
      input.stockQuantity,
      legacyVariantId,
    ]
  );

  if (!result.rows[0]) {
    throw new Error("Failed to synchronize legacy variant.");
  }
}
