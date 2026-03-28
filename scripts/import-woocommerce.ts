import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  CategoryStatus,
  MediaAssetKind,
  MediaAssetStatus,
  PriceStatus,
  ProductStatus,
  ProductVariantStatus,
  type PrismaClient,
} from "@prisma/client";
import { createScriptPrismaClient } from "./helpers/prisma-client.ts";
import { ensureDefaultPriceList, ensureDefaultStore } from "./bootstrap-store-and-admin.js";

type CliOptions = {
  skipImages: boolean;
};

type WooCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  menu_order: number;
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

type WooVariationAttribute = {
  name: string;
  option: string;
};

type WooVariation = {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  status?: string;
  image?: WooImage;
  attributes?: WooVariationAttribute[];
};

type PreparedWooProduct = {
  product: WooProduct;
  variations: WooVariation[];
};

type VariantSeed = {
  sku: string;
  name: string | null;
  status: ProductVariantStatus;
  amount: string | null;
  compareAtAmount: string | null;
  image: WooImage | null;
};

type CategoryRecord = {
  wooId: number;
  id: string;
};

const ROOT = process.cwd();
const UPLOADS_DIR = (process.env.UPLOADS_DIR ?? "public/uploads").replace(/\/$/, "");
const UPLOADS_ABS = path.join(ROOT, UPLOADS_DIR);
const WEBP_OPTIONS: sharp.WebpOptions = { quality: 85, effort: 4 };
const WOOCOMMERCE_MEDIA_ROOT = "imports/woocommerce";

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

function toNullableText(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeMoneyToDecimalString(value: string | null | undefined): string | null {
  if (!value || value.trim().length === 0) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed.toFixed(2);
}

function resolveCompareAtAmount(
  currentAmount: string | null,
  regularAmount: string | null
): string | null {
  if (currentAmount === null || regularAmount === null) {
    return null;
  }

  return Number(regularAmount) > Number(currentAmount) ? regularAmount : null;
}

function normalizeProductStatus(value: string): ProductStatus {
  if (value === "publish") {
    return ProductStatus.ACTIVE;
  }

  if (value === "draft" || value === "pending" || value === "private") {
    return ProductStatus.DRAFT;
  }

  return ProductStatus.ARCHIVED;
}

function normalizeVariantStatus(parentStatus: ProductStatus, value?: string): ProductVariantStatus {
  if (parentStatus === ProductStatus.ARCHIVED) {
    return ProductVariantStatus.ARCHIVED;
  }

  if (!value || value === "publish") {
    return ProductVariantStatus.ACTIVE;
  }

  if (value === "draft" || value === "pending" || value === "private") {
    return ProductVariantStatus.DISABLED;
  }

  return ProductVariantStatus.ARCHIVED;
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

    if (batch.length === 0) {
      break;
    }

    results.push(...batch);

    if (batch.length < 100) {
      break;
    }

    page += 1;
  }

  return results;
}

async function fetchVariations(productId: number): Promise<WooVariation[]> {
  return fetchPagedCollection<WooVariation>(`products/${productId}/variations`);
}

async function downloadAsWebp(imageUrl: string, destAbsolutePath: string) {
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
    height: info.height ?? null,
    width: info.width ?? null,
  };
}

function buildVariationName(productName: string, variation: WooVariation, index: number): string {
  const attributes = (variation.attributes ?? [])
    .map((attribute) => attribute.option.trim())
    .filter((value) => value.length > 0);

  if (attributes.length > 0) {
    return `${productName} - ${attributes.join(" / ")}`;
  }

  if (variation.sku.trim().length > 0) {
    return `${productName} - ${variation.sku.trim()}`;
  }

  return `${productName} - Déclinaison ${index + 1}`;
}

function buildFallbackVariantSku(input: { product: WooProduct; variation?: WooVariation }): string {
  if (input.variation) {
    return `WOO-VARIATION-${input.variation.id}`;
  }

  return `WOO-PRODUCT-${input.product.id}`;
}

function resolveRequiredVariantSku(input: {
  product: WooProduct;
  variation?: WooVariation;
}): string {
  const sourceSku = input.variation ? input.variation.sku : input.product.sku;
  const normalizedSku = toNullableText(sourceSku);

  if (normalizedSku !== null) {
    return normalizedSku;
  }

  const fallbackSku = buildFallbackVariantSku(input);
  const targetLabel = input.variation
    ? `variation ${input.variation.id} of product ${input.product.slug}`
    : `simple product ${input.product.slug}`;

  process.stderr.write(
    `Missing WooCommerce SKU for ${targetLabel}. Using fallback SKU ${fallbackSku}.\n`
  );

  return fallbackSku;
}

function buildVariantSeeds(
  product: WooProduct,
  variations: readonly WooVariation[]
): VariantSeed[] {
  const productStatus = normalizeProductStatus(product.status);

  if (product.type !== "variable" || variations.length === 0) {
    const amount =
      normalizeMoneyToDecimalString(product.price) ??
      normalizeMoneyToDecimalString(product.regular_price);

    return [
      {
        sku: resolveRequiredVariantSku({ product }),
        name: product.name,
        status:
          productStatus === ProductStatus.ACTIVE
            ? ProductVariantStatus.ACTIVE
            : productStatus === ProductStatus.DRAFT
              ? ProductVariantStatus.DISABLED
              : ProductVariantStatus.ARCHIVED,
        amount,
        compareAtAmount: resolveCompareAtAmount(
          amount,
          normalizeMoneyToDecimalString(product.regular_price)
        ),
        image: product.images[0] ?? null,
      },
    ];
  }

  return variations.map((variation, index) => {
    const amount =
      normalizeMoneyToDecimalString(variation.price) ??
      normalizeMoneyToDecimalString(variation.regular_price);

    return {
      sku: resolveRequiredVariantSku({ product, variation }),
      name: buildVariationName(product.name, variation, index),
      status: normalizeVariantStatus(productStatus, variation.status),
      amount,
      compareAtAmount: resolveCompareAtAmount(
        amount,
        normalizeMoneyToDecimalString(variation.regular_price)
      ),
      image: variation.image?.src ? variation.image : null,
    };
  });
}

async function upsertMediaAsset(
  prisma: PrismaClient,
  storeId: string,
  storagePath: string,
  originalFilename: string,
  altText: string | null,
  imageUrl: string
) {
  const converted = await downloadAsWebp(imageUrl, path.join(UPLOADS_ABS, storagePath));

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
        fileSizeBytes: converted.byteSize,
        width: converted.width,
        height: converted.height,
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
      fileSizeBytes: converted.byteSize,
      width: converted.width,
      height: converted.height,
    },
    select: {
      id: true,
    },
  });
}

async function attachProductImages(
  prisma: PrismaClient,
  storeId: string,
  productId: string,
  productSlug: string,
  images: readonly WooImage[]
) {
  let primaryMediaAssetId: string | null = null;

  for (const [index, image] of images.entries()) {
    if (!image.src) {
      continue;
    }

    try {
      const storagePath = `${WOOCOMMERCE_MEDIA_ROOT}/products/${productSlug}/${String(index + 1).padStart(2, "0")}.webp`;
      const originalFilename = `${path.basename(image.src).replace(/\.[^.]+$/, "")}.webp`;
      const mediaAsset = await upsertMediaAsset(
        prisma,
        storeId,
        storagePath,
        originalFilename,
        toNullableText(image.alt),
        image.src
      );

      await prisma.productMedia.create({
        data: {
          productId,
          mediaAssetId: mediaAsset.id,
          sortOrder: index,
          isPrimary: index === 0,
        },
      });

      if (index === 0) {
        primaryMediaAssetId = mediaAsset.id;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown product image import error.";
      process.stderr.write(`product image skipped for ${productSlug}: ${message}\n`);
    }
  }

  return {
    primaryMediaAssetId,
  };
}

async function attachVariantImage(
  prisma: PrismaClient,
  storeId: string,
  variantId: string,
  productSlug: string,
  sortOrder: number,
  image: WooImage
) {
  if (!image.src) {
    return null;
  }

  const suffix = image.id > 0 ? String(image.id) : String(sortOrder + 1).padStart(2, "0");
  const storagePath = `${WOOCOMMERCE_MEDIA_ROOT}/products/${productSlug}/variants/${suffix}.webp`;
  const originalFilename = `${path.basename(image.src).replace(/\.[^.]+$/, "")}.webp`;
  const mediaAsset = await upsertMediaAsset(
    prisma,
    storeId,
    storagePath,
    originalFilename,
    toNullableText(image.alt),
    image.src
  );

  await prisma.productVariantMedia.create({
    data: {
      variantId,
      mediaAssetId: mediaAsset.id,
      sortOrder,
      isPrimary: true,
    },
  });

  return mediaAsset.id;
}

async function resetImportedCatalog(prisma: PrismaClient, storeId: string) {
  await prisma.product.deleteMany({
    where: {
      storeId,
    },
  });

  await prisma.category.deleteMany({
    where: {
      storeId,
    },
  });

  await prisma.mediaAsset.deleteMany({
    where: {
      storeId,
      storagePath: {
        startsWith: WOOCOMMERCE_MEDIA_ROOT,
      },
    },
  });
}

async function importCategories(
  prisma: PrismaClient,
  storeId: string,
  categories: readonly WooCategory[]
) {
  const categoryRecords: CategoryRecord[] = [];
  const orderedCategories = [...categories].sort((left, right) => {
    if (left.menu_order !== right.menu_order) {
      return left.menu_order - right.menu_order;
    }

    return left.name.localeCompare(right.name, "fr");
  });

  for (const [index, category] of orderedCategories.entries()) {
    const createdCategory = await prisma.category.create({
      data: {
        storeId,
        slug: category.slug,
        name: category.name,
        description: toNullableText(category.description),
        status: CategoryStatus.ACTIVE,
        sortOrder: index,
        isFeatured: false,
      },
      select: {
        id: true,
      },
    });

    categoryRecords.push({
      wooId: category.id,
      id: createdCategory.id,
    });
  }

  const idByWooCategoryId = new Map(categoryRecords.map((record) => [record.wooId, record.id]));

  for (const category of orderedCategories) {
    const categoryId = idByWooCategoryId.get(category.id);

    if (!categoryId) {
      continue;
    }

    await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        parentId: category.parent > 0 ? (idByWooCategoryId.get(category.parent) ?? null) : null,
      },
    });
  }

  return idByWooCategoryId;
}

async function importProducts(
  prisma: PrismaClient,
  storeId: string,
  priceListId: string,
  preparedProducts: readonly PreparedWooProduct[],
  categoryIdsByWooId: ReadonlyMap<number, string>,
  skipImages: boolean
) {
  for (const preparedProduct of preparedProducts) {
    const { product, variations } = preparedProduct;
    const productStatus = normalizeProductStatus(product.status);
    const productAmount =
      normalizeMoneyToDecimalString(product.price) ??
      normalizeMoneyToDecimalString(product.regular_price);

    const createdProduct = await prisma.product.create({
      data: {
        storeId,
        slug: product.slug,
        name: product.name,
        shortDescription: toNullableText(product.short_description),
        description: toNullableText(product.description),
        status: productStatus,
        isFeatured: product.featured,
      },
      select: {
        id: true,
      },
    });

    const categoryLinks = product.categories
      .map((categoryRef, index) => {
        const categoryId = categoryIdsByWooId.get(categoryRef.id);

        if (!categoryId) {
          return null;
        }

        return {
          productId: createdProduct.id,
          categoryId,
          sortOrder: index,
          isPrimary: index === 0,
        };
      })
      .filter((value): value is NonNullable<typeof value> => value !== null);

    if (categoryLinks.length > 0) {
      await prisma.productCategory.createMany({
        data: categoryLinks,
      });
    }

    if (productAmount !== null) {
      await prisma.productPrice.create({
        data: {
          priceListId,
          productId: createdProduct.id,
          amount: productAmount,
          compareAtAmount: resolveCompareAtAmount(
            productAmount,
            normalizeMoneyToDecimalString(product.regular_price)
          ),
          status: PriceStatus.ACTIVE,
        },
      });
    }

    const variantSeeds = buildVariantSeeds(product, variations);
    let defaultVariantId: string | null = null;
    let productPrimaryMediaAssetId: string | null = null;

    if (!skipImages) {
      const imageResult = await attachProductImages(
        prisma,
        storeId,
        createdProduct.id,
        product.slug,
        product.images
      );

      productPrimaryMediaAssetId = imageResult.primaryMediaAssetId;
    }

    for (const [index, variantSeed] of variantSeeds.entries()) {
      const createdVariant = await prisma.productVariant.create({
        data: {
          storeId,
          productId: createdProduct.id,
          sku: variantSeed.sku,
          name: variantSeed.name,
          status: variantSeed.status,
          sortOrder: index,
        },
        select: {
          id: true,
        },
      });

      if (defaultVariantId === null) {
        defaultVariantId = createdVariant.id;
      }

      if (variantSeed.amount !== null) {
        await prisma.productVariantPrice.create({
          data: {
            priceListId,
            variantId: createdVariant.id,
            amount: variantSeed.amount,
            compareAtAmount: variantSeed.compareAtAmount,
            status: PriceStatus.ACTIVE,
          },
        });
      }

      if (!skipImages) {
        try {
          if (variantSeed.image?.src) {
            await attachVariantImage(
              prisma,
              storeId,
              createdVariant.id,
              product.slug,
              index,
              variantSeed.image
            );
          } else if (index === 0 && productPrimaryMediaAssetId !== null) {
            await prisma.productVariantMedia.create({
              data: {
                variantId: createdVariant.id,
                mediaAssetId: productPrimaryMediaAssetId,
                sortOrder: 0,
                isPrimary: true,
              },
            });
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown variant image import error.";
          process.stderr.write(`variant image skipped for ${product.slug}: ${message}\n`);
        }
      }
    }

    if (defaultVariantId !== null) {
      await prisma.product.update({
        where: {
          id: createdProduct.id,
        },
        data: {
          defaultVariantId,
        },
      });
    }

    process.stdout.write(`Imported product: ${product.slug}\n`);
  }
}

export async function runImportWooCommerceCatalog(options: CliOptions): Promise<void> {
  const prisma = createScriptPrismaClient();

  try {
    process.stdout.write("Fetching categories from WooCommerce...\n");
    const categories = await fetchPagedCollection<WooCategory>("products/categories");

    process.stdout.write("Fetching products from WooCommerce...\n");
    const products = await fetchPagedCollection<WooProduct>("products");

    const preparedProducts: PreparedWooProduct[] = [];

    for (const product of products) {
      const variations = product.type === "variable" ? await fetchVariations(product.id) : [];
      preparedProducts.push({ product, variations });
    }

    const store = await ensureDefaultStore(prisma);
    const priceList = await ensureDefaultPriceList(prisma, store.id);

    process.stdout.write("Resetting imported WooCommerce catalog...\n");
    await resetImportedCatalog(prisma, store.id);

    process.stdout.write("Importing categories...\n");
    const categoryIdsByWooId = await importCategories(prisma, store.id, categories);

    process.stdout.write("Importing products...\n");
    await importProducts(
      prisma,
      store.id,
      priceList.id,
      preparedProducts,
      categoryIdsByWooId,
      options.skipImages
    );

    process.stdout.write(`Imported ${preparedProducts.length} products.\n`);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await runImportWooCommerceCatalog(parseCliOptions(process.argv.slice(2)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown WooCommerce import error.";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
