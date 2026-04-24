import { createScriptPrismaClient } from "./helpers/prisma-client";
import { ensureDefaultStore } from "./helpers/admin-bootstrap";
import type {
  AvailabilityStatus,
  InventoryItemStatus,
  MediaAssetKind,
  MediaAssetStatus,
  PriceListStatus,
  PrismaClient,
  ProductStatus,
  ProductVariantStatus,
  RelatedProductType,
  SeoIndexingMode,
} from "../src/generated/prisma/client";

type SeedMediaSpec = {
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  altText: string;
};

type SeedPricingSpec = {
  amount: string;
  compareAtAmount?: string | null;
};

type SeedProductSpec = {
  slug: string;
  name: string;
  skuRoot: string;
  marketingHook: string;
  shortDescription: string;
  descriptionHtml: string;
  pricing: SeedPricingSpec;
  categoryCodes: string[];
  primaryCategoryCode: string;
  images: SeedMediaSpec[];
  characteristics: Array<{ label: string; value: string }>;
  seo?:
    | {
        metaTitle: string;
        metaDescription: string;
        openGraphTitle?: string;
        openGraphDescription?: string;
        openGraphImageStorageKey?: string;
        twitterTitle?: string;
        twitterDescription?: string;
        twitterImageStorageKey?: string;
        canonicalPath?: string | null;
      }
    | undefined;
  variants: Array<{
    sku: string;
    slug: string;
    name: string;
    status: "ACTIVE" | "INACTIVE" | "DRAFT";
    sortOrder: number;
    isDefault: boolean;
    optionValues: {
      color: string;
      finish: string;
    };
    primaryImageStorageKey: string;
    inventory: { onHand: number; reserved: number };
    availability: { status: "AVAILABLE" | "UNAVAILABLE"; isSellable: boolean };
    dimensions?: { weightGrams?: number; widthMm?: number; heightMm?: number; depthMm?: number };
	  }>;
};

function uploadsUrl(storageKey: string): string {
  return `/uploads/${storageKey.replace(/^\/+/, "")}`;
}

function validateVariableProductSpec(spec: SeedProductSpec): void {
  if (spec.slug.trim().length === 0) {
    throw new Error("SeedProductSpec.slug is required.");
  }

  if (spec.variants.length === 0) {
    throw new Error(`SeedProductSpec.variants is empty for product ${spec.slug}.`);
  }

  const defaultVariants = spec.variants.filter((v) => v.isDefault);
  if (defaultVariants.length !== 1) {
    throw new Error(
      `Exactly one default variant is required for product ${spec.slug}. Got ${defaultVariants.length}.`
    );
  }

  const defaultVariant = defaultVariants[0];
  if (!defaultVariant) {
    throw new Error(`Default variant resolution failed for product ${spec.slug}.`);
  }
  if (defaultVariant.status !== "ACTIVE") {
    throw new Error(
      `Default variant must be ACTIVE for product ${spec.slug}. Got ${defaultVariant.status}.`
    );
  }

  const seenCombinations = new Set<string>();
  for (const variant of spec.variants) {
    const key = `${variant.optionValues.color}__${variant.optionValues.finish}`;
    if (seenCombinations.has(key)) {
      throw new Error(
        `Duplicate variant option combination (${key}) detected for product ${spec.slug}.`
      );
    }
    seenCombinations.add(key);
  }
}

async function ensureCanonicalProductTypes(prisma: PrismaClient, storeId: string): Promise<{
  simpleId: string;
  variableId: string;
}> {
  const [simple, variable] = await Promise.all([
    prisma.productType.upsert({
      where: {
        storeId_code: {
          storeId,
          code: "simple",
        },
      },
      update: {
        name: "Produit simple",
        slug: "simple",
        description: "Produit vendu seul, sans déclinaison obligatoire.",
        isActive: true,
        archivedAt: null,
      },
      create: {
        storeId,
        code: "simple",
        slug: "simple",
        name: "Produit simple",
        description: "Produit vendu seul, sans déclinaison obligatoire.",
        isActive: true,
      },
      select: { id: true },
    }),
    prisma.productType.upsert({
      where: {
        storeId_code: {
          storeId,
          code: "variable",
        },
      },
      update: {
        name: "Produit à variantes",
        slug: "variable",
        description: "Produit avec déclinaisons (couleur, finition…).",
        isActive: true,
        archivedAt: null,
      },
      create: {
        storeId,
        code: "variable",
        slug: "variable",
        name: "Produit à variantes",
        description: "Produit avec déclinaisons (couleur, finition…).",
        isActive: true,
      },
      select: { id: true },
    }),
  ]);

  return { simpleId: simple.id, variableId: variable.id };
}

async function ensureVariantAxisOptions(
  prisma: PrismaClient,
  productTypeId: string
): Promise<{ colorOptionId: string; finishOptionId: string }> {
  const color = await prisma.productOption.upsert({
    where: {
      productTypeId_code: {
        productTypeId,
        code: "color",
      },
    },
    update: {
      name: "Couleur",
      description: "Couleur dominante du produit.",
      sortOrder: 0,
      isRequired: true,
      isVariantAxis: true,
      isActive: true,
      archivedAt: null,
    },
    create: {
      productTypeId,
      code: "color",
      name: "Couleur",
      description: "Couleur dominante du produit.",
      sortOrder: 0,
      isRequired: true,
      isVariantAxis: true,
      isActive: true,
    },
    select: { id: true },
  });

  const finish = await prisma.productOption.upsert({
    where: {
      productTypeId_code: {
        productTypeId,
        code: "finish",
      },
    },
    update: {
      name: "Finition",
      description: "Finition de matière (lisse, grainée…).",
      sortOrder: 1,
      isRequired: true,
      isVariantAxis: true,
      isActive: true,
      archivedAt: null,
    },
    create: {
      productTypeId,
      code: "finish",
      name: "Finition",
      description: "Finition de matière (lisse, grainée…).",
      sortOrder: 1,
      isRequired: true,
      isVariantAxis: true,
      isActive: true,
    },
    select: { id: true },
  });

  return { colorOptionId: color.id, finishOptionId: finish.id };
}

async function upsertOptionValue(
  prisma: PrismaClient,
  input: { optionId: string; code: string; value: string; label?: string; sortOrder: number }
): Promise<{ id: string }> {
  return prisma.productOptionValue.upsert({
    where: {
      optionId_code: {
        optionId: input.optionId,
        code: input.code,
      },
    },
    update: {
      value: input.value,
      label: input.label ?? null,
      sortOrder: input.sortOrder,
      isActive: true,
      archivedAt: null,
    },
    create: {
      optionId: input.optionId,
      code: input.code,
      value: input.value,
      label: input.label ?? null,
      sortOrder: input.sortOrder,
      isActive: true,
    },
    select: { id: true },
  });
}

async function upsertMediaAsset(
  prisma: PrismaClient,
  storeId: string,
  spec: SeedMediaSpec
): Promise<{ id: string; storageKey: string }> {
  const storageKey = spec.storageKey.replace(/^\/+/, "");
  return prisma.mediaAsset.upsert({
    where: {
      storeId_storageKey: {
        storeId,
        storageKey,
      },
    },
    update: {
      kind: "IMAGE" satisfies MediaAssetKind,
      status: "ACTIVE" satisfies MediaAssetStatus,
      altText: spec.altText,
      originalFilename: spec.originalFilename,
      mimeType: spec.mimeType,
      storageKey,
      publicUrl: uploadsUrl(storageKey),
      isPublic: true,
      publishedAt: new Date(),
      archivedAt: null,
    },
    create: {
      storeId,
      kind: "IMAGE" satisfies MediaAssetKind,
      status: "ACTIVE" satisfies MediaAssetStatus,
      altText: spec.altText,
      originalFilename: spec.originalFilename,
      mimeType: spec.mimeType,
      storageKey,
      publicUrl: uploadsUrl(storageKey),
      isPublic: true,
      publishedAt: new Date(),
    },
    select: { id: true, storageKey: true },
  });
}

async function ensureCategoryIdsByCode(
  prisma: PrismaClient,
  storeId: string
): Promise<Map<string, string>> {
  const categories = await prisma.category.findMany({
    where: {
      storeId,
      archivedAt: null,
    },
    select: { id: true, code: true },
  });

  return new Map<string, string>(categories.map((c) => [c.code, c.id]));
}

async function seedProduct(
  prisma: PrismaClient,
  input: {
  storeId: string;
  productTypeId: string;
  priceListId: string;
  optionValueIdsByCode: Map<string, string>;
  categoryIdByCode: Map<string, string>;
  spec: SeedProductSpec;
}
): Promise<{ productId: string }> {
  validateVariableProductSpec(input.spec);

  const categoryIds: string[] = [];
  for (const code of input.spec.categoryCodes) {
    const id = input.categoryIdByCode.get(code);
    if (!id) {
      throw new Error(
        `Missing category code "${code}" for product ${input.spec.slug}. Run scripts/seed-categories.ts first.`
      );
    }
    categoryIds.push(id);
  }

  const primaryCategoryId = input.categoryIdByCode.get(input.spec.primaryCategoryCode) ?? null;
  if (!primaryCategoryId) {
    throw new Error(
      `Missing primary category code "${input.spec.primaryCategoryCode}" for product ${input.spec.slug}.`
    );
  }
  if (!categoryIds.includes(primaryCategoryId)) {
    categoryIds.unshift(primaryCategoryId);
  }

  const mediaAssets: Array<{ id: string; storageKey: string }> = [];
  for (const media of input.spec.images) {
    mediaAssets.push(await upsertMediaAsset(prisma, input.storeId, media));
  }

  const primaryImageId = mediaAssets[0]?.id ?? null;

  const product = await prisma.product.upsert({
    where: {
      storeId_slug: {
        storeId: input.storeId,
        slug: input.spec.slug,
      },
    },
    update: {
      productTypeId: input.productTypeId,
      primaryImageId,
      skuRoot: input.spec.skuRoot,
      name: input.spec.name,
      marketingHook: input.spec.marketingHook,
      shortDescription: input.spec.shortDescription,
      description: input.spec.descriptionHtml,
      status: "ACTIVE" satisfies ProductStatus,
      isFeatured: true,
      isStandalone: false,
      publishedAt: new Date(),
      archivedAt: null,
    },
    create: {
      storeId: input.storeId,
      productTypeId: input.productTypeId,
      primaryImageId,
      skuRoot: input.spec.skuRoot,
      slug: input.spec.slug,
      name: input.spec.name,
      marketingHook: input.spec.marketingHook,
      shortDescription: input.spec.shortDescription,
      description: input.spec.descriptionHtml,
      status: "ACTIVE" satisfies ProductStatus,
      isFeatured: true,
      isStandalone: false,
      publishedAt: new Date(),
    },
    select: { id: true },
  });

  // Categories: replace-all for seed determinism.
  await prisma.productCategory.deleteMany({ where: { productId: product.id } });
  for (const [index, categoryId] of categoryIds.entries()) {
    await prisma.productCategory.create({
      data: {
        productId: product.id,
        categoryId,
        isPrimary: primaryCategoryId === categoryId,
        sortOrder: index,
      },
    });
  }

  // Characteristics: replace-all.
  await prisma.productCharacteristic.deleteMany({ where: { productId: product.id } });
  for (const [index, characteristic] of input.spec.characteristics.entries()) {
    await prisma.productCharacteristic.create({
      data: {
        productId: product.id,
        label: characteristic.label,
        value: characteristic.value,
        sortOrder: index,
      },
    });
  }

  // Media references (gallery): idempotent via unique on (assetId, subjectType, subjectId, role).
  for (const [index, asset] of mediaAssets.entries()) {
    await prisma.mediaReference.upsert({
      where: {
        assetId_subjectType_subjectId_role: {
          assetId: asset.id,
          subjectType: "PRODUCT",
          subjectId: product.id,
          role: "GALLERY",
        },
      },
      update: {
        sortOrder: index,
        isActive: true,
        isPrimary: asset.id === primaryImageId,
        archivedAt: null,
      },
      create: {
        assetId: asset.id,
        subjectType: "PRODUCT",
        subjectId: product.id,
        role: "GALLERY",
        sortOrder: index,
        isActive: true,
        isPrimary: asset.id === primaryImageId,
      },
      select: { id: true },
    });
  }

  // SEO metadata (optional).
  const seo = input.spec.seo;
  if (seo) {
    const ogAssetId = seo.openGraphImageStorageKey
      ? (await upsertMediaAsset(prisma, input.storeId, {
          storageKey: seo.openGraphImageStorageKey,
          originalFilename: seo.openGraphImageStorageKey.split("/").pop() ?? "og.webp",
          mimeType: seo.openGraphImageStorageKey.endsWith(".jpg") ? "image/jpeg" : "image/webp",
          altText: `${input.spec.name} — visuel partage`,
        })).id
      : null;

    const twitterAssetId = seo.twitterImageStorageKey
      ? (await upsertMediaAsset(prisma, input.storeId, {
          storageKey: seo.twitterImageStorageKey,
          originalFilename: seo.twitterImageStorageKey.split("/").pop() ?? "twitter.webp",
          mimeType: seo.twitterImageStorageKey.endsWith(".jpg") ? "image/jpeg" : "image/webp",
          altText: `${input.spec.name} — visuel partage`,
        })).id
      : null;

    await prisma.seoMetadata.upsert({
      where: {
        storeId_subjectType_subjectId: {
          storeId: input.storeId,
          subjectType: "PRODUCT",
          subjectId: product.id,
        },
      },
      update: {
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        canonicalPath: seo.canonicalPath ?? null,
        indexingMode: "INDEX_FOLLOW" satisfies SeoIndexingMode,
        sitemapIncluded: true,
        openGraphTitle: seo.openGraphTitle ?? null,
        openGraphDescription: seo.openGraphDescription ?? null,
        openGraphImageId: ogAssetId,
        twitterTitle: seo.twitterTitle ?? null,
        twitterDescription: seo.twitterDescription ?? null,
        twitterImageId: twitterAssetId,
        archivedAt: null,
      },
      create: {
        storeId: input.storeId,
        subjectType: "PRODUCT",
        subjectId: product.id,
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        canonicalPath: seo.canonicalPath ?? null,
        indexingMode: "INDEX_FOLLOW" satisfies SeoIndexingMode,
        sitemapIncluded: true,
        openGraphTitle: seo.openGraphTitle ?? null,
        openGraphDescription: seo.openGraphDescription ?? null,
        openGraphImageId: ogAssetId,
        twitterTitle: seo.twitterTitle ?? null,
        twitterDescription: seo.twitterDescription ?? null,
        twitterImageId: twitterAssetId,
      },
      select: { id: true },
    });
  }

  // Variants: upsert by (productId, sku), sync axis option values.
  const colorOptionValueIds = new Map<string, string>();
  const finishOptionValueIds = new Map<string, string>();
  for (const [code, id] of input.optionValueIdsByCode.entries()) {
    if (code.startsWith("color:")) colorOptionValueIds.set(code.slice("color:".length), id);
    if (code.startsWith("finish:")) finishOptionValueIds.set(code.slice("finish:".length), id);
  }

  // Ensure idempotence: the seed owns the "default variant" flag for this product.
  await prisma.productVariant.updateMany({
    where: {
      productId: product.id,
      archivedAt: null,
    },
    data: {
      isDefault: false,
    },
  });

  for (const variantSpec of input.spec.variants) {
    const primaryVariantAsset = await upsertMediaAsset(prisma, input.storeId, {
      storageKey: variantSpec.primaryImageStorageKey,
      originalFilename: variantSpec.primaryImageStorageKey.split("/").pop() ?? "variant.webp",
      mimeType: variantSpec.primaryImageStorageKey.endsWith(".jpg") ? "image/jpeg" : "image/webp",
      altText: `${input.spec.name} — ${variantSpec.name}`,
    });

    const variant = await prisma.productVariant.upsert({
      where: {
        productId_sku: {
          productId: product.id,
          sku: variantSpec.sku,
        },
      },
      update: {
        slug: variantSpec.slug,
        name: variantSpec.name,
        status: variantSpec.status satisfies ProductVariantStatus,
        isDefault: variantSpec.isDefault,
        sortOrder: variantSpec.sortOrder,
        primaryImageId: primaryVariantAsset.id,
        publishedAt: variantSpec.status === "ACTIVE" ? new Date() : null,
        archivedAt: null,
        weightGrams: variantSpec.dimensions?.weightGrams ?? null,
        widthMm: variantSpec.dimensions?.widthMm ?? null,
        heightMm: variantSpec.dimensions?.heightMm ?? null,
        depthMm: variantSpec.dimensions?.depthMm ?? null,
      },
      create: {
        productId: product.id,
        sku: variantSpec.sku,
        slug: variantSpec.slug,
        name: variantSpec.name,
        status: variantSpec.status satisfies ProductVariantStatus,
        isDefault: variantSpec.isDefault,
        sortOrder: variantSpec.sortOrder,
        primaryImageId: primaryVariantAsset.id,
        publishedAt: variantSpec.status === "ACTIVE" ? new Date() : null,
        weightGrams: variantSpec.dimensions?.weightGrams ?? null,
        widthMm: variantSpec.dimensions?.widthMm ?? null,
        heightMm: variantSpec.dimensions?.heightMm ?? null,
        depthMm: variantSpec.dimensions?.depthMm ?? null,
      },
      select: { id: true },
    });

    const colorValueId = colorOptionValueIds.get(variantSpec.optionValues.color);
    const finishValueId = finishOptionValueIds.get(variantSpec.optionValues.finish);
    const optionValueIds = [colorValueId, finishValueId].filter((v): v is string => Boolean(v));

    await prisma.productVariantOptionValue.deleteMany({
      where: {
        variantId: variant.id,
        optionValue: {
          option: {
            isVariantAxis: true,
          },
        },
      },
    });

    if (optionValueIds.length > 0) {
      await prisma.productVariantOptionValue.createMany({
        data: optionValueIds.map((optionValueId) => ({
          variantId: variant.id,
          optionValueId,
        })),
        skipDuplicates: true,
      });
    }

    await prisma.inventoryItem.upsert({
      where: {
        storeId_variantId: {
          storeId: input.storeId,
          variantId: variant.id,
        },
      },
      update: {
        status: "ACTIVE" satisfies InventoryItemStatus,
        archivedAt: null,
        sku: variantSpec.sku,
        onHandQuantity: variantSpec.inventory.onHand,
        reservedQuantity: variantSpec.inventory.reserved,
      },
      create: {
        storeId: input.storeId,
        variantId: variant.id,
        sku: variantSpec.sku,
        status: "ACTIVE" satisfies InventoryItemStatus,
        onHandQuantity: variantSpec.inventory.onHand,
        reservedQuantity: variantSpec.inventory.reserved,
      },
      select: { id: true },
    });

    await prisma.availabilityRecord.upsert({
      where: {
        storeId_variantId: {
          storeId: input.storeId,
          variantId: variant.id,
        },
      },
      update: {
        archivedAt: null,
        status: variantSpec.availability.status satisfies AvailabilityStatus,
        isSellable: variantSpec.availability.isSellable,
        backorderAllowed: false,
      },
      create: {
        storeId: input.storeId,
        variantId: variant.id,
        status: variantSpec.availability.status satisfies AvailabilityStatus,
        isSellable: variantSpec.availability.isSellable,
        backorderAllowed: false,
      },
      select: { id: true },
    });

    await prisma.productVariantPrice.upsert({
      where: {
        variantId_priceListId: {
          variantId: variant.id,
          priceListId: input.priceListId,
        },
      },
      update: {
        archivedAt: null,
        isActive: true,
        amount: input.spec.pricing.amount,
        compareAtAmount: input.spec.pricing.compareAtAmount ?? null,
      },
      create: {
        variantId: variant.id,
        priceListId: input.priceListId,
        isActive: true,
        amount: input.spec.pricing.amount,
        compareAtAmount: input.spec.pricing.compareAtAmount ?? null,
      },
      select: { id: true },
    });
  }

  // Product-level price (fallback).
  await prisma.productPrice.upsert({
    where: {
      productId_priceListId: {
        productId: product.id,
        priceListId: input.priceListId,
      },
    },
    update: {
      archivedAt: null,
      isActive: true,
      amount: input.spec.pricing.amount,
      compareAtAmount: input.spec.pricing.compareAtAmount ?? null,
    },
    create: {
      productId: product.id,
      priceListId: input.priceListId,
      isActive: true,
      amount: input.spec.pricing.amount,
      compareAtAmount: input.spec.pricing.compareAtAmount ?? null,
    },
    select: { id: true },
  });

  return { productId: product.id };
}

async function main() {
  const prisma = createScriptPrismaClient();

  try {
    const store = await ensureDefaultStore(prisma);
    const { variableId } = await ensureCanonicalProductTypes(prisma, store.id);

    const priceList = await prisma.priceList.upsert({
      where: {
        storeId_code: {
          storeId: store.id,
          code: "retail-eur",
        },
      },
      update: {
        name: "Tarif boutique (EUR)",
        description: "Tarif de référence pour les tests manuels.",
        currencyCode: "EUR",
        status: "ACTIVE" satisfies PriceListStatus,
        isDefault: true,
        archivedAt: null,
      },
      create: {
        storeId: store.id,
        code: "retail-eur",
        name: "Tarif boutique (EUR)",
        description: "Tarif de référence pour les tests manuels.",
        currencyCode: "EUR",
        status: "ACTIVE" satisfies PriceListStatus,
        isDefault: true,
      },
      select: { id: true },
    });

    const { colorOptionId, finishOptionId } = await ensureVariantAxisOptions(prisma, variableId);

    const optionValueIdsByCode = new Map<string, string>();
    const colors = [
      { code: "noir", value: "noir", label: "Noir", sortOrder: 0 },
      { code: "miel", value: "miel", label: "Miel", sortOrder: 1 },
      { code: "bordeaux", value: "bordeaux", label: "Bordeaux", sortOrder: 2 },
      { code: "sable", value: "sable", label: "Sable", sortOrder: 3 },
    ];
    const finishes = [
      { code: "lisse", value: "lisse", label: "Lisse", sortOrder: 0 },
      { code: "graine", value: "graine", label: "Grainé", sortOrder: 1 },
    ];

    for (const color of colors) {
      const created = await upsertOptionValue(prisma, {
        optionId: colorOptionId,
        code: color.code,
        value: color.value,
        label: color.label,
        sortOrder: color.sortOrder,
      });
      optionValueIdsByCode.set(`color:${color.code}`, created.id);
    }

    for (const finish of finishes) {
      const created = await upsertOptionValue(prisma, {
        optionId: finishOptionId,
        code: finish.code,
        value: finish.value,
        label: finish.label,
        sortOrder: finish.sortOrder,
      });
      optionValueIdsByCode.set(`finish:${finish.code}`, created.id);
    }

    const categoryIdByCode = await ensureCategoryIdsByCode(prisma, store.id);

    const products: SeedProductSpec[] = [
      {
        slug: "cabas-atelier",
        name: "Cabas Atelier",
        skuRoot: "CABAS-ATELIER",
        marketingHook: "Le cabas structuré du quotidien, ample, solide et lumineux.",
        shortDescription:
          "Un cabas artisanal pensé pour le quotidien. Format généreux, tenue structurée, finitions soignées. Décliné par couleur et finition.",
        descriptionHtml:
          "<p>Le <strong>Cabas Atelier</strong> est conçu pour accompagner vos journées: un format ample, une tenue structurée et des finitions nettes.</p><ul><li>Ouverture facile</li><li>Poches intérieures</li><li>Porté épaule confortable</li></ul>",
        pricing: {
          amount: "159.00",
          compareAtAmount: "179.00",
        },
        categoryCodes: ["sacs", "sacs-a-main"],
        primaryCategoryCode: "sacs-a-main",
        images: [
          {
            storageKey: "creatyss.webp",
            originalFilename: "creatyss.webp",
            mimeType: "image/webp",
            altText: "Cabas Atelier — vue principale",
          },
          {
            storageKey: "savoir-faire-placeholder.webp",
            originalFilename: "savoir-faire-placeholder.webp",
            mimeType: "image/webp",
            altText: "Cabas Atelier — détail matière",
          },
          {
            storageKey: "117-ROUGE-3.jpg",
            originalFilename: "117-ROUGE-3.jpg",
            mimeType: "image/jpeg",
            altText: "Cabas Atelier — vue portée",
          },
        ],
        characteristics: [
          { label: "Matière", value: "Toile épaisse et finitions soignées" },
          { label: "Fermeture", value: "Ouverture zippée" },
          { label: "Porté", value: "Épaule / main" },
          { label: "Poches", value: "Poche intérieure zippée" },
          { label: "Entretien", value: "Nettoyage local, chiffon doux" },
        ],
        seo: {
          metaTitle: "Cabas Atelier | Creatyss",
          metaDescription:
            "Cabas artisanal structuré, format généreux, finitions premium. Déclinaisons par couleur et finition. Livraison incluse.",
          openGraphTitle: "Cabas Atelier",
          openGraphDescription:
            "Le cabas du quotidien: ample, structuré, finitions premium. Déclinaisons par couleur et finition.",
          openGraphImageStorageKey: "creatyss.webp",
          twitterTitle: "Cabas Atelier",
          twitterDescription:
            "Cabas artisanal structuré, ample et solide. Déclinaisons par couleur et finition.",
          twitterImageStorageKey: "creatyss.webp",
        },
        variants: [
          {
            sku: "CABAS-ATELIER-NOIR-LISSE",
            slug: "noir-lisse",
            name: "Noir · Lisse",
            status: "ACTIVE",
            sortOrder: 0,
            isDefault: true,
            optionValues: { color: "noir", finish: "lisse" },
            primaryImageStorageKey: "creatyss.webp",
            inventory: { onHand: 12, reserved: 1 },
            availability: { status: "AVAILABLE", isSellable: true },
            dimensions: { weightGrams: 620, widthMm: 380, heightMm: 300, depthMm: 140 },
          },
          {
            sku: "CABAS-ATELIER-MIEL-GRAINE",
            slug: "miel-graine",
            name: "Miel · Grainé",
            status: "ACTIVE",
            sortOrder: 1,
            isDefault: false,
            optionValues: { color: "miel", finish: "graine" },
            primaryImageStorageKey: "savoir-faire-placeholder.webp",
            inventory: { onHand: 2, reserved: 0 },
            availability: { status: "AVAILABLE", isSellable: true },
            dimensions: { weightGrams: 640, widthMm: 380, heightMm: 300, depthMm: 140 },
          },
          {
            sku: "CABAS-ATELIER-BORDEAUX-LISSE",
            slug: "bordeaux-lisse",
            name: "Bordeaux · Lisse",
            status: "ACTIVE",
            sortOrder: 2,
            isDefault: false,
            optionValues: { color: "bordeaux", finish: "lisse" },
            primaryImageStorageKey: "117-ROUGE-3.jpg",
            inventory: { onHand: 0, reserved: 0 },
            availability: { status: "UNAVAILABLE", isSellable: false },
            dimensions: { weightGrams: 620, widthMm: 380, heightMm: 300, depthMm: 140 },
          },
          {
            sku: "CABAS-ATELIER-SABLE-GRAINE",
            slug: "sable-graine",
            name: "Sable · Grainé",
            status: "INACTIVE",
            sortOrder: 3,
            isDefault: false,
            optionValues: { color: "sable", finish: "graine" },
            primaryImageStorageKey: "savoir-faire-placeholder.webp",
            inventory: { onHand: 5, reserved: 0 },
            availability: { status: "AVAILABLE", isSellable: true },
          },
        ],
      },
      {
        slug: "bandouliere-rivoli",
        name: "Bandoulière Rivoli",
        skuRoot: "RIVOLI",
        marketingHook: "Le sac bandoulière compact, net, prêt à sortir.",
        shortDescription:
          "Un sac bandoulière artisanal au format compact, pensé pour l’essentiel. Déclinaisons par couleur et finition.",
        descriptionHtml:
          "<p>La <strong>Bandoulière Rivoli</strong> est un format compact et structuré.</p><p>Bandoulière réglable, poches intérieures et finitions propres.</p>",
        pricing: {
          amount: "129.00",
        },
        categoryCodes: ["sacs", "sacs-bandouliere"],
        primaryCategoryCode: "sacs-bandouliere",
        images: [
          {
            storageKey: "savoir-faire-placeholder.webp",
            originalFilename: "savoir-faire-placeholder.webp",
            mimeType: "image/webp",
            altText: "Bandoulière Rivoli — vue principale",
          },
          {
            storageKey: "creatyss.webp",
            originalFilename: "creatyss.webp",
            mimeType: "image/webp",
            altText: "Bandoulière Rivoli — détail fermeture",
          },
        ],
        characteristics: [
          { label: "Matière", value: "Toile + finitions artisanales" },
          { label: "Porté", value: "Bandoulière réglable" },
          { label: "Poches", value: "Poche intérieure" },
          { label: "Entretien", value: "Chiffon doux, nettoyage local" },
        ],
        // No explicit SEO: we want fallbacks to apply on at least one product.
        seo: undefined,
        variants: [
          {
            sku: "RIVOLI-NOIR-GRAINE",
            slug: "noir-graine",
            name: "Noir · Grainé",
            status: "ACTIVE",
            sortOrder: 0,
            isDefault: true,
            optionValues: { color: "noir", finish: "graine" },
            primaryImageStorageKey: "savoir-faire-placeholder.webp",
            inventory: { onHand: 7, reserved: 2 },
            availability: { status: "AVAILABLE", isSellable: true },
          },
          {
            sku: "RIVOLI-MIEL-LISSE",
            slug: "miel-lisse",
            name: "Miel · Lisse",
            status: "ACTIVE",
            sortOrder: 1,
            isDefault: false,
            optionValues: { color: "miel", finish: "lisse" },
            primaryImageStorageKey: "creatyss.webp",
            inventory: { onHand: 1, reserved: 0 },
            availability: { status: "AVAILABLE", isSellable: true },
          },
          {
            sku: "RIVOLI-BORDEAUX-GRAINE",
            slug: "bordeaux-graine",
            name: "Bordeaux · Grainé",
            status: "ACTIVE",
            sortOrder: 2,
            isDefault: false,
            optionValues: { color: "bordeaux", finish: "graine" },
            primaryImageStorageKey: "117-ROUGE-3.jpg",
            inventory: { onHand: 0, reserved: 0 },
            availability: { status: "UNAVAILABLE", isSellable: false },
          },
        ],
      },
      {
        slug: "mini-sac-clarte",
        name: "Mini Sac Clarté",
        skuRoot: "CLARTE",
        marketingHook: "Le mini sac qui tient l’essentiel, avec une ligne nette.",
        shortDescription:
          "Mini sac artisanal, compact et structuré. Variantes par couleur et finition pour tester les déclinaisons.",
        descriptionHtml:
          "<p><strong>Mini Sac Clarté</strong> : compact, structuré, pensé pour l’essentiel.</p>",
        pricing: {
          amount: "99.00",
        },
        categoryCodes: ["sacs", "mini-sacs"],
        primaryCategoryCode: "mini-sacs",
        images: [
          {
            storageKey: "117-ROUGE-3.jpg",
            originalFilename: "117-ROUGE-3.jpg",
            mimeType: "image/jpeg",
            altText: "Mini Sac Clarté — vue principale",
          },
          {
            storageKey: "savoir-faire-placeholder.webp",
            originalFilename: "savoir-faire-placeholder.webp",
            mimeType: "image/webp",
            altText: "Mini Sac Clarté — détail",
          },
        ],
        characteristics: [
          { label: "Matière", value: "Toile épaisse, finitions nettes" },
          { label: "Fermeture", value: "Rabat aimanté" },
          { label: "Porté", value: "Bandoulière" },
        ],
        seo: {
          metaTitle: "Mini Sac Clarté | Creatyss",
          metaDescription:
            "Mini sac artisanal compact et structuré. Déclinaisons par couleur et finition. Livraison incluse.",
          openGraphImageStorageKey: "117-ROUGE-3.jpg",
          twitterImageStorageKey: "117-ROUGE-3.jpg",
        },
        variants: [
          {
            sku: "CLARTE-NOIR-LISSE",
            slug: "noir-lisse",
            name: "Noir · Lisse",
            status: "ACTIVE",
            sortOrder: 0,
            isDefault: true,
            optionValues: { color: "noir", finish: "lisse" },
            primaryImageStorageKey: "117-ROUGE-3.jpg",
            inventory: { onHand: 4, reserved: 0 },
            availability: { status: "AVAILABLE", isSellable: true },
          },
          {
            sku: "CLARTE-SABLE-GRAINE",
            slug: "sable-graine",
            name: "Sable · Grainé",
            status: "ACTIVE",
            sortOrder: 1,
            isDefault: false,
            optionValues: { color: "sable", finish: "graine" },
            primaryImageStorageKey: "savoir-faire-placeholder.webp",
            inventory: { onHand: 0, reserved: 0 },
            availability: { status: "UNAVAILABLE", isSellable: false },
          },
        ],
      },
      {
        slug: "pochette-nocturne",
        name: "Pochette Nocturne",
        skuRoot: "POCHETTE-NOCT",
        marketingHook: "La pochette nette, utile et élégante, en format compact.",
        shortDescription:
          "Pochette artisanale compacte. Variantes simples par couleur et finition pour tester un produit variable léger.",
        descriptionHtml:
          "<p>Une pochette artisanale compacte, pensée pour glisser l’essentiel.</p>",
        pricing: {
          amount: "59.00",
        },
        categoryCodes: ["accessoires"],
        primaryCategoryCode: "accessoires",
        images: [
          {
            storageKey: "creatyss.webp",
            originalFilename: "creatyss.webp",
            mimeType: "image/webp",
            altText: "Pochette Nocturne — vue principale",
          },
        ],
        characteristics: [
          { label: "Matière", value: "Toile épaisse" },
          { label: "Fermeture", value: "Zip" },
          { label: "Entretien", value: "Nettoyage local" },
        ],
        seo: {
          metaTitle: "Pochette Nocturne | Creatyss",
          metaDescription:
            "Pochette artisanale compacte, finitions soignées. Déclinaisons par couleur et finition.",
        },
        variants: [
          {
            sku: "POCHETTE-NOCT-NOIR-GRAINE",
            slug: "noir-graine",
            name: "Noir · Grainé",
            status: "ACTIVE",
            sortOrder: 0,
            isDefault: true,
            optionValues: { color: "noir", finish: "graine" },
            primaryImageStorageKey: "creatyss.webp",
            inventory: { onHand: 9, reserved: 0 },
            availability: { status: "AVAILABLE", isSellable: true },
          },
          {
            sku: "POCHETTE-NOCT-MIEL-LISSE",
            slug: "miel-lisse",
            name: "Miel · Lisse",
            status: "DRAFT",
            sortOrder: 1,
            isDefault: false,
            optionValues: { color: "miel", finish: "lisse" },
            primaryImageStorageKey: "savoir-faire-placeholder.webp",
            inventory: { onHand: 0, reserved: 0 },
            availability: { status: "UNAVAILABLE", isSellable: false },
          },
        ],
      },
    ];

    const createdProductIds: Record<string, string> = {};
    for (const productSpec of products) {
      const { productId } = await seedProduct(prisma, {
        storeId: store.id,
        productTypeId: variableId,
        priceListId: priceList.id,
        optionValueIdsByCode,
        categoryIdByCode,
        spec: productSpec,
      });
      createdProductIds[productSpec.slug] = productId;
    }

    // Related products: editorial V1 links.
    const relatedPairs = [
      {
        source: "cabas-atelier",
        target: "bandouliere-rivoli",
        type: "CROSS_SELL",
        sortOrder: 0,
      },
      {
        source: "bandouliere-rivoli",
        target: "pochette-nocturne",
        type: "ACCESSORY",
        sortOrder: 0,
      },
      {
        source: "mini-sac-clarte",
        target: "bandouliere-rivoli",
        type: "SIMILAR",
        sortOrder: 0,
      },
      {
        source: "cabas-atelier",
        target: "mini-sac-clarte",
        type: "UP_SELL",
        sortOrder: 0,
      },
    ] as const;

    for (const rel of relatedPairs) {
      const sourceProductId = createdProductIds[rel.source];
      const targetProductId = createdProductIds[rel.target];
      if (!sourceProductId || !targetProductId) continue;

      await prisma.relatedProduct.upsert({
        where: {
          sourceProductId_targetProductId_type: {
            sourceProductId,
            targetProductId,
            type: rel.type satisfies RelatedProductType,
          },
        },
        update: {
          sortOrder: rel.sortOrder,
        },
        create: {
          sourceProductId,
          targetProductId,
          type: rel.type satisfies RelatedProductType,
          sortOrder: rel.sortOrder,
        },
        select: { id: true },
      });
    }

    process.stdout.write(`Seed variable products completed: ${products.length} products.\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
