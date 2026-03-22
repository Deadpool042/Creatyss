import { createHash, randomUUID } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { Pool } from "pg";

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

const FORCE = process.argv.includes("--force");
const ROOT = process.cwd();
const SEED_DIR = path.join(ROOT, "seed_data", "images");
const UPLOADS_DIR = (process.env.UPLOADS_DIR ?? "public/uploads").replace(/\/$/, "");
const UPLOADS_ABS = path.join(ROOT, UPLOADS_DIR);
const WEBP_OPTIONS: sharp.WebpOptions = { quality: 85, effort: 4 };

function readDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (value && value.trim().length > 0) return value.trim();
  return "postgresql://creatyss:creatyss@db:5432/creatyss";
}

function toWebpDestRelative(src: string): string {
  const withoutExt = src.replace(/\.[^.]+$/, "");
  return `seed/${withoutExt}.webp`;
}

async function convertToWebpIfNeeded(
  src: string,
  dest: string
): Promise<{
  ok: boolean;
  byteSize: number;
  width: number | null;
  height: number | null;
  checksumSha256: string | null;
}> {
  if (!existsSync(src)) {
    process.stdout.write(`  skip (src missing): ${path.relative(ROOT, src)}\n`);
    return { ok: false, byteSize: 0, width: null, height: null, checksumSha256: null };
  }

  if (!FORCE && existsSync(dest)) {
    process.stdout.write(`  skip (exists): ${path.relative(ROOT, dest)}\n`);
    const buffer = await readFile(dest);
    const metadata = await sharp(buffer).metadata();

    return {
      ok: true,
      byteSize: buffer.length,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      checksumSha256: createHash("sha256").update(buffer).digest("hex"),
    };
  }

  await mkdir(path.dirname(dest), { recursive: true });

  const { data, info } = await sharp(src).webp(WEBP_OPTIONS).toBuffer({ resolveWithObject: true });

  await writeFile(dest, data, { flag: FORCE ? "w" : "wx" });

  process.stdout.write(
    `  converted → ${path.relative(ROOT, dest)} (${Math.round(data.length / 1024)} kB)\n`
  );

  return {
    ok: true,
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
  checksumSha256: string | null
): Promise<string> {
  const result = await pool.query<{ id: string }>(
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
        set original_name = excluded.original_name,
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

async function upsertProductImage(
  pool: Pool,
  productSlug: string,
  mediaAssetId: string,
  sortOrder: number,
  isPrimary: boolean
): Promise<void> {
  const productResult = await pool.query<{ id: string }>(
    `select id::text as id from products where slug = $1 limit 1`,
    [productSlug]
  );

  const productId = productResult.rows[0]?.id;

  if (!productId) {
    process.stdout.write(`  skip (product missing): ${productSlug}\n`);
    return;
  }

  if (isPrimary) {
    await pool.query(
      `update product_images set is_primary = false, updated_at = now() where product_id = $1`,
      [productId]
    );
  }

  const existing = await pool.query<{ id: string }>(
    `
      select id::text as id
      from product_images
      where product_id = $1 and media_asset_id = $2
      limit 1
    `,
    [productId, mediaAssetId]
  );

  if (existing.rows.length > 0) {
    await pool.query(
      `
        update product_images
        set is_primary = $3,
            sort_order = $4,
            updated_at = now()
        where id = $1 and media_asset_id = $2
      `,
      [existing.rows[0]?.id, mediaAssetId, isPrimary, sortOrder]
    );
    return;
  }

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
    [randomUUID(), productId, mediaAssetId, isPrimary, sortOrder]
  );
}

async function setCategoryRepresentativeImage(
  pool: Pool,
  categorySlug: string,
  mediaAssetId: string
): Promise<void> {
  await pool.query(
    `update categories set representative_media_id = $2, updated_at = now() where slug = $1`,
    [categorySlug, mediaAssetId]
  );
}

async function main() {
  const pool = new Pool({ connectionString: readDatabaseUrl() });

  try {
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
        "  warning: seed_data/images/creatyss.webp not found. Run `make seed-data-init` first.\n"
      );
      await mkdir(UPLOADS_ABS, { recursive: true });
    }

    const manifestPath = path.join(SEED_DIR, "manifest.json");
    if (!existsSync(manifestPath)) {
      process.stdout.write("==> No manifest.json — skipping image seed.\n");
      return;
    }

    const manifest: Manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

    process.stdout.write("==> Product images\n");

    for (const product of manifest.products ?? []) {
      const realImages = (product.images ?? []).filter((img) => img.src.trim() !== "");
      if (realImages.length === 0) continue;

      process.stdout.write(`  product: ${product.slug}\n`);

      for (const image of realImages) {
        const src = path.join(SEED_DIR, image.src);
        const storageKey = toWebpDestRelative(image.src);
        const dest = path.join(UPLOADS_ABS, storageKey);
        const originalName = `${path.basename(image.src).replace(/\.[^.]+$/, "")}.webp`;

        const converted = await convertToWebpIfNeeded(src, dest);
        if (!converted.ok) continue;

        const mediaAssetId = await upsertMediaAsset(
          pool,
          storageKey,
          originalName,
          image.altText ?? null,
          converted.byteSize,
          converted.width,
          converted.height,
          converted.checksumSha256
        );

        await upsertProductImage(
          pool,
          product.slug,
          mediaAssetId,
          image.sortOrder,
          image.isPrimary
        );
      }
    }

    process.stdout.write("==> Category images\n");

    for (const category of manifest.categories ?? []) {
      const image = category.image;
      if (!image) continue;

      process.stdout.write(`  category: ${category.slug}\n`);

      const src = path.join(SEED_DIR, image.src);
      const storageKey = toWebpDestRelative(image.src);
      const dest = path.join(UPLOADS_ABS, storageKey);
      const originalName = `${path.basename(image.src).replace(/\.[^.]+$/, "")}.webp`;

      const converted = await convertToWebpIfNeeded(src, dest);
      if (!converted.ok) continue;

      const mediaAssetId = await upsertMediaAsset(
        pool,
        storageKey,
        originalName,
        image.altText ?? null,
        converted.byteSize,
        converted.width,
        converted.height,
        converted.checksumSha256
      );

      await setCategoryRepresentativeImage(pool, category.slug, mediaAssetId);
    }

    process.stdout.write("==> Done.\n");
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown seed-images error.";
  process.stderr.write(`seed-images: ${message}\n`);
  process.exitCode = 1;
});
