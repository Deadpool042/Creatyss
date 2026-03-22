import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { Pool } from "pg";

type CliOptions = {
  skipImages: boolean;
};

type WooCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

type WooImage = {
  id: number;
  src: string;
  name?: string;
  alt?: string;
};

type WooProductCategoryRef = {
  id: number;
  name: string;
  slug: string;
};

type WooProduct = {
  id: number;
  name: string;
  slug: string;
  type: "simple" | "variable" | string;
  status: string;
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number | null;
  manage_stock: boolean;
  images: WooImage[];
  categories: WooProductCategoryRef[];
};

type WooVariation = {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number | null;
};

type DbIdRow = {
  id: string;
};

const ROOT = process.cwd();
const UPLOADS_DIR = (process.env.UPLOADS_DIR ?? "public/uploads").replace(/\/$/, "");
const UPLOADS_ABS = path.join(ROOT, UPLOADS_DIR);
const WEBP_OPTIONS: sharp.WebpOptions = { quality: 85, effort: 4 };

function readDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (value && value.trim().length > 0) return value.trim();
  return "postgresql://creatyss:creatyss@db:5432/creatyss";
}

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function parseCliOptions(argv: readonly string[]): CliOptions {
  return {
    skipImages: argv.includes("--skip-images"),
  };
}

function normalizeMoneyToCents(value: string | null | undefined): number | null {
  if (!value || value.trim() === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.round(parsed * 100);
}

function normalizeStatus(value: string): "draft" | "published" | "archived" {
  if (value === "publish") return "published";
  if (value === "draft") return "draft";
  return "archived";
}

function buildWooUrl(pathname: string, params?: Record<string, string | number>): string {
  const baseUrl = readRequiredEnv("WC_BASE_URL").replace(/\/$/, "");
  const url = new URL(`${baseUrl}/wp-json/wc/v3/${pathname.replace(/^\//, "")}`);
  url.searchParams.set("consumer_key", readRequiredEnv("WC_CONSUMER_KEY"));
  url.searchParams.set("consumer_secret", readRequiredEnv("WC_CONSUMER_SECRET"));

  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WooCommerce request failed (${response.status}) for ${url}: ${body}`);
  }

  return (await response.json()) as T;
}

async function fetchPagedCollection<T>(pathname: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;

  while (true) {
    const url = buildWooUrl(pathname, { per_page: 100, page });
    const batch = await fetchJson<T[]>(url);

    if (batch.length === 0) break;

    results.push(...batch);

    if (batch.length < 100) break;
    page += 1;
  }

  return results;
}

async function fetchVariations(productId: number): Promise<WooVariation[]> {
  return fetchPagedCollection<WooVariation>(`products/${productId}/variations`);
}

async function ensureCategory(pool: Pool, category: WooCategory): Promise<string> {
  const existing = await pool.query<DbIdRow>(
    `select id::text as id from categories where slug = $1 limit 1`,
    [category.slug]
  );

  const existingId = existing.rows[0]?.id;

  if (existingId) {
    await pool.query(
      `
        update categories
        set
          name = $2,
          description = $3,
          status = 'active',
          updated_at = now()
        where id = $1
      `,
      [existingId, category.name, category.description || null]
    );
    return existingId;
  }

  const id = `wc-cat-${category.id}`;
  await pool.query(
    `
      insert into categories (
        id,
        slug,
        name,
        description,
        status,
        is_featured,
        display_order,
        created_at,
        updated_at
      )
      values ($1, $2, $3, $4, 'active', false, 0, now(), now())
    `,
    [id, category.slug, category.name, category.description || null]
  );

  return id;
}

async function upsertProduct(pool: Pool, product: WooProduct): Promise<string> {
  const existingProduct = await pool.query<DbIdRow>(
    `select id::text as id from products where slug = $1 limit 1`,
    [product.slug]
  );

  const productId = existingProduct.rows[0]?.id ?? `wc-prod-${product.id}`;
  const productType = product.type === "variable" ? "variable" : "simple";
  const status = normalizeStatus(product.status);

  await pool.query(
    `
      insert into products (
        id,
        slug,
        name,
        short_description,
        description,
        status,
        product_type,
        is_featured,
        seo_title,
        seo_description,
        published_at,
        simple_sku,
        simple_price_cents,
        simple_compare_at_cents,
        simple_stock_quantity,
        track_inventory,
        created_at,
        updated_at
      )
      values (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6::product_status,
        $7::product_type,
        $8,
        $9,
        $10,
        case when $6::text = 'published' then now() else null end,
        $11,
        $12,
        $13,
        $14,
        $15,
        now(),
        now()
      )
      on conflict (id) do update
      set
        slug = excluded.slug,
        name = excluded.name,
        short_description = excluded.short_description,
        description = excluded.description,
        status = excluded.status,
        product_type = excluded.product_type,
        is_featured = excluded.is_featured,
        seo_title = excluded.seo_title,
        seo_description = excluded.seo_description,
        published_at = excluded.published_at,
        simple_sku = excluded.simple_sku,
        simple_price_cents = excluded.simple_price_cents,
        simple_compare_at_cents = excluded.simple_compare_at_cents,
        simple_stock_quantity = excluded.simple_stock_quantity,
        track_inventory = excluded.track_inventory,
        updated_at = now()
    `,
    [
      productId,
      product.slug,
      product.name,
      product.short_description || null,
      product.description || null,
      status,
      productType,
      product.featured,
      product.name,
      product.short_description || null,
      product.sku || null,
      normalizeMoneyToCents(product.price),
      normalizeMoneyToCents(product.regular_price),
      product.stock_quantity,
      product.manage_stock,
    ]
  );

  return productId;
}

async function replaceProductCategories(
  pool: Pool,
  productId: string,
  categoryIds: readonly string[]
): Promise<void> {
  await pool.query(`delete from product_categories where product_id = $1`, [productId]);

  for (const categoryId of categoryIds) {
    await pool.query(
      `
        insert into product_categories (product_id, category_id, created_at)
        values ($1, $2, now())
      `,
      [productId, categoryId]
    );
  }
}

async function replaceProductVariants(
  pool: Pool,
  productId: string,
  variations: readonly WooVariation[],
  fallbackSimpleProduct: WooProduct
): Promise<void> {
  await pool.query(`delete from product_variants where product_id = $1`, [productId]);

  if (variations.length === 0) {
    await pool.query(
      `
        insert into product_variants (
          id,
          product_id,
          name,
          color_name,
          color_hex,
          sku,
          price_cents,
          compare_at_cents,
          stock_quantity,
          track_inventory,
          is_default,
          status,
          sort_order,
          created_at,
          updated_at
        )
        values (
          $1, $2, $3, null, null, $4, $5, $6, $7, $8, true, 'published', 0, now(), now()
        )
      `,
      [
        `${productId}-default`,
        productId,
        fallbackSimpleProduct.name,
        fallbackSimpleProduct.sku || null,
        normalizeMoneyToCents(fallbackSimpleProduct.price),
        normalizeMoneyToCents(fallbackSimpleProduct.regular_price),
        fallbackSimpleProduct.stock_quantity,
        fallbackSimpleProduct.manage_stock,
      ]
    );
    return;
  }

  for (const [index, variation] of variations.entries()) {
    await pool.query(
      `
        insert into product_variants (
          id,
          product_id,
          name,
          color_name,
          color_hex,
          sku,
          price_cents,
          compare_at_cents,
          stock_quantity,
          track_inventory,
          is_default,
          status,
          sort_order,
          created_at,
          updated_at
        )
        values (
          $1, $2, $3, null, null, $4, $5, $6, $7, true, $8, 'published', $9, now(), now()
        )
      `,
      [
        `wc-var-${variation.id}`,
        productId,
        variation.sku || `Variation ${index + 1}`,
        variation.sku || null,
        normalizeMoneyToCents(variation.price),
        normalizeMoneyToCents(variation.regular_price),
        variation.stock_quantity,
        index === 0,
        index,
      ]
    );
  }
}

async function downloadAsWebp(
  imageUrl: string,
  destAbsolutePath: string
): Promise<{
  byteSize: number;
  width: number | null;
  height: number | null;
  checksumSha256: string;
}> {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Failed to download image ${imageUrl}: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await mkdir(path.dirname(destAbsolutePath), { recursive: true });
  const { data, info } = await sharp(buffer)
    .webp(WEBP_OPTIONS)
    .toBuffer({ resolveWithObject: true });
  await writeFile(destAbsolutePath, data);

  return {
    byteSize: data.length,
    width: info.width ?? null,
    height: info.height ?? null,
    checksumSha256: createHash("sha256").update(data).digest("hex"),
  };
}

async function upsertMediaAsset(
  pool: Pool,
  storageKey: string,
  originalName: string,
  altText: string | null,
  byteSize: number,
  width: number | null,
  height: number | null,
  checksumSha256: string
): Promise<string> {
  const existingByChecksum = await pool.query<DbIdRow>(
    `
      select id::text as id
      from media_assets
      where checksum_sha256 = $1
      limit 1
    `,
    [checksumSha256]
  );

  const existingChecksumId = existingByChecksum.rows[0]?.id;

  if (existingChecksumId) {
    return existingChecksumId;
  }

  const result = await pool.query<DbIdRow>(
    `
      insert into media_assets (
        id,
        storage_key,
        original_name,
        mime_type,
        byte_size,
        width,
        height,
        alt_text,
        checksum_sha256,
        created_at,
        updated_at
      )
      values ($1, $2, $3, 'image/webp', $4::bigint, $5, $6, $7, $8, now(), now())
      on conflict (storage_key) do update
      set
        original_name = excluded.original_name,
        mime_type = excluded.mime_type,
        byte_size = excluded.byte_size,
        width = excluded.width,
        height = excluded.height,
        alt_text = excluded.alt_text,
        checksum_sha256 = excluded.checksum_sha256,
        updated_at = now()
      returning id::text as id
    `,
    [
      randomUUID(),
      storageKey,
      originalName,
      String(byteSize),
      width,
      height,
      altText,
      checksumSha256,
    ]
  );

  const mediaId = result.rows[0]?.id;
  if (!mediaId) {
    throw new Error(`Failed to upsert media asset for ${storageKey}`);
  }

  return mediaId;
}

async function replaceProductImages(
  pool: Pool,
  productId: string,
  productSlug: string,
  images: readonly WooImage[]
): Promise<void> {
  await pool.query(`delete from product_images where product_id = $1`, [productId]);

  for (const [index, image] of images.entries()) {
    const storageKey = `imports/woocommerce/products/${productSlug}/${String(index + 1).padStart(2, "0")}.webp`;
    const destAbsolutePath = path.join(UPLOADS_ABS, storageKey);
    const originalName = `${path.basename(image.src).replace(/\.[^.]+$/, "")}.webp`;

    const converted = await downloadAsWebp(image.src, destAbsolutePath);
    const mediaAssetId = await upsertMediaAsset(
      pool,
      storageKey,
      originalName,
      image.alt || null,
      converted.byteSize,
      converted.width,
      converted.height,
      converted.checksumSha256
    );

    await pool.query(
      `
        insert into product_images (
          id,
          product_id,
          media_asset_id,
          is_primary,
          sort_order,
          created_at,
          updated_at
        )
        values ($1, $2, $3, $4, $5, now(), now())
      `,
      [randomUUID(), productId, mediaAssetId, index === 0, index]
    );
  }
}

async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  const pool = new Pool({ connectionString: readDatabaseUrl() });

  try {
    const categories = await fetchPagedCollection<WooCategory>("products/categories");
    const products = await fetchPagedCollection<WooProduct>("products");

    const categoryIdByWooId = new Map<number, string>();

    for (const category of categories) {
      const categoryId = await ensureCategory(pool, category);
      categoryIdByWooId.set(category.id, categoryId);
    }

    for (const product of products) {
      const productId = await upsertProduct(pool, product);

      const categoryIds = product.categories
        .map((categoryRef) => categoryIdByWooId.get(categoryRef.id))
        .filter((value): value is string => typeof value === "string");

      await replaceProductCategories(pool, productId, categoryIds);

      const variations = product.type === "variable" ? await fetchVariations(product.id) : [];
      await replaceProductVariants(pool, productId, variations, product);

      if (!options.skipImages) {
        await replaceProductImages(pool, productId, product.slug, product.images);
      }

      process.stdout.write(`Imported product: ${product.slug}\n`);
    }

    process.stdout.write(`Imported ${products.length} products.\n`);
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown WooCommerce import error.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
