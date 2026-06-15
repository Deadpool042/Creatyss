// Consolidated: update-product-availability, update-product-categories,
// update-product-characteristics, update-product-general, update-product-inventory,
// update-product-option-color-hex, update-product-prices, update-product-related-products,
// update-product-seo

import type {
  ProductAvailabilityStatus,
  ProductLifecycleStatus,
  ValidatedAdminProductCharacteristicInput,
} from "@/entities/product";
import { type SeoIndexingMode } from "@/entities/seo";
import { InventoryItemStatus } from "@/prisma-generated/client";
import { withTransaction, type DbExecutor } from "@/core/db";
import { recomputeProductCatalogPriceSnapshot } from "@/features/catalog/shared";

import {
  AdminProductEditorServiceError,
  assertCategoriesExist,
  assertProductExists,
  assertProductTypeExists,
  assertRelatedProductsExist,
  mapEditorAvailabilityStatusToPrismaStatus,
  mapEditorRelatedTypeToPrismaType,
  mapEditorStatusToPrismaStatus,
} from "./shared";

// ---------------------------------------------------------------------------
// updateProductAvailability
// ---------------------------------------------------------------------------

type UpdateProductAvailabilityRowInput = {
  variantId: string;
  status: ProductAvailabilityStatus;
  isSellable: boolean;
  backorderAllowed: boolean;
  sellableFrom: Date | null;
  sellableUntil: Date | null;
  preorderStartsAt: Date | null;
  preorderEndsAt: Date | null;
};

type UpdateProductAvailabilityServiceInput = {
  productId: string;
  rows: readonly UpdateProductAvailabilityRowInput[];
};

export async function updateProductAvailability(
  input: UpdateProductAvailabilityServiceInput
): Promise<{ productId: string }> {
  return withTransaction(async (tx) => {
    const product = await assertProductExists(tx, input.productId);

    const variantIds = Array.from(new Set(input.rows.map((row) => row.variantId)));

    const variants = await tx.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
        productId: input.productId,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (variants.length !== variantIds.length) {
      throw new AdminProductEditorServiceError("variant_missing");
    }

    for (const row of input.rows) {
      const effectiveIsSellable =
        row.status === "unavailable" || row.status === "discontinued" || row.status === "archived"
          ? false
          : row.isSellable;

      await tx.availabilityRecord.upsert({
        where: {
          storeId_variantId: {
            storeId: product.storeId,
            variantId: row.variantId,
          },
        },
        update: {
          status: mapEditorAvailabilityStatusToPrismaStatus(row.status),
          isSellable: effectiveIsSellable,
          backorderAllowed: row.backorderAllowed,
          sellableFrom: row.sellableFrom,
          sellableUntil: row.sellableUntil,
          preorderStartsAt: row.preorderStartsAt,
          preorderEndsAt: row.preorderEndsAt,
          archivedAt: null,
        },
        create: {
          storeId: product.storeId,
          variantId: row.variantId,
          status: mapEditorAvailabilityStatusToPrismaStatus(row.status),
          isSellable: effectiveIsSellable,
          backorderAllowed: row.backorderAllowed,
          sellableFrom: row.sellableFrom,
          sellableUntil: row.sellableUntil,
          preorderStartsAt: row.preorderStartsAt,
          preorderEndsAt: row.preorderEndsAt,
        },
      });
    }

    return { productId: input.productId };
  });
}

// ---------------------------------------------------------------------------
// updateProductCategories
// ---------------------------------------------------------------------------

type CategoryLinkInput = {
  categoryId: string;
  isPrimary: boolean;
  sortOrder: number;
};

type UpdateProductCategoriesServiceInput = {
  productId: string;
  links: readonly CategoryLinkInput[];
};

export async function updateProductCategories(
  input: UpdateProductCategoriesServiceInput
): Promise<{ productId: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);
    await assertCategoriesExist(
      tx,
      input.links.map((link) => link.categoryId)
    );

    await tx.productCategory.deleteMany({
      where: {
        productId: input.productId,
      },
    });

    if (input.links.length > 0) {
      await tx.productCategory.createMany({
        data: input.links.map((link) => ({
          productId: input.productId,
          categoryId: link.categoryId,
          isPrimary: link.isPrimary,
          sortOrder: link.sortOrder,
        })),
      });
    }

    return {
      productId: input.productId,
    };
  });
}

// ---------------------------------------------------------------------------
// updateProductCharacteristics
// ---------------------------------------------------------------------------

type UpdateProductCharacteristicsServiceInput = {
  productId: string;
  characteristics: readonly ValidatedAdminProductCharacteristicInput[];
};

export async function updateProductCharacteristics(
  input: UpdateProductCharacteristicsServiceInput
): Promise<void> {
  await withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    // Replace strategy: delete all existing, then create all incoming.
    await tx.productCharacteristic.deleteMany({
      where: { productId: input.productId },
    });

    if (input.characteristics.length > 0) {
      await tx.productCharacteristic.createMany({
        data: input.characteristics.map((c, i) => ({
          productId: input.productId,
          label: c.label.trim(),
          value: c.value.trim(),
          sortOrder: c.sortOrder ?? i,
        })),
      });
    }
  });
}

// ---------------------------------------------------------------------------
// updateProductGeneral
// ---------------------------------------------------------------------------

type UpdateProductGeneralServiceInput = {
  productId: string;
  name: string;
  slug: string;
  skuRoot: string | null;
  marketingHook: string | null;
  shortDescription: string | null;
  description: string | null;
  careInstructions: string | null;
  status: ProductLifecycleStatus;
  isFeatured: boolean;
  productTypeId: string | null;
};

function mapProductTypeCodeToIsStandalone(code: string): boolean | null {
  if (code === "simple") return true;
  if (code === "variable") return false;
  return null;
}

export async function updateProductGeneral(
  input: UpdateProductGeneralServiceInput
): Promise<{ id: string; wasConvertedToVariable: boolean }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    const currentProduct = await tx.product.findFirst({
      where: {
        id: input.productId,
        archivedAt: null,
      },
      select: {
        isStandalone: true,
        publishedAt: true,
        productType: {
          select: {
            code: true,
          },
        },
      },
    });

    if (currentProduct === null) {
      throw new AdminProductEditorServiceError("product_missing");
    }

    let resolvedIsStandalone = currentProduct.isStandalone;

    if (input.productTypeId !== null) {
      await assertProductTypeExists(tx, input.productTypeId);

      const selectedType = await tx.productType.findFirst({
        where: {
          id: input.productTypeId,
          archivedAt: null,
        },
        select: {
          code: true,
        },
      });

      if (selectedType !== null) {
        const computed = mapProductTypeCodeToIsStandalone(selectedType.code);

        if (computed !== null) {
          resolvedIsStandalone = computed;
        }
      }
    } else {
      const currentTypeCode = currentProduct.productType?.code ?? null;
      const computed = currentTypeCode ? mapProductTypeCodeToIsStandalone(currentTypeCode) : null;

      if (computed !== null) {
        resolvedIsStandalone = computed;
      }
    }

    if (!currentProduct.isStandalone && resolvedIsStandalone) {
      const activeVariantCount = await tx.productVariant.count({
        where: {
          productId: input.productId,
          archivedAt: null,
        },
      });

      if (activeVariantCount > 1) {
        throw new AdminProductEditorServiceError("product_has_multiple_variants");
      }
    }

    const wasConvertedToVariable = currentProduct.isStandalone && !resolvedIsStandalone;

    if (resolvedIsStandalone) {
      const skuRoot = input.skuRoot?.trim() ?? "";
      if (skuRoot.length === 0) {
        throw new AdminProductEditorServiceError("missing_product_sku_root");
      }
    }

    try {
      const updated = await tx.product.update({
        where: {
          id: input.productId,
        },
        data: {
          name: input.name,
          slug: input.slug,
          skuRoot: input.skuRoot?.trim() ?? null,
          marketingHook: input.marketingHook,
          shortDescription: input.shortDescription,
          description: input.description,
          careInstructions: input.careInstructions,
          status: mapEditorStatusToPrismaStatus(input.status),
          isFeatured: input.isFeatured,
          isStandalone: resolvedIsStandalone,
          productTypeId: input.productTypeId,
          publishedAt:
            input.status === "active" && currentProduct.publishedAt === null
              ? new Date()
              : currentProduct.publishedAt,
        },
        select: {
          id: true,
        },
      });

      return { id: updated.id, wasConvertedToVariable };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "update_failed";
      throw new AdminProductEditorServiceError("product_missing", message);
    }
  });
}

// ---------------------------------------------------------------------------
// updateProductInventory
// ---------------------------------------------------------------------------

type UpdateProductInventoryRowInput = {
  variantId: string;
  onHandQuantity: number;
  lowStockThreshold?: number | null;
};

type UpdateProductInventoryServiceInput = {
  productId: string;
  rows: readonly UpdateProductInventoryRowInput[];
};

export async function updateProductInventory(
  input: UpdateProductInventoryServiceInput
): Promise<{ productId: string }> {
  return withTransaction(async (tx) => {
    const product = await assertProductExists(tx, input.productId);
    const uniqueVariantIds = Array.from(new Set(input.rows.map((row) => row.variantId)));

    const variants = await tx.productVariant.findMany({
      where: {
        id: {
          in: uniqueVariantIds,
        },
        productId: input.productId,
        archivedAt: null,
      },
      select: {
        id: true,
        sku: true,
      },
    });

    if (variants.length !== uniqueVariantIds.length) {
      throw new AdminProductEditorServiceError("variant_missing");
    }

    const skuByVariantId = new Map(variants.map((variant) => [variant.id, variant.sku]));

    for (const row of input.rows) {
      if (row.onHandQuantity < 0) {
        throw new AdminProductEditorServiceError("inventory_invalid");
      }

      const sku = skuByVariantId.get(row.variantId);

      if (typeof sku !== "string" || sku.length === 0) {
        throw new AdminProductEditorServiceError("variant_missing");
      }

      await tx.inventoryItem.upsert({
        where: {
          storeId_variantId: {
            storeId: product.storeId,
            variantId: row.variantId,
          },
        },
        update: {
          sku,
          status: InventoryItemStatus.ACTIVE,
          archivedAt: null,
          onHandQuantity: row.onHandQuantity,
          ...(row.lowStockThreshold !== undefined
            ? { lowStockThreshold: row.lowStockThreshold }
            : {}),
        },
        create: {
          storeId: product.storeId,
          variantId: row.variantId,
          sku,
          status: InventoryItemStatus.ACTIVE,
          onHandQuantity: row.onHandQuantity,
          lowStockThreshold: row.lowStockThreshold ?? null,
        },
      });
    }

    return { productId: input.productId };
  });
}

// ---------------------------------------------------------------------------
// updateProductOptionColorHex (+ createProductOptionColorValue + archiveProductOptionColorValue)
// ---------------------------------------------------------------------------

type ProductTypeScope = {
  productTypeId: string;
};

async function assertProductTypeScope(
  executor: DbExecutor,
  productId: string
): Promise<ProductTypeScope> {
  const product = await executor.product.findFirst({
    where: {
      id: productId,
      archivedAt: null,
    },
    select: {
      productTypeId: true,
    },
  });

  if (!product?.productTypeId) {
    throw new AdminProductEditorServiceError("option_values_invalid");
  }

  return {
    productTypeId: product.productTypeId,
  };
}

function normalizeLabelToValue(label: string): string {
  return label.trim();
}

function normalizeLabelToCode(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

type UpdateProductOptionColorHexServiceInput = {
  productId: string;
  optionValueId: string;
  label: string;
  colorHex: string | null;
};

export async function updateProductOptionColorHex(
  input: UpdateProductOptionColorHexServiceInput
): Promise<{ optionValueId: string }> {
  return withTransaction(async (tx) => {
    const { productTypeId } = await assertProductTypeScope(tx, input.productId);

    const optionValue = await tx.productOptionValue.findFirst({
      where: {
        id: input.optionValueId,
        archivedAt: null,
        isActive: true,
        option: {
          productTypeId,
          isVariantAxis: true,
          isActive: true,
          archivedAt: null,
        },
      },
      select: {
        id: true,
        optionId: true,
      },
    });

    if (optionValue === null) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }

    const label = input.label.trim();
    if (label.length === 0) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }

    const labelValue = normalizeLabelToValue(label);
    const conflict = await tx.productOptionValue.findFirst({
      where: {
        optionId: optionValue.optionId,
        id: {
          not: optionValue.id,
        },
        archivedAt: null,
        isActive: true,
        OR: [{ value: labelValue }, { label: labelValue }],
      },
      select: {
        id: true,
      },
    });

    if (conflict !== null) {
      throw new AdminProductEditorServiceError("option_value_label_taken");
    }

    await tx.productOptionValue.update({
      where: { id: optionValue.id },
      data: {
        value: labelValue,
        label: labelValue,
        colorHex: input.colorHex,
      },
      select: {
        id: true,
      },
    });

    return {
      optionValueId: optionValue.id,
    };
  });
}

type CreateProductOptionColorValueServiceInput = {
  productId: string;
  optionId: string;
  label: string;
  colorHex: string | null;
};

export async function createProductOptionColorValue(
  input: CreateProductOptionColorValueServiceInput
): Promise<{ optionValueId: string }> {
  return withTransaction(async (tx) => {
    const { productTypeId } = await assertProductTypeScope(tx, input.productId);

    const option = await tx.productOption.findFirst({
      where: {
        id: input.optionId,
        productTypeId,
        isVariantAxis: true,
        isActive: true,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (option === null) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }

    const label = input.label.trim();
    if (label.length === 0) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }

    const value = normalizeLabelToValue(label);
    const existingLabel = await tx.productOptionValue.findFirst({
      where: {
        optionId: option.id,
        archivedAt: null,
        isActive: true,
        OR: [{ value }, { label: value }],
      },
      select: {
        id: true,
      },
    });

    if (existingLabel !== null) {
      throw new AdminProductEditorServiceError("option_value_label_taken");
    }

    const baseCode = normalizeLabelToCode(label) || "color";
    let code = baseCode;
    let attempt = 1;
    while (true) {
      const existingCode = await tx.productOptionValue.findFirst({
        where: {
          optionId: option.id,
          code,
        },
        select: {
          id: true,
        },
      });
      if (existingCode === null) {
        break;
      }
      attempt += 1;
      code = `${baseCode}-${attempt}`;
    }

    const created = await tx.productOptionValue.create({
      data: {
        optionId: option.id,
        code,
        value,
        label: value,
        colorHex: input.colorHex,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    return {
      optionValueId: created.id,
    };
  });
}

type ArchiveProductOptionColorValueServiceInput = {
  productId: string;
  optionValueId: string;
};

export async function archiveProductOptionColorValue(
  input: ArchiveProductOptionColorValueServiceInput
): Promise<{ optionValueId: string }> {
  return withTransaction(async (tx) => {
    const { productTypeId } = await assertProductTypeScope(tx, input.productId);

    const optionValue = await tx.productOptionValue.findFirst({
      where: {
        id: input.optionValueId,
        archivedAt: null,
        isActive: true,
        option: {
          productTypeId,
          isVariantAxis: true,
          isActive: true,
          archivedAt: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (optionValue === null) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }

    const linksCount = await tx.productVariantOptionValue.count({
      where: {
        optionValueId: optionValue.id,
        variant: {
          archivedAt: null,
        },
      },
    });

    if (linksCount > 0) {
      throw new AdminProductEditorServiceError("option_value_in_use");
    }

    await tx.productOptionValue.update({
      where: { id: optionValue.id },
      data: {
        isActive: false,
        archivedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    return {
      optionValueId: optionValue.id,
    };
  });
}

// ---------------------------------------------------------------------------
// updateProductPrices
// ---------------------------------------------------------------------------

type PriceUpsertEntry = {
  priceListId: string;
  amount: number;
  compareAtAmount: number | null;
  costAmount: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

type UpdateProductPricesServiceInput = {
  productId: string;
  prices: PriceUpsertEntry[];
  toArchive: string[];
};

export async function updateProductPrices(
  input: UpdateProductPricesServiceInput
): Promise<void> {
  await withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    for (const entry of input.prices) {
      const priceListExists = await tx.priceList.findFirst({
        where: { id: entry.priceListId, archivedAt: null },
        select: { id: true },
      });

      if (priceListExists === null) {
        throw new AdminProductEditorServiceError(
          "product_missing",
          `price_list_missing:${entry.priceListId}`
        );
      }

      const costAmount =
        entry.costAmount !== null && entry.costAmount.trim().length > 0
          ? parseFloat(entry.costAmount)
          : null;
      const safeCostAmount =
        costAmount !== null && Number.isFinite(costAmount) ? costAmount : null;

      await tx.productPrice.upsert({
        where: {
          productId_priceListId: {
            productId: input.productId,
            priceListId: entry.priceListId,
          },
        },
        create: {
          productId: input.productId,
          priceListId: entry.priceListId,
          amount: entry.amount,
          compareAtAmount: entry.compareAtAmount,
          costAmount: safeCostAmount,
          startsAt: entry.startsAt ? new Date(entry.startsAt) : null,
          endsAt: entry.endsAt ? new Date(entry.endsAt) : null,
        },
        update: {
          amount: entry.amount,
          compareAtAmount: entry.compareAtAmount,
          costAmount: safeCostAmount,
          startsAt: entry.startsAt ? new Date(entry.startsAt) : null,
          endsAt: entry.endsAt ? new Date(entry.endsAt) : null,
          archivedAt: null,
        },
      });
    }

    if (input.toArchive.length > 0) {
      await tx.productPrice.updateMany({
        where: {
          productId: input.productId,
          priceListId: { in: input.toArchive },
          archivedAt: null,
        },
        data: { archivedAt: new Date() },
      });
    }

    await recomputeProductCatalogPriceSnapshot(tx, input.productId);
  });
}

// ---------------------------------------------------------------------------
// updateProductRelatedProducts
// ---------------------------------------------------------------------------

type RelatedProductInput = {
  targetProductId: string;
  type: "related" | "cross_sell" | "up_sell" | "accessory" | "similar";
  sortOrder: number;
};

type UpdateProductRelatedProductsServiceInput = {
  productId: string;
  relatedProducts: readonly RelatedProductInput[];
};

export async function updateProductRelatedProducts(
  input: UpdateProductRelatedProductsServiceInput
): Promise<{ productId: string }> {
  return withTransaction(async (tx) => {
    const product = await assertProductExists(tx, input.productId);
    await assertRelatedProductsExist(
      tx,
      input.productId,
      product.storeId,
      input.relatedProducts.map((item) => item.targetProductId)
    );

    await tx.relatedProduct.deleteMany({
      where: {
        sourceProductId: input.productId,
      },
    });

    if (input.relatedProducts.length > 0) {
      await tx.relatedProduct.createMany({
        data: input.relatedProducts.map((item) => ({
          sourceProductId: input.productId,
          targetProductId: item.targetProductId,
          type: mapEditorRelatedTypeToPrismaType(item.type),
          sortOrder: item.sortOrder,
        })),
      });
    }

    return {
      productId: input.productId,
    };
  });
}

// ---------------------------------------------------------------------------
// updateProductSeo
// ---------------------------------------------------------------------------

type UpdateProductSeoServiceInput = {
  productId: string;
  title: string;
  description: string;
  canonicalPath: string | null;
  indexingMode: SeoIndexingMode;
  sitemapIncluded: boolean;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageId: string | null;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageId: string | null;
};

async function assertSeoImageAssetIsUsable(input: {
  executor: DbExecutor;
  storeId: string;
  assetId: string;
}): Promise<void> {
  const asset = await input.executor.mediaAsset.findFirst({
    where: {
      id: input.assetId,
      storeId: input.storeId,
      archivedAt: null,
      kind: "IMAGE",
      status: {
        not: "ARCHIVED",
      },
      mimeType: {
        startsWith: "image/",
      },
    },
    select: {
      id: true,
    },
  });

  if (asset === null) {
    throw new AdminProductEditorServiceError("media_asset_missing");
  }
}

export async function updateProductSeo(
  input: UpdateProductSeoServiceInput
): Promise<{ productId: string }> {
  return withTransaction(async (tx) => {
    const product = await assertProductExists(tx, input.productId);

    const toNullable = (value: string) => (value.trim().length === 0 ? null : value.trim());

    if (input.openGraphImageId !== null) {
      await assertSeoImageAssetIsUsable({
        executor: tx,
        storeId: product.storeId,
        assetId: input.openGraphImageId,
      });
    }

    if (input.twitterImageId !== null && input.twitterImageId !== input.openGraphImageId) {
      await assertSeoImageAssetIsUsable({
        executor: tx,
        storeId: product.storeId,
        assetId: input.twitterImageId,
      });
    }

    await tx.seoMetadata.upsert({
      where: {
        storeId_subjectType_subjectId: {
          storeId: product.storeId,
          subjectType: "PRODUCT",
          subjectId: input.productId,
        },
      },
      update: {
        metaTitle: toNullable(input.title),
        metaDescription: toNullable(input.description),
        canonicalPath: input.canonicalPath,
        indexingMode: input.indexingMode,
        sitemapIncluded: input.sitemapIncluded,
        openGraphTitle: toNullable(input.openGraphTitle),
        openGraphDescription: toNullable(input.openGraphDescription),
        openGraphImageId: input.openGraphImageId,
        twitterTitle: toNullable(input.twitterTitle),
        twitterDescription: toNullable(input.twitterDescription),
        twitterImageId: input.twitterImageId,
      },
      create: {
        storeId: product.storeId,
        subjectType: "PRODUCT",
        subjectId: input.productId,
        metaTitle: toNullable(input.title),
        metaDescription: toNullable(input.description),
        canonicalPath: input.canonicalPath,
        indexingMode: input.indexingMode,
        sitemapIncluded: input.sitemapIncluded,
        openGraphTitle: toNullable(input.openGraphTitle),
        openGraphDescription: toNullable(input.openGraphDescription),
        openGraphImageId: input.openGraphImageId,
        twitterTitle: toNullable(input.twitterTitle),
        twitterDescription: toNullable(input.twitterDescription),
        twitterImageId: input.twitterImageId,
      },
    });

    return { productId: input.productId };
  });
}
