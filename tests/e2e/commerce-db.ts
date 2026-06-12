import { createScriptPrismaClient } from "../../scripts/helpers/prisma-client";

const prisma = createScriptPrismaClient();

const SMOKE_PRODUCT_SLUG = "e2e-commerce-smoke-product";
const SMOKE_PRODUCT_NAME = "Produit Smoke E2E";
const SMOKE_VARIANT_SKU = "E2E-SMOKE-001";
const SMOKE_VARIANT_NAME = "Version smoke E2E";
const SMOKE_SHIPPING_ZONE_CODE = "E2E-FR";
const SMOKE_SHIPPING_METHOD_CODE = "E2E-STANDARD";
const SMOKE_SHIPPING_METHOD_NAME = "Livraison standard E2E";

const LOW_STOCK_PRODUCT_SLUG = "e2e-commerce-low-stock-product";
const LOW_STOCK_PRODUCT_NAME = "Produit Stock Limité E2E";
const LOW_STOCK_VARIANT_SKU = "E2E-LOWSTOCK-001";
const LOW_STOCK_VARIANT_NAME = "Version stock limité E2E";

type CommerceSmokeFixture = {
  productSlug: string;
  productName: string;
  variantName: string;
  variantSku: string;
  shippingMethodName: string;
};

type CommerceLowStockFixture = {
  productSlug: string;
  productName: string;
  variantSku: string;
  availableQuantity: number;
};

function assertValidOrderReference(reference: string): void {
  if (!/^CRY-[A-Z0-9]{10}$/.test(reference)) {
    throw new Error(`Invalid order reference: ${reference}`);
  }
}

async function readDefaultStore(): Promise<{ id: string }> {
  const store = await prisma.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (store === null) {
    throw new Error("No store available for E2E setup.");
  }

  return store;
}

export async function ensureCommerceSmokeFixture(): Promise<CommerceSmokeFixture> {
  const store = await readDefaultStore();
  const now = new Date();

  await prisma.store.update({
    where: { id: store.id },
    data: {
      status: "ACTIVE",
      bankTransferEnabled: true,
      bankTransferInstructions:
        "Virement de validation E2E. Paiement confirmé manuellement après réception.",
      archivedAt: null,
    },
  });

  const zone = await prisma.shippingZone.upsert({
    where: {
      storeId_code: {
        storeId: store.id,
        code: SMOKE_SHIPPING_ZONE_CODE,
      },
    },
    update: {
      name: "France E2E",
      status: "ACTIVE",
      archivedAt: null,
      sortOrder: 0,
    },
    create: {
      storeId: store.id,
      code: SMOKE_SHIPPING_ZONE_CODE,
      name: "France E2E",
      status: "ACTIVE",
      sortOrder: 0,
    },
    select: { id: true },
  });

  await prisma.shippingMethod.upsert({
    where: {
      storeId_code: {
        storeId: store.id,
        code: SMOKE_SHIPPING_METHOD_CODE,
      },
    },
    update: {
      shippingZoneId: zone.id,
      name: SMOKE_SHIPPING_METHOD_NAME,
      status: "ACTIVE",
      amount: 7,
      currencyCode: "EUR",
      isDefault: true,
      sortOrder: 0,
      minSubtotalAmount: null,
      maxSubtotalAmount: null,
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      shippingZoneId: zone.id,
      code: SMOKE_SHIPPING_METHOD_CODE,
      name: SMOKE_SHIPPING_METHOD_NAME,
      status: "ACTIVE",
      amount: 7,
      currencyCode: "EUR",
      isDefault: true,
      sortOrder: 0,
    },
  });

  const product = await prisma.product.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: SMOKE_PRODUCT_SLUG,
      },
    },
    update: {
      name: SMOKE_PRODUCT_NAME,
      status: "ACTIVE",
      isStandalone: true,
      catalogPriceCents: 4900,
      catalogPriceCurrencyCode: "EUR",
      publishedAt: now,
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      slug: SMOKE_PRODUCT_SLUG,
      name: SMOKE_PRODUCT_NAME,
      status: "ACTIVE",
      isStandalone: true,
      catalogPriceCents: 4900,
      catalogPriceCurrencyCode: "EUR",
      publishedAt: now,
    },
    select: { id: true },
  });

  const variant = await prisma.productVariant.upsert({
    where: {
      productId_sku: {
        productId: product.id,
        sku: SMOKE_VARIANT_SKU,
      },
    },
    update: {
      name: SMOKE_VARIANT_NAME,
      status: "ACTIVE",
      isDefault: true,
      sortOrder: 0,
      archivedAt: null,
      publishedAt: now,
    },
    create: {
      productId: product.id,
      sku: SMOKE_VARIANT_SKU,
      name: SMOKE_VARIANT_NAME,
      status: "ACTIVE",
      isDefault: true,
      sortOrder: 0,
      publishedAt: now,
    },
    select: { id: true },
  });

  await prisma.inventoryItem.upsert({
    where: {
      storeId_variantId: {
        storeId: store.id,
        variantId: variant.id,
      },
    },
    update: {
      sku: SMOKE_VARIANT_SKU,
      status: "ACTIVE",
      onHandQuantity: 12,
      reservedQuantity: 0,
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      variantId: variant.id,
      sku: SMOKE_VARIANT_SKU,
      status: "ACTIVE",
      onHandQuantity: 12,
      reservedQuantity: 0,
    },
  });

  await prisma.availabilityRecord.upsert({
    where: {
      storeId_variantId: {
        storeId: store.id,
        variantId: variant.id,
      },
    },
    update: {
      status: "AVAILABLE",
      isSellable: true,
      backorderAllowed: false,
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      variantId: variant.id,
      status: "AVAILABLE",
      isSellable: true,
      backorderAllowed: false,
    },
  });

  return {
    productSlug: SMOKE_PRODUCT_SLUG,
    productName: SMOKE_PRODUCT_NAME,
    variantName: SMOKE_VARIANT_NAME,
    variantSku: SMOKE_VARIANT_SKU,
    shippingMethodName: SMOKE_SHIPPING_METHOD_NAME,
  };
}

/**
 * Produit vendable en apparence (ACTIVE, sellable, « En stock ») mais avec un
 * stock disponible volontairement limité à 1 unité, pour exercer le refus
 * `cart_error=insufficient_stock` de l'action d'ajout au panier.
 */
export async function ensureCommerceLowStockFixture(): Promise<CommerceLowStockFixture> {
  const store = await readDefaultStore();
  const now = new Date();
  const availableQuantity = 1;

  const product = await prisma.product.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: LOW_STOCK_PRODUCT_SLUG,
      },
    },
    update: {
      name: LOW_STOCK_PRODUCT_NAME,
      status: "ACTIVE",
      isStandalone: true,
      catalogPriceCents: 3900,
      catalogPriceCurrencyCode: "EUR",
      publishedAt: now,
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      slug: LOW_STOCK_PRODUCT_SLUG,
      name: LOW_STOCK_PRODUCT_NAME,
      status: "ACTIVE",
      isStandalone: true,
      catalogPriceCents: 3900,
      catalogPriceCurrencyCode: "EUR",
      publishedAt: now,
    },
    select: { id: true },
  });

  const variant = await prisma.productVariant.upsert({
    where: {
      productId_sku: {
        productId: product.id,
        sku: LOW_STOCK_VARIANT_SKU,
      },
    },
    update: {
      name: LOW_STOCK_VARIANT_NAME,
      status: "ACTIVE",
      isDefault: true,
      sortOrder: 0,
      archivedAt: null,
      publishedAt: now,
    },
    create: {
      productId: product.id,
      sku: LOW_STOCK_VARIANT_SKU,
      name: LOW_STOCK_VARIANT_NAME,
      status: "ACTIVE",
      isDefault: true,
      sortOrder: 0,
      publishedAt: now,
    },
    select: { id: true },
  });

  await prisma.inventoryItem.upsert({
    where: {
      storeId_variantId: {
        storeId: store.id,
        variantId: variant.id,
      },
    },
    update: {
      sku: LOW_STOCK_VARIANT_SKU,
      status: "ACTIVE",
      onHandQuantity: availableQuantity,
      reservedQuantity: 0,
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      variantId: variant.id,
      sku: LOW_STOCK_VARIANT_SKU,
      status: "ACTIVE",
      onHandQuantity: availableQuantity,
      reservedQuantity: 0,
    },
  });

  await prisma.availabilityRecord.upsert({
    where: {
      storeId_variantId: {
        storeId: store.id,
        variantId: variant.id,
      },
    },
    update: {
      status: "AVAILABLE",
      isSellable: true,
      backorderAllowed: false,
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      variantId: variant.id,
      status: "AVAILABLE",
      isSellable: true,
      backorderAllowed: false,
    },
  });

  return {
    productSlug: LOW_STOCK_PRODUCT_SLUG,
    productName: LOW_STOCK_PRODUCT_NAME,
    variantSku: LOW_STOCK_VARIANT_SKU,
    availableQuantity,
  };
}

export async function markOrderAsPaid(reference: string): Promise<void> {
  assertValidOrderReference(reference);

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { orderNumber: reference },
      select: { id: true },
    });

    if (order === null) {
      throw new Error(`Order not found for reference: ${reference}`);
    }

    const payment = await tx.payment.findFirst({
      where: { orderId: order.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, amountAuthorized: true },
    });

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "CONFIRMED",
        statusHistory: {
          create: {
            status: "CONFIRMED",
            reasonCode: "e2e_mark_paid",
            notes: "Marked as paid by E2E helper.",
          },
        },
      },
    });

    if (payment !== null) {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "CAPTURED",
          amountCaptured: payment.amountAuthorized ?? null,
          capturedAt: new Date(),
        },
      });
    }
  });
}

export async function resetSimpleProductCatalogState(): Promise<void> {
  const now = new Date();
  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: ["pochette-sable", "besace-nuit"],
      },
    },
    select: {
      id: true,
      slug: true,
      storeId: true,
      variants: {
        orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
        select: { id: true, sku: true },
      },
    },
  });

  for (const product of products) {
    const defaultVariant = product.variants[0] ?? null;
    const availableQuantity = product.slug === "pochette-sable" ? 12 : 0;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        status: "ACTIVE",
        isStandalone: true,
        publishedAt: now,
        archivedAt: null,
      },
    });

    if (defaultVariant === null) {
      continue;
    }

    await prisma.productVariant.update({
      where: { id: defaultVariant.id },
      data: {
        status: "ACTIVE",
        isDefault: true,
        publishedAt: now,
        archivedAt: null,
      },
    });

    await prisma.inventoryItem.upsert({
      where: {
        storeId_variantId: {
          storeId: product.storeId,
          variantId: defaultVariant.id,
        },
      },
      update: {
        sku: defaultVariant.sku,
        status: "ACTIVE",
        onHandQuantity: availableQuantity,
        reservedQuantity: 0,
        archivedAt: null,
      },
      create: {
        storeId: product.storeId,
        variantId: defaultVariant.id,
        sku: defaultVariant.sku,
        status: "ACTIVE",
        onHandQuantity: availableQuantity,
        reservedQuantity: 0,
      },
    });

    await prisma.availabilityRecord.upsert({
      where: {
        storeId_variantId: {
          storeId: product.storeId,
          variantId: defaultVariant.id,
        },
      },
      update: {
        status: availableQuantity > 0 ? "AVAILABLE" : "UNAVAILABLE",
        isSellable: availableQuantity > 0,
        backorderAllowed: false,
        archivedAt: null,
      },
      create: {
        storeId: product.storeId,
        variantId: defaultVariant.id,
        status: availableQuantity > 0 ? "AVAILABLE" : "UNAVAILABLE",
        isSellable: availableQuantity > 0,
        backorderAllowed: false,
      },
    });
  }
}
