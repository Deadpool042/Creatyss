/**
 * Seed images script — run by the `seeder` Docker service at startup.
 *
 * What it does (idempotent):
 *   1. Copies `seed_data/images/creatyss.webp` → `public/uploads/creatyss.webp`
 *      (the placeholder shown when a product/category has no real image).
 *   2. Reads `seed_data/images/manifest.json` and, for each entry that has
 *      real image files on disk, converts them to WebP (quality 85) and writes
 *      them to `public/uploads/seed/…`, then upserts the corresponding
 *      `media_assets`, `product_images`, and `categories` rows in the DB.
 *
 * The dest path always ends in `.webp` regardless of the source extension,
 * keeping the uploads volume consistent with images uploaded via the admin UI.
 *
 * Usage:
 *   node --experimental-strip-types scripts/seed-images.ts           # skip existing files
 *   node --experimental-strip-types scripts/seed-images.ts --force   # overwrite + re-sync DB
 *
 * Adding a real product image:
 *   1. Drop the file in  seed_data/images/products/{slug}/01.jpg  (JPEG/PNG/WebP)
 *   2. Add an entry to  seed_data/images/manifest.json:
 *        { "slug": "my-slug", "images": [{ "src": "products/my-slug/01.jpg",
 *            "altText": "…", "sortOrder": 0, "isPrimary": true }] }
 *   3. Run `make db-seed-images` (or restart Docker so the seeder re-runs).
 *
 * Adding a category image:
 *   1. Drop the file in  seed_data/images/categories/{slug}/cover.jpg
 *   2. Add an entry to  seed_data/images/manifest.json:
 *        { "slug": "my-slug", "image": { "src": "categories/my-slug/cover.jpg",
 *            "altText": "…" } }
 *   3. Same as above.
 */

import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { Pool } from "pg";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProductImageEntry = {
  src: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
};

type ProductEntry = {
  slug: string;
  images: ProductImageEntry[];
};

type CategoryImageEntry = {
  src: string;
  altText?: string;
};

type CategoryEntry = {
  slug: string;
  image?: CategoryImageEntry;
};

type Manifest = {
  products?: ProductEntry[];
  categories?: CategoryEntry[];
};

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FORCE = process.argv.includes("--force");
const ROOT = process.cwd();
const SEED_DIR = path.join(ROOT, "seed_data", "images");
const UPLOADS_DIR = (process.env.UPLOADS_DIR ?? "public/uploads").replace(
  /\/$/,
  ""
);
const UPLOADS_ABS = path.join(ROOT, UPLOADS_DIR);

const WEBP_OPTIONS: sharp.WebpOptions = { quality: 85, effort: 4 };

function readDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (value && value.trim().length > 0) return value.trim();
  return "postgresql://creatyss:creatyss@db:5432/creatyss";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the dest relative path, always with a .webp extension.
 * e.g. "products/my-slug/01.jpg" → "seed/products/my-slug/01.webp"
 */
function toWebpDestRelative(src: string): string {
  const withoutExt = src.replace(/\.[^.]+$/, "");
  return `seed/${withoutExt}.webp`;
}

/**
 * Convert `src` to WebP and write to `dest`.
 * Skips if `dest` already exists and FORCE is false.
 * Returns true if the file was written (or already existed), false if src is missing.
 */
async function convertToWebpIfNeeded(
  src: string,
  dest: string
): Promise<{ ok: boolean; byteSize: number; width: number | null; height: number | null }> {
  if (!existsSync(src)) {
    process.stdout.write(`  skip (src missing): ${path.relative(ROOT, src)}\n`);
    return { ok: false, byteSize: 0, width: null, height: null };
  }

  if (!FORCE && existsSync(dest)) {
    process.stdout.write(`  skip (exists): ${path.relative(ROOT, dest)}\n`);
    // Read existing size/dimensions for DB upsert accuracy.
    const { size, width, height } = await sharp(dest).metadata().then(m => ({
      size: 0, // we won't re-stat; 0 triggers ON CONFLICT DO NOTHING path
      width: m.width ?? null,
      height: m.height ?? null
    }));
    const buf = await readFile(dest);
    return { ok: true, byteSize: buf.length, width, height };
  }

  await mkdir(path.dirname(dest), { recursive: true });

  const { data, info } = await sharp(src)
    .webp(WEBP_OPTIONS)
    .toBuffer({ resolveWithObject: true });

  await writeFile(dest, data, { flag: FORCE ? "w" : "wx" });
  process.stdout.write(
    `  converted → ${path.relative(ROOT, dest)} (${Math.round(data.length / 1024)} kB)\n`
  );

  return {
    ok: true,
    byteSize: data.length,
    width: info.width ?? null,
    height: info.height ?? null
  };
}

/**
 * Upsert a `media_assets` row keyed by `file_path`.
 */
async function upsertMediaAsset(
  pool: Pool,
  filePath: string,
  originalName: string,
  byteSize: number,
  width: number | null,
  height: number | null
): Promise<void> {
  await pool.query(
    `
      insert into media_assets
        (file_path, original_name, mime_type, byte_size, image_width, image_height)
      values ($1, $2, 'image/webp', $3::bigint, $4, $5)
      on conflict (file_path) do update
        set original_name = excluded.original_name,
            byte_size     = excluded.byte_size,
            image_width   = excluded.image_width,
            image_height  = excluded.image_height,
            updated_at    = now()
    `,
    [filePath, originalName, String(byteSize), width, height]
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const pool = new Pool({ connectionString: readDatabaseUrl() });

  try {
    // 1. Placeholder (creatyss.webp) — copied as-is, already WebP ---------------
    process.stdout.write("==> Placeholder (creatyss.webp)\n");
    const placeholderSrc = path.join(SEED_DIR, "creatyss.webp");
    const placeholderDest = path.join(UPLOADS_ABS, "creatyss.webp");

    if (existsSync(placeholderSrc)) {
      if (FORCE || !existsSync(placeholderDest)) {
        await mkdir(UPLOADS_ABS, { recursive: true });
        await copyFile(placeholderSrc, placeholderDest);
        process.stdout.write("  copied: creatyss.webp\n");
      } else {
        process.stdout.write("  skip (exists): creatyss.webp\n");
      }
    } else {
      process.stdout.write(
        "  warning: seed_data/images/creatyss.webp not found.\n" +
          "  Run `make seed-data-init` to copy it from public/uploads/.\n"
      );
      await mkdir(UPLOADS_ABS, { recursive: true });
    }

    // 2. Read manifest -----------------------------------------------------------
    const manifestPath = path.join(SEED_DIR, "manifest.json");
    if (!existsSync(manifestPath)) {
      process.stdout.write("==> No manifest.json — skipping image seed.\n");
      return;
    }

    const manifest: Manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

    // 3. Product images ----------------------------------------------------------
    process.stdout.write("==> Product images\n");

    for (const product of manifest.products ?? []) {
      const realImages = (product.images ?? []).filter(
        img => img.src.trim() !== ""
      );
      if (realImages.length === 0) continue;

      process.stdout.write(`  product: ${product.slug}\n`);

      for (const img of realImages) {
        const src = path.join(SEED_DIR, img.src);
        const destRelative = toWebpDestRelative(img.src);
        const dest = path.join(UPLOADS_ABS, destRelative);
        const originalName =
          path.basename(img.src).replace(/\.[^.]+$/, "") + ".webp";

        const { ok, byteSize, width, height } = await convertToWebpIfNeeded(
          src,
          dest
        );
        if (!ok) continue;

        await upsertMediaAsset(
          pool,
          destRelative,
          originalName,
          byteSize,
          width,
          height
        );

        if (img.isPrimary) {
          await pool.query(
            `
              update product_images
              set    file_path  = $2,
                     alt_text   = $3,
                     sort_order = $4
              where  product_id = (select id from products where slug = $1 limit 1)
                and  is_primary = true
            `,
            [product.slug, destRelative, img.altText ?? null, img.sortOrder]
          );
        } else {
          await pool.query(
            `
              insert into product_images
                (product_id, file_path, alt_text, sort_order, is_primary)
              select p.id, $2, $3, $4, false
              from   products p
              where  p.slug = $1
                and  not exists (
                  select 1 from product_images pi
                  where  pi.product_id = p.id and pi.file_path = $2
                )
              limit 1
            `,
            [product.slug, destRelative, img.altText ?? null, img.sortOrder]
          );
        }
      }
    }

    // 4. Category images ---------------------------------------------------------
    process.stdout.write("==> Category images\n");

    for (const category of manifest.categories ?? []) {
      const img = category.image;
      if (!img) continue;

      process.stdout.write(`  category: ${category.slug}\n`);

      const src = path.join(SEED_DIR, img.src);
      const destRelative = toWebpDestRelative(img.src);
      const dest = path.join(UPLOADS_ABS, destRelative);
      const originalName =
        path.basename(img.src).replace(/\.[^.]+$/, "") + ".webp";

      const { ok, byteSize, width, height } = await convertToWebpIfNeeded(
        src,
        dest
      );
      if (!ok) continue;

      await upsertMediaAsset(
        pool,
        destRelative,
        originalName,
        byteSize,
        width,
        height
      );

      await pool.query(
        `update categories set image_path = $2 where slug = $1`,
        [category.slug, destRelative]
      );
    }

    process.stdout.write("==> Done.\n");
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown seed-images error.";
  process.stderr.write(`seed-images: ${message}\n`);
  process.exitCode = 1;
});
