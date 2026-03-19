import { type PoolClient } from "pg";
import { db } from "@/db/client";
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

type AdminProductTypeRow = {
  id: string;
  product_type: ProductType;
};

type CountRow = {
  matched_count: number;
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

const ADMIN_PRODUCT_DETAIL_COLUMNS =
  "id::text as id, name, slug, short_description, description, seo_title, seo_description, status, product_type, simple_sku, simple_price::text as simple_price, simple_compare_at_price::text as simple_compare_at_price, simple_stock_quantity, is_featured, created_at, updated_at";

const ADMIN_PRODUCT_GENERAL_INSERT_COLUMNS =
  "name, slug, short_description, description, seo_title, seo_description, status, product_type, is_featured";

const ADMIN_PRODUCT_GENERAL_UPDATE_SET_CLAUSE = `
  name = $2,
  slug = $3,
  short_description = $4,
  description = $5,
  seo_title = $6,
  seo_description = $7,
  status = $8,
  product_type = $9,
  is_featured = $10
`;

const ADMIN_SIMPLE_PRODUCT_OFFER_UPDATE_SET_CLAUSE = `
  simple_sku = $2,
  simple_price = $3::numeric,
  simple_compare_at_price = $4::numeric,
  simple_stock_quantity = $5
`;

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
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapCategoryAssignment(row: AdminProductCategoryRow): AdminProductCategoryAssignment {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
  };
}

function mapRepositoryError(error: unknown): never {
  if (
    isPostgreSqlErrorLike(error) &&
    error.code === "23505" &&
    error.constraint === "products_slug_key"
  ) {
    throw new AdminProductRepositoryError("slug_taken", "Product slug already exists.");
  }

  if (
    isPostgreSqlErrorLike(error) &&
    error.code === "23505" &&
    error.constraint === "product_variants_sku_key"
  ) {
    throw new AdminProductRepositoryError("sku_taken", "Variant SKU already exists.");
  }

  if (isPostgreSqlErrorLike(error) && error.code === "23503") {
    throw new AdminProductRepositoryError(
      "product_referenced",
      "Product is still referenced by other records."
    );
  }

  throw error;
}

// Absorbs known Prisma errors and maps them to public domain errors.
function mapPrismaRepositoryError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003") {
      throw new AdminProductRepositoryError(
        "product_referenced",
        "Product is still referenced by other records."
      );
    }
  }

  throw error;
}

function normalizeCategoryIds(categoryIds: readonly string[]): string[] {
  return [...new Set(categoryIds)];
}

function getNativeSimpleOfferFields(row: AdminProductSimpleFieldsRow): SimpleProductOfferFields {
  return {
    sku: row.simple_sku,
    price: row.simple_price,
    compareAtPrice: row.simple_compare_at_price,
    stockQuantity: row.simple_stock_quantity,
  };
}

function buildAdminProductWriteParams(input: CreateAdminProductInput): unknown[] {
  return [
    input.name,
    input.slug,
    input.shortDescription,
    input.description,
    input.seoTitle,
    input.seoDescription,
    input.status,
    input.productType,
    input.isFeatured,
  ];
}

function buildAdminSimpleProductOfferWriteParams(
  input: UpdateAdminSimpleProductOfferInput
): unknown[] {
  return [input.sku, input.price, input.compareAtPrice, input.stockQuantity];
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
    stockQuantity: row.stock_quantity,
  }));
}

async function readAdminSimpleProductOffer(
  client: PoolClient,
  row: AdminProductRow
): Promise<SimpleProductOffer | null> {
  if (row.product_type !== "simple") {
    return null;
  }

  const legacyOffers = await listLegacySimpleOfferCandidatesByProductId(client, row.id);

  return resolveSimpleProductOffer({
    native: getNativeSimpleOfferFields(row),
    legacyOffers,
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

async function countVariantsByProductId(client: PoolClient, productId: string): Promise<number> {
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

async function readProductTypeById(
  client: PoolClient,
  productId: string
): Promise<AdminProductTypeRow | null> {
  const result = await client.query<AdminProductTypeRow>(
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

async function readAdminProductRowById(
  client: PoolClient,
  productId: string
): Promise<AdminProductRow | null> {
  const result = await client.query<AdminProductRow>(
    `
      select ${ADMIN_PRODUCT_DETAIL_COLUMNS}
      from products
      where id = $1::bigint
      limit 1
    `,
    [productId]
  );

  return result.rows[0] ?? null;
}

async function readAdminProductDetailFromRow(
  client: PoolClient,
  row: AdminProductRow
): Promise<AdminProductDetail> {
  const [categories, simpleOffer] = await Promise.all([
    listAssignedCategoriesByProductId(client, row.id),
    readAdminSimpleProductOffer(client, row),
  ]);

  return mapAdminProductDetail(row, categories, simpleOffer);
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
  const client = await db.connect();

  try {
    await client.query("begin");

    const categoryIds = await ensureCategoriesExist(client, input.categoryIds);
    const result = await client.query<AdminProductRow>(
      `
        insert into products (${ADMIN_PRODUCT_GENERAL_INSERT_COLUMNS})
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning ${ADMIN_PRODUCT_DETAIL_COLUMNS}
      `,
      buildAdminProductWriteParams(input)
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create product.");
    }

    await replaceProductCategories(client, row.id, categoryIds);

    await clearNativeSimpleProductOfferFields(client, row.id);

    const refreshedRow = await readAdminProductRowById(client, row.id);

    if (!refreshedRow) {
      throw new Error("Failed to reload product after creation.");
    }

    const productDetail = await readAdminProductDetailFromRow(client, refreshedRow);

    await client.query("commit");

    return productDetail;
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

    assertCanSaveAsSimpleProduct(input.productType, variantCount);

    const result = await client.query<AdminProductRow>(
      `
        update products
        set ${ADMIN_PRODUCT_GENERAL_UPDATE_SET_CLAUSE}
        where id = $1::bigint
        returning ${ADMIN_PRODUCT_DETAIL_COLUMNS}
      `,
      [input.id, ...buildAdminProductWriteParams(input)]
    );

    const row = result.rows[0];

    if (!row) {
      await client.query("rollback");
      return null;
    }

    await replaceProductCategories(client, row.id, categoryIds);
    const productDetail = await readAdminProductDetailFromRow(client, row);

    await client.query("commit");

    return productDetail;
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

    const product = await readProductTypeById(client, input.id);

    if (product === null) {
      await client.query("rollback");
      return null;
    }

    assertProductSupportsNativeSimpleOffer(product.product_type);

    const variantCount = await countVariantsByProductId(client, input.id);

    assertCompatibleLegacyVariantCountForNativeSimpleOffer(variantCount);

    const result = await client.query<AdminProductRow>(
      `
        update products
        set ${ADMIN_SIMPLE_PRODUCT_OFFER_UPDATE_SET_CLAUSE}
        where id = $1::bigint
        returning ${ADMIN_PRODUCT_DETAIL_COLUMNS}
      `,
      [input.id, ...buildAdminSimpleProductOfferWriteParams(input)]
    );

    const row = result.rows[0];

    if (!row) {
      await client.query("rollback");
      return null;
    }

    if (variantCount === 1) {
      await syncLegacyVariantCommercialFieldsFromSimpleProduct(client, {
        productId: input.id,
        sku: input.sku,
        price: input.price,
        compareAtPrice: input.compareAtPrice,
        stockQuantity: input.stockQuantity,
      });
    }

    const productDetail = await readAdminProductDetailFromRow(client, row);

    await client.query("commit");

    return productDetail;
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
