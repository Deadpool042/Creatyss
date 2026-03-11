import { type PoolClient } from "pg";
import { db, queryFirst, queryRows } from "@/db/client";
import {
  resolveSimpleProductOffer,
  type SimpleProductOffer,
  type SimpleProductOfferFields
} from "@/entities/product/simple-product-offer";
import {
  canChangeProductTypeToSimple,
  type ProductTypeCompatibilityErrorCode
} from "@/entities/product/product-type-rules";
import { type ProductType } from "@/entities/product/product-input";

type TimestampValue = Date | string;

type AdminProductStatus = "draft" | "published";

type AdminProductSimpleFieldsRow = {
  simple_sku: string | null;
  simple_price: string | null;
  simple_compare_at_price: string | null;
  simple_stock_quantity: number | null;
};

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

type AdminProductRow = AdminProductSimpleFieldsRow & {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: AdminProductStatus;
  product_type: ProductType;
  is_featured: boolean;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type AdminProductCategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type AdminProductCompatibilityRow = {
  id: string;
  product_type: ProductType;
};

type DeletedProductRow = {
  id: string;
};

type CountRow = {
  matched_count: number;
};

type ExistingVariantRow = {
  id: string;
};

type SimpleProductFieldsRow = {
  sku: string;
  price: string;
  compare_at_price: string | null;
  stock_quantity: number;
};

type AdminLegacySimpleOfferCandidateRow = {
  sku: string | null;
  price: string | null;
  compare_at_price: string | null;
  stock_quantity: number | null;
};

type PostgreSqlErrorLike = Error & {
  code: string;
  constraint?: string;
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

function isValidProductId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

function isPostgreSqlErrorLike(error: unknown): error is PostgreSqlErrorLike {
  if (!(error instanceof Error)) {
    return false;
  }

  const candidate = error as Error & {
    code?: unknown;
    constraint?: unknown;
  };

  return typeof candidate.code === "string";
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapAdminProductSummary(
  row: AdminProductSummaryRow
): AdminProductSummary {
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
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapAdminProductDetail(
  row: AdminProductRow,
  categories: AdminProductCategoryAssignment[],
  simpleOffer: SimpleProductOffer | null
): AdminProductDetail {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    status: row.status,
    productType: row.product_type,
    isFeatured: row.is_featured,
    categories,
    categoryIds: categories.map((category) => category.id),
    simpleOfferFields: getNativeSimpleOfferFields(row),
    simpleOffer,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapCategoryAssignment(
  row: AdminProductCategoryRow
): AdminProductCategoryAssignment {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug
  };
}

function mapRepositoryError(error: unknown): never {
  if (
    isPostgreSqlErrorLike(error) &&
    error.code === "23505" &&
    error.constraint === "products_slug_key"
  ) {
    throw new AdminProductRepositoryError(
      "slug_taken",
      "Product slug already exists."
    );
  }

  if (
    isPostgreSqlErrorLike(error) &&
    error.code === "23505" &&
    error.constraint === "product_variants_sku_key"
  ) {
    throw new AdminProductRepositoryError(
      "sku_taken",
      "Variant SKU already exists."
    );
  }

  if (isPostgreSqlErrorLike(error) && error.code === "23503") {
    throw new AdminProductRepositoryError(
      "product_referenced",
      "Product is still referenced by other records."
    );
  }

  throw error;
}

function normalizeCategoryIds(categoryIds: readonly string[]): string[] {
  return [...new Set(categoryIds)];
}

function getNativeSimpleOfferFields(
  row: AdminProductSimpleFieldsRow
): SimpleProductOfferFields {
  return {
    sku: row.simple_sku,
    price: row.simple_price,
    compareAtPrice: row.simple_compare_at_price,
    stockQuantity: row.simple_stock_quantity
  };
}

async function listAssignedCategoriesByProductId(
  client: PoolClient,
  productId: string
): Promise<AdminProductCategoryAssignment[]> {
  const result = await client.query<AdminProductCategoryRow>(
    `
      select
        c.id::text as id,
        c.name,
        c.slug
      from product_categories pc
      join categories c
        on c.id = pc.category_id
      where pc.product_id = $1::bigint
      order by lower(c.name) asc, c.id asc
    `,
    [productId]
  );

  return result.rows.map(mapCategoryAssignment);
}

async function listLegacySimpleOfferCandidatesByProductId(
  client: PoolClient,
  productId: string
): Promise<SimpleProductOfferFields[]> {
  const result = await client.query<AdminLegacySimpleOfferCandidateRow>(
    `
      select
        pv.sku,
        pv.price::text as price,
        pv.compare_at_price::text as compare_at_price,
        pv.stock_quantity
      from product_variants pv
      where pv.product_id = $1::bigint
      order by pv.is_default desc, pv.id asc
    `,
    [productId]
  );

  return result.rows.map((row) => ({
    sku: row.sku,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    stockQuantity: row.stock_quantity
  }));
}

async function resolveAdminSimpleOffer(
  client: PoolClient,
  row: AdminProductRow
): Promise<SimpleProductOffer | null> {
  if (row.product_type !== "simple") {
    return null;
  }

  const legacyOffers = await listLegacySimpleOfferCandidatesByProductId(
    client,
    row.id
  );

  return resolveSimpleProductOffer({
    native: getNativeSimpleOfferFields(row),
    legacyOffers
  });
}

async function ensureCategoriesExist(
  client: PoolClient,
  categoryIds: readonly string[]
): Promise<string[]> {
  const normalizedCategoryIds = normalizeCategoryIds(categoryIds);

  if (normalizedCategoryIds.length === 0) {
    return [];
  }

  const result = await client.query<CountRow>(
    `
      select count(*)::int as matched_count
      from categories
      where id = any($1::bigint[])
    `,
    [normalizedCategoryIds]
  );

  const matchedCount = result.rows[0]?.matched_count ?? 0;

  if (matchedCount !== normalizedCategoryIds.length) {
    throw new AdminProductRepositoryError(
      "category_missing",
      "At least one selected category does not exist."
    );
  }

  return normalizedCategoryIds;
}

async function countVariantsByProductId(
  client: PoolClient,
  productId: string
): Promise<number> {
  const result = await client.query<CountRow>(
    `
      select count(*)::int as matched_count
      from product_variants
      where product_id = $1::bigint
    `,
    [productId]
  );

  return result.rows[0]?.matched_count ?? 0;
}

async function readProductCompatibilityById(
  client: PoolClient,
  productId: string
): Promise<AdminProductCompatibilityRow | null> {
  const result = await client.query<AdminProductCompatibilityRow>(
    `
      select
        p.id::text as id,
        p.product_type
      from products p
      where p.id = $1::bigint
      limit 1
    `,
    [productId]
  );

  return result.rows[0] ?? null;
}

async function readSingleLegacyVariantId(
  client: PoolClient,
  productId: string
): Promise<string | null> {
  const result = await client.query<ExistingVariantRow>(
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

async function replaceProductCategories(
  client: PoolClient,
  productId: string,
  categoryIds: readonly string[]
): Promise<void> {
  await client.query(
    `
      delete from product_categories
      where product_id = $1::bigint
    `,
    [productId]
  );

  if (categoryIds.length === 0) {
    return;
  }

  await client.query(
    `
      insert into product_categories (
        product_id,
        category_id
      )
      select
        $1::bigint,
        unnest($2::bigint[])
    `,
    [productId, categoryIds]
  );
}

async function clearSimpleProductFields(
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

async function readPrimaryVariantFields(
  client: PoolClient,
  productId: string
): Promise<SimpleProductFieldsRow | null> {
  const result = await client.query<SimpleProductFieldsRow>(
    `
      select
        pv.sku,
        pv.price::text as price,
        pv.compare_at_price::text as compare_at_price,
        pv.stock_quantity
      from product_variants pv
      where pv.product_id = $1::bigint
      order by pv.is_default desc, pv.id asc
      limit 1
    `,
    [productId]
  );

  return result.rows[0] ?? null;
}

async function syncSimpleProductFieldsFromOnlyVariant(
  client: PoolClient,
  productId: string
): Promise<void> {
  const variantFields = await readPrimaryVariantFields(client, productId);

  if (variantFields === null) {
    await clearSimpleProductFields(client, productId);
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
      productId,
      variantFields.sku,
      variantFields.price,
      variantFields.compare_at_price,
      variantFields.stock_quantity
    ]
  );
}

async function syncSingleLegacyVariantCommercialFields(
  client: PoolClient,
  productId: string,
  input: UpdateAdminSimpleProductOfferInput
): Promise<void> {
  const variantId = await readSingleLegacyVariantId(client, productId);

  if (variantId === null) {
    throw new Error("Missing legacy variant to synchronize.");
  }

  const result = await client.query<ExistingVariantRow>(
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
      productId,
      input.sku,
      input.price,
      input.compareAtPrice,
      input.stockQuantity,
      variantId
    ]
  );

  if (!result.rows[0]) {
    throw new Error("Failed to synchronize legacy variant.");
  }
}

export async function listAdminProducts(): Promise<AdminProductSummary[]> {
  const rows = await queryRows<AdminProductSummaryRow>(
    `
      select
        p.id::text as id,
        p.name,
        p.slug,
        p.short_description,
        p.status,
        p.product_type,
        p.is_featured,
        (
          select count(*)::int
          from product_categories pc
          where pc.product_id = p.id
        ) as category_count,
        (
          select count(*)::int
          from product_variants pv
          where pv.product_id = p.id
        ) as variant_count,
        p.created_at,
        p.updated_at
      from products p
      order by p.created_at desc, p.id desc
    `
  );

  return rows.map(mapAdminProductSummary);
}

export async function findAdminProductById(
  id: string
): Promise<AdminProductDetail | null> {
  if (!isValidProductId(id)) {
    return null;
  }

  const row = await queryFirst<AdminProductRow>(
    `
      select
        p.id::text as id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.seo_title,
        p.seo_description,
        p.status,
        p.product_type,
        p.simple_sku,
        p.simple_price::text as simple_price,
        p.simple_compare_at_price::text as simple_compare_at_price,
        p.simple_stock_quantity,
        p.is_featured,
        p.created_at,
        p.updated_at
      from products p
      where p.id = $1::bigint
      limit 1
    `,
    [id]
  );

  if (row === null) {
    return null;
  }

  const client = await db.connect();

  try {
    const [categories, simpleOffer] = await Promise.all([
      listAssignedCategoriesByProductId(client, row.id),
      resolveAdminSimpleOffer(client, row)
    ]);

    return mapAdminProductDetail(row, categories, simpleOffer);
  } finally {
    client.release();
  }
}

export async function createAdminProduct(
  input: CreateAdminProductInput
): Promise<AdminProductDetail> {
  const client = await db.connect();

  try {
    await client.query("begin");

    const categoryIds = await ensureCategoriesExist(client, input.categoryIds);
    const result = await client.query<AdminProductRow>(
      `
        insert into products (
          name,
          slug,
          short_description,
          description,
          seo_title,
          seo_description,
          status,
          product_type,
          is_featured
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning
          id::text as id,
          name,
          slug,
          short_description,
          description,
          seo_title,
          seo_description,
          status,
          product_type,
          simple_sku,
          simple_price::text as simple_price,
          simple_compare_at_price::text as simple_compare_at_price,
          simple_stock_quantity,
          is_featured,
          created_at,
          updated_at
      `,
      [
        input.name,
        input.slug,
        input.shortDescription,
        input.description,
        input.seoTitle,
        input.seoDescription,
        input.status,
        input.productType,
        input.isFeatured
      ]
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create product.");
    }

    await replaceProductCategories(client, row.id, categoryIds);

    await clearSimpleProductFields(client, row.id);

    const refreshedRow = (
      await client.query<AdminProductRow>(
        `
          select
            p.id::text as id,
            p.name,
            p.slug,
            p.short_description,
            p.description,
            p.seo_title,
            p.seo_description,
            p.status,
            p.product_type,
            p.simple_sku,
            p.simple_price::text as simple_price,
            p.simple_compare_at_price::text as simple_compare_at_price,
            p.simple_stock_quantity,
            p.is_featured,
            p.created_at,
            p.updated_at
          from products p
          where p.id = $1::bigint
          limit 1
        `,
        [row.id]
      )
    ).rows[0];

    if (!refreshedRow) {
      throw new Error("Failed to reload product after creation.");
    }

    const [categories, simpleOffer] = await Promise.all([
      listAssignedCategoriesByProductId(client, row.id),
      resolveAdminSimpleOffer(client, refreshedRow)
    ]);

    await client.query("commit");

    return mapAdminProductDetail(refreshedRow, categories, simpleOffer);
  } catch (error) {
    await client.query("rollback");

    if (error instanceof AdminProductRepositoryError) {
      throw error;
    }

    mapRepositoryError(error);
  } finally {
    client.release();
  }
}

export async function updateAdminProduct(
  input: UpdateAdminProductInput
): Promise<AdminProductDetail | null> {
  if (!isValidProductId(input.id)) {
    return null;
  }

  const client = await db.connect();

  try {
    await client.query("begin");

    const categoryIds = await ensureCategoriesExist(client, input.categoryIds);
    const variantCount = await countVariantsByProductId(client, input.id);

    if (
      input.productType === "simple" &&
      !canChangeProductTypeToSimple(variantCount)
    ) {
      throw new AdminProductRepositoryError(
        "simple_product_requires_single_variant",
        "A simple product can only have one sellable variant."
      );
    }

    const result = await client.query<AdminProductRow>(
      `
        update products
        set
          name = $2,
          slug = $3,
          short_description = $4,
          description = $5,
          seo_title = $6,
          seo_description = $7,
          status = $8,
          product_type = $9,
          is_featured = $10
        where id = $1::bigint
        returning
          id::text as id,
          name,
          slug,
          short_description,
          description,
          seo_title,
          seo_description,
          status,
          product_type,
          simple_sku,
          simple_price::text as simple_price,
          simple_compare_at_price::text as simple_compare_at_price,
          simple_stock_quantity,
          is_featured,
          created_at,
          updated_at
      `,
      [
        input.id,
        input.name,
        input.slug,
        input.shortDescription,
        input.description,
        input.seoTitle,
        input.seoDescription,
        input.status,
        input.productType,
        input.isFeatured
      ]
    );

    const row = result.rows[0];

    if (!row) {
      await client.query("rollback");
      return null;
    }

    await replaceProductCategories(client, row.id, categoryIds);
    const [categories, simpleOffer] = await Promise.all([
      listAssignedCategoriesByProductId(client, row.id),
      resolveAdminSimpleOffer(client, row)
    ]);

    await client.query("commit");

    return mapAdminProductDetail(row, categories, simpleOffer);
  } catch (error) {
    await client.query("rollback");

    if (error instanceof AdminProductRepositoryError) {
      throw error;
    }

    mapRepositoryError(error);
  } finally {
    client.release();
  }
}

export async function updateAdminSimpleProductOffer(
  input: UpdateAdminSimpleProductOfferInput
): Promise<AdminProductDetail | null> {
  if (!isValidProductId(input.id)) {
    return null;
  }

  const client = await db.connect();

  try {
    await client.query("begin");

    const product = await readProductCompatibilityById(client, input.id);

    if (product === null) {
      await client.query("rollback");
      return null;
    }

    if (product.product_type !== "simple") {
      throw new AdminProductRepositoryError(
        "simple_product_offer_requires_simple_product",
        "Native simple offer editing is reserved for simple products."
      );
    }

    const variantCount = await countVariantsByProductId(client, input.id);

    if (variantCount > 1) {
      throw new AdminProductRepositoryError(
        "simple_product_multiple_legacy_variants",
        "A simple product with multiple legacy variants is incoherent."
      );
    }

    const result = await client.query<AdminProductRow>(
      `
        update products
        set
          simple_sku = $2,
          simple_price = $3::numeric,
          simple_compare_at_price = $4::numeric,
          simple_stock_quantity = $5
        where id = $1::bigint
        returning
          id::text as id,
          name,
          slug,
          short_description,
          description,
          seo_title,
          seo_description,
          status,
          product_type,
          simple_sku,
          simple_price::text as simple_price,
          simple_compare_at_price::text as simple_compare_at_price,
          simple_stock_quantity,
          is_featured,
          created_at,
          updated_at
      `,
      [
        input.id,
        input.sku,
        input.price,
        input.compareAtPrice,
        input.stockQuantity
      ]
    );

    const row = result.rows[0];

    if (!row) {
      await client.query("rollback");
      return null;
    }

    if (variantCount === 1) {
      await syncSingleLegacyVariantCommercialFields(client, input.id, input);
    }

    const [categories, simpleOffer] = await Promise.all([
      listAssignedCategoriesByProductId(client, row.id),
      resolveAdminSimpleOffer(client, row)
    ]);

    await client.query("commit");

    return mapAdminProductDetail(row, categories, simpleOffer);
  } catch (error) {
    await client.query("rollback");

    if (error instanceof AdminProductRepositoryError) {
      throw error;
    }

    mapRepositoryError(error);
  } finally {
    client.release();
  }
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  if (!isValidProductId(id)) {
    return false;
  }

  try {
    const row = await queryFirst<DeletedProductRow>(
      `
        delete from products
        where id = $1::bigint
        returning id::text as id
      `,
      [id]
    );

    return row !== null;
  } catch (error) {
    mapRepositoryError(error);
  }
}
