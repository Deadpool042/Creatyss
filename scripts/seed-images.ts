import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { MediaAssetKind, MediaAssetStatus, type PrismaClient } from "@prisma/client";
import { createScriptPrismaClient } from "./helpers/prisma-client.ts";
import { ensureDefaultStore } from "./helpers/store-bootstrap.ts";

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
}> {
  if (!existsSync(src)) {
    process.stdout.write(`  skip (src missing): ${path.relative(ROOT, src)}\n`);
    return { ok: false, byteSize: 0, width: null, height: null };
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
    };
  }

  await mkdir(path.dirname(dest), { recursive: true });

  const { data, info } = await sharp(src).webp(WEBP_OPTIONS).toBuffer({ resolveWithObject: true });

  await writeFile(dest, data, { flag: FORCE ? "w" : "wx" });

  process.stdout.write(
    `  converted -> ${path.relative(ROOT, dest)} (${Math.round(data.length / 1024)} kB)\n`
  );

  return {
    ok: true,
    byteSize: data.length,
    width: info.width ?? null,
    height: info.height ?? null,
  };
}

async function upsertMediaAsset(
  prisma: PrismaClient,
  storeId: string,
  storagePath: string,
  originalFilename: string,
  altText: string | null,
  byteSize: number,
  width: number | null,
  height: number | null
) {
  const existing = await prisma.mediaAsset.findFirst({
    where: {
      storeId,
      storagePath,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return prisma.mediaAsset.update({
      where: {
        id: existing.id,
      },
      data: {
        kind: MediaAssetKind.IMAGE,
        status: MediaAssetStatus.ACTIVE,
        originalFilename,
        storagePath,
        mimeType: "image/webp",
        altText,
        fileSizeBytes: byteSize,
        width,
        height,
      },
      select: {
        id: true,
      },
    });
  }

  return prisma.mediaAsset.create({
    data: {
      storeId,
      kind: MediaAssetKind.IMAGE,
      status: MediaAssetStatus.ACTIVE,
      originalFilename,
      storagePath,
      mimeType: "image/webp",
      altText,
      fileSizeBytes: byteSize,
      width,
      height,
    },
    select: {
      id: true,
    },
  });
}

async function upsertProductImage(
  prisma: PrismaClient,
  storeId: string,
  productSlug: string,
  mediaAssetId: string,
  sortOrder: number,
  isPrimary: boolean
) {
  const product = await prisma.product.findFirst({
    where: {
      storeId,
      slug: productSlug,
    },
    select: {
      id: true,
    },
  });

  if (!product) {
    process.stdout.write(`  skip (product missing): ${productSlug}\n`);
    return;
  }

  await prisma.productMedia.upsert({
    where: {
      productId_mediaAssetId: {
        productId: product.id,
        mediaAssetId,
      },
    },
    update: {
      sortOrder,
      isPrimary,
    },
    create: {
      productId: product.id,
      mediaAssetId,
      sortOrder,
      isPrimary,
    },
  });
}

export async function runSeedImages(): Promise<void> {
  const prisma = createScriptPrismaClient();

  try {
    const store = await ensureDefaultStore(prisma);

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
      process.stdout.write("==> No manifest.json - skipping image seed.\n");
      return;
    }

    const manifest: Manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

    process.stdout.write("==> Product images\n");

    for (const product of manifest.products ?? []) {
      const realImages = (product.images ?? []).filter((image) => image.src.trim().length > 0);
      if (realImages.length === 0) {
        continue;
      }

      process.stdout.write(`  product: ${product.slug}\n`);

      for (const image of realImages) {
        const src = path.join(SEED_DIR, image.src);
        const storagePath = toWebpDestRelative(image.src);
        const dest = path.join(UPLOADS_ABS, storagePath);
        const originalFilename = `${path.basename(image.src).replace(/\.[^.]+$/, "")}.webp`;
        const converted = await convertToWebpIfNeeded(src, dest);

        if (!converted.ok) {
          continue;
        }

        const mediaAsset = await upsertMediaAsset(
          prisma,
          store.id,
          storagePath,
          originalFilename,
          image.altText ?? null,
          converted.byteSize,
          converted.width,
          converted.height
        );

        await upsertProductImage(
          prisma,
          store.id,
          product.slug,
          mediaAsset.id,
          image.sortOrder,
          image.isPrimary
        );
      }
    }

    if ((manifest.categories ?? []).length > 0) {
      process.stdout.write(
        "==> Category images ignored: the current Prisma schema does not expose category media links.\n"
      );
    }

    process.stdout.write("==> Done.\n");
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await runSeedImages();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown seed-images error.";
    process.stderr.write(`seed-images: ${message}\n`);
    process.exitCode = 1;
  });
}
