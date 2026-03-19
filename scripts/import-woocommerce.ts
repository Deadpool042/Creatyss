/**
 * Import WooCommerce data into the Creatyss database.
 *
 * Reads:
 *   seed_data/products.creatyss.json
 *   seed_data/categories.creatyss.json
 *
 * Populates:
 *   categories, products, product_variants, product_categories,
 *   media_assets, product_images
 *
 * Usage:
 *   node --experimental-strip-types scripts/import-woocommerce.ts
 *   node --experimental-strip-types scripts/import-woocommerce.ts --skip-images
 *   node --experimental-strip-types scripts/import-woocommerce.ts --force
 *
 * Flags:
 *   --skip-images  Skip image download/conversion (fast, data-only run)
 *   --force        Re-download + re-convert images even if they already exist
 *
 * Idempotent — safe to run multiple times.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { Pool } from "pg";

// ---------------------------------------------------------------------------
// WooCommerce types
// ---------------------------------------------------------------------------

type WcProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_minor_unit: number;
  };
  categories: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; alt: string; name: string }[];
};

type WcCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
  image: { src: string; alt: string } | null;
};

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SKIP_IMAGES = process.argv.includes("--skip-images");
const FORCE = process.argv.includes("--force");

const ROOT = process.cwd();
const UPLOADS_DIR = (process.env.UPLOADS_DIR ?? "public/uploads").replace(/\/$/, "");
const UPLOADS_ABS = path.join(ROOT, UPLOADS_DIR);

// Maps WooCommerce category slugs → Creatyss category slugs.
// Adjust if needed.
const CATEGORY_SLUG_MAP: Record<string, string> = {
  "les-sacs-a-bandouliere": "sacs-a-bandouliere",
  "sacs-creatyss": "sacs-a-main",
  "mini-sacs": "mini-sacs",
  pochettes: "pochettes-trousses",
  "sacs-a-dos": "sacs-a-dos",
};

const WEBP_OPTIONS: sharp.WebpOptions = { quality: 85, effort: 4 };

function readDatabaseUrl(): string {
  const v = process.env.DATABASE_URL?.trim();
  return v && v.length > 0 ? v : "postgresql://creatyss:creatyss@db:5432/creatyss";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip HTML tags and decode common entities. */
function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&rdquo;|&#8221;/g, '"')
    .replace(/&ldquo;|&#8220;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Convert price from WooCommerce minor units to decimal. */
function toDecimalPrice(minorStr: string, minorUnit: number): number {
  return Number(minorStr) / Math.pow(10, minorUnit);
}

/** Generate a SKU from a slug when the product has none. */
function slugToSku(slug: string): string {
  const parts = slug.split("-").map((p) => p.slice(0, 3).toUpperCase());
  return parts.slice(0, 4).join("") + "-IMP";
}

/**
 * Download an image URL, convert to WebP, write to disk.
 * Returns { byteSize, width, height } on success, null if skipped/failed.
 */
async function downloadAndConvert(
  url: string,
  dest: string
): Promise<{ byteSize: number; width: number | null; height: number | null } | null> {
  if (!FORCE && existsSync(dest)) {
    return null; // already done
  }

  let inputBuffer: Buffer;

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!resp.ok) {
      process.stderr.write(`  download failed (${resp.status}): ${url}\n`);
      return null;
    }
    inputBuffer = Buffer.from(await resp.arrayBuffer());
  } catch (err) {
    process.stderr.write(
      `  download error: ${url} — ${err instanceof Error ? err.message : err}\n`
    );
    return null;
  }

  await mkdir(path.dirname(dest), { recursive: true });

  const { data, info } = await sharp(inputBuffer)
    .webp(WEBP_OPTIONS)
    .toBuffer({ resolveWithObject: true });

  await writeFile(dest, data, { flag: FORCE ? "w" : "wx" });

  return {
    byteSize: data.length,
    width: info.width ?? null,
    height: info.height ?? null,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const productsPath = path.join(ROOT, "seed_data", "products.creatyss.json");
  const categoriesPath = path.join(ROOT, "seed_data", "categories.creatyss.json");

  if (!existsSync(productsPath) || !existsSync(categoriesPath)) {
    process.stderr.write("Missing seed_data/products.creatyss.json or categories.creatyss.json.\n");
    process.exitCode = 1;
    return;
  }

  const products: WcProduct[] = JSON.parse(
    await import("node:fs").then((fs) => fs.readFileSync(productsPath, "utf-8"))
  );
  const wcCategories: WcCategory[] = JSON.parse(
    await import("node:fs").then((fs) => fs.readFileSync(categoriesPath, "utf-8"))
  );

  const pool = new Pool({ connectionString: readDatabaseUrl() });

  try {
    // 1. Categories -----------------------------------------------------------
    process.stdout.write(`==> Categories (${wcCategories.length})\n`);

    for (const wc of wcCategories) {
      const slug = CATEGORY_SLUG_MAP[wc.slug] ?? wc.slug;
      const description = stripHtml(wc.description);

      await pool.query(
        `
          insert into categories (name, slug, description, is_featured)
          values ($1, $2, $3, false)
          on conflict (slug) do update
            set name        = excluded.name,
                description = excluded.description
        `,
        [wc.name, slug, description || null]
      );

      process.stdout.write(`  ${wc.slug} → ${slug}\n`);
    }

    // 2. Products -------------------------------------------------------------
    process.stdout.write(`\n==> Products (${products.length})\n`);

    let imported = 0;
    let skippedImages = 0;

    for (const wc of products) {
      const name = wc.name;
      const slug = wc.slug;
      const shortDescription = stripHtml(wc.short_description) || null;
      const description = stripHtml(wc.description) || null;
      const minorUnit = wc.prices.currency_minor_unit ?? 2;
      const price = toDecimalPrice(wc.prices.price, minorUnit);
      const regularPrice = toDecimalPrice(wc.prices.regular_price, minorUnit);
      const compareAtPrice = regularPrice > price ? regularPrice : null;
      const sku = wc.sku || slugToSku(slug);

      // 2a. Upsert product
      const productRow = await pool.query<{ id: string }>(
        `
          insert into products
            (name, slug, short_description, description,
             product_type, status, is_featured,
             seo_title, seo_description,
             simple_sku, simple_price, simple_compare_at_price)
          values ($1, $2, $3, $4, 'simple', 'published', false,
                  $1, $3,
                  $5, $6, $7)
          on conflict (slug) do update
            set name                   = excluded.name,
                short_description      = excluded.short_description,
                description            = excluded.description,
                seo_title              = excluded.seo_title,
                seo_description        = excluded.seo_description,
                simple_sku             = excluded.simple_sku,
                simple_price           = excluded.simple_price,
                simple_compare_at_price = excluded.simple_compare_at_price
          returning id::text as id
        `,
        [name, slug, shortDescription, description, sku, price, compareAtPrice]
      );

      const productId = productRow.rows[0]!.id;

      // 2b. Upsert default variant.
      // Two unique constraints can fire on INSERT:
      //   • (sku) — handled by ON CONFLICT below
      //   • (product_id) WHERE is_default — partial index, NOT covered by ON CONFLICT (sku)
      // To avoid the partial-index conflict, demote any existing default variant first.
      await pool.query(
        `update product_variants set is_default = false
         where product_id = $1::bigint and sku <> $2 and is_default = true`,
        [productId, sku]
      );

      await pool.query(
        `
          insert into product_variants
            (product_id, name, color_name, color_hex,
             sku, price, compare_at_price, is_default, status)
          values ($1::bigint, $2, $2, null,
                  $3, $4, $5, true, 'published')
          on conflict (sku) do update
            set price             = excluded.price,
                compare_at_price  = excluded.compare_at_price,
                is_default        = true
        `,
        [productId, name, sku, price, compareAtPrice]
      );

      // 2c. Product ↔ categories
      for (const wcCat of wc.categories) {
        const catSlug = CATEGORY_SLUG_MAP[wcCat.slug] ?? wcCat.slug;

        await pool.query(
          `
            insert into product_categories (product_id, category_id)
            select $1::bigint, c.id
            from   categories c
            where  c.slug = $2
              and  not exists (
                select 1 from product_categories pc
                where pc.product_id = $1::bigint and pc.category_id = c.id
              )
          `,
          [productId, catSlug]
        );
      }

      // 2d. Images
      if (!SKIP_IMAGES && wc.images.length > 0) {
        for (let i = 0; i < wc.images.length; i++) {
          const img = wc.images[i]!;
          const isPrimary = i === 0;
          const filename = `${String(i + 1).padStart(2, "0")}.webp`;
          const relPath = `seed/products/${slug}/${filename}`;
          const dest = path.join(UPLOADS_ABS, relPath);
          const altText = img.alt || name;

          const converted = await downloadAndConvert(img.src, dest);

          if (converted === null && !existsSync(dest)) {
            skippedImages++;
            continue; // download failed
          }

          const { byteSize, width, height } = converted ?? {
            byteSize: 0,
            width: null,
            height: null,
          };

          // Upsert media_assets
          if (converted !== null) {
            await pool.query(
              `
                insert into media_assets
                  (file_path, original_name, mime_type, byte_size, image_width, image_height)
                values ($1, $2, 'image/webp', $3::bigint, $4, $5)
                on conflict (file_path) do update
                  set byte_size    = excluded.byte_size,
                      image_width  = excluded.image_width,
                      image_height = excluded.image_height,
                      updated_at   = now()
              `,
              [relPath, filename, String(byteSize), width, height]
            );
          }

          // Upsert product_images
          if (isPrimary) {
            // Partial unique index: (product_id) WHERE is_primary AND variant_id IS NULL
            await pool.query(
              `
                insert into product_images
                  (product_id, variant_id, file_path, alt_text, sort_order, is_primary)
                values ($1::bigint, null, $2, $3, 0, true)
                on conflict (product_id) where is_primary and variant_id is null
                do update set
                  file_path  = excluded.file_path,
                  alt_text   = excluded.alt_text
              `,
              [productId, relPath, altText]
            );
          } else {
            await pool.query(
              `
                insert into product_images
                  (product_id, variant_id, file_path, alt_text, sort_order, is_primary)
                select $1::bigint, null, $2, $3, $4, false
                where not exists (
                  select 1 from product_images
                  where product_id = $1::bigint and file_path = $2
                )
              `,
              [productId, relPath, altText, i]
            );
          }

          if (converted !== null) {
            process.stdout.write(
              `  ${isPrimary ? "★" : " "} ${slug}/${filename} (${Math.round(converted.byteSize / 1024)} kB)\n`
            );
          }

          // Small delay to be polite to the origin server
          if (converted !== null) {
            await new Promise((r) => setTimeout(r, 80));
          }
        }
      }

      imported++;
    }

    process.stdout.write(
      `\n==> Done. ${imported} products imported` +
        (SKIP_IMAGES ? " (images skipped)" : "") +
        (skippedImages > 0 ? `, ${skippedImages} images failed` : "") +
        ".\n"
    );
  } finally {
    await pool.end();
  }
}

main().catch((err: unknown) => {
  process.stderr.write(`import-woocommerce: ${err instanceof Error ? err.message : err}\n`);
  process.exitCode = 1;
});
