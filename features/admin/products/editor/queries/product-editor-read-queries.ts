import "server-only";

import { db } from "@/core/db";
import type {
  AdminPriceListOption,
  AdminProductEditorData,
  AdminProductImagesData,
  AdminProductPricingData,
  AdminPriceEntry,
  AdminVariantPriceEntry,
  AdminProductVariantEditorData,
} from "../types";
import type { AdminProductOptionItem } from "../types/product-variant.types";
import { getAdminProductEditorData } from "./get-admin-product-editor-data.query";

// ─── read-admin-price-lists ───────────────────────────────────────────────────

export async function readAdminPriceLists(): Promise<
  readonly AdminPriceListOption[]
> {
  const priceLists = await db.priceList.findMany({
    where: {
      archivedAt: null,
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      isDefault: true,
      currencyCode: true,
    },
  });

  return priceLists.map((priceList) => ({
    id: priceList.id,
    code: priceList.code,
    name: priceList.name,
    isDefault: priceList.isDefault,
    currencyCode: priceList.currencyCode,
  }));
}

// ─── read-admin-product-editor-by-slug ───────────────────────────────────────

export async function readAdminProductEditorBySlug(
  slug: string,
): Promise<AdminProductEditorData | null> {
  const product = await db.product.findFirst({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (product === null) {
    return null;
  }

  return getAdminProductEditorData({
    productId: product.id,
  });
}

// ─── read-admin-product-images ────────────────────────────────────────────────

export async function readAdminProductImages(
  productId: string,
): Promise<AdminProductImagesData | null> {
  const editorData = await getAdminProductEditorData({
    productId,
  });

  if (editorData === null) {
    return null;
  }

  return {
    productId: editorData.product.id,
    productSlug: editorData.product.slug,
    primaryImageId: editorData.product.primaryImageId,
    images: [...editorData.images],
  };
}

// ─── read-admin-product-prices ───────────────────────────────────────────────

type ReadAdminProductPricesInput = {
  productId: string;
};

export async function readAdminProductPrices(
  input: ReadAdminProductPricesInput,
): Promise<AdminProductPricingData> {
  const [productPricesRaw, variants] = await Promise.all([
    db.productPrice.findMany({
      where: { productId: input.productId, archivedAt: null },
      select: {
        id: true,
        priceListId: true,
        amount: true,
        compareAtAmount: true,
        costAmount: true,
        startsAt: true,
        endsAt: true,
      },
    }),
    db.productVariant.findMany({
      where: { productId: input.productId, archivedAt: null },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        sku: true,
        prices: {
          where: { archivedAt: null },
          select: {
            id: true,
            priceListId: true,
            amount: true,
            compareAtAmount: true,
            costAmount: true,
            startsAt: true,
            endsAt: true,
          },
        },
      },
    }),
  ]);

  const productPrices: AdminPriceEntry[] = productPricesRaw.map((p) => ({
    id: p.id,
    priceListId: p.priceListId,
    amount: p.amount.toString(),
    compareAtAmount: p.compareAtAmount?.toString() ?? null,
    costAmount: p.costAmount?.toString() ?? null,
    startsAt: p.startsAt ? p.startsAt.toISOString().split("T")[0]! : null,
    endsAt: p.endsAt ? p.endsAt.toISOString().split("T")[0]! : null,
  }));

  const variantPrices: AdminVariantPriceEntry[] = variants.map((v) => ({
    variantId: v.id,
    variantName: v.name,
    variantSku: v.sku,
    prices: v.prices.map((p) => ({
      id: p.id,
      priceListId: p.priceListId,
      amount: p.amount.toString(),
      compareAtAmount: p.compareAtAmount?.toString() ?? null,
      costAmount: p.costAmount?.toString() ?? null,
      startsAt: p.startsAt ? p.startsAt.toISOString().split("T")[0]! : null,
      endsAt: p.endsAt ? p.endsAt.toISOString().split("T")[0]! : null,
    })),
  }));

  return {
    productId: input.productId,
    productPrices,
    variantPrices,
  };
}

// ─── read-admin-product-type-with-options ─────────────────────────────────────

export async function readAdminProductTypeWithOptions(
  productTypeId: string,
): Promise<AdminProductOptionItem[]> {
  const options = await db.productOption.findMany({
    where: {
      productTypeId,
      isActive: true,
      archivedAt: null,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      sortOrder: true,
      isVariantAxis: true,
      values: {
        where: { isActive: true, archivedAt: null },
        orderBy: [{ sortOrder: "asc" }, { value: "asc" }],
        select: {
          id: true,
          code: true,
          value: true,
          label: true,
          colorHex: true,
          sortOrder: true,
        },
      },
    },
  });

  return options.map((opt) => ({
    id: opt.id,
    code: opt.code,
    name: opt.name,
    sortOrder: opt.sortOrder,
    isVariantAxis: opt.isVariantAxis,
    values: opt.values.map((v) => ({
      id: v.id,
      code: v.code,
      value: v.value,
      label: v.label,
      colorHex: v.colorHex,
      sortOrder: v.sortOrder,
    })),
  }));
}

// ─── read-admin-product-variants ─────────────────────────────────────────────

export async function readAdminProductVariants(
  productId: string,
): Promise<AdminProductVariantEditorData | null> {
  const editorData = await getAdminProductEditorData({
    productId,
  });

  if (editorData === null) {
    return null;
  }

  return {
    productId: editorData.product.id,
    productSlug: editorData.product.slug,
    variants: [...editorData.variants],
  };
}
