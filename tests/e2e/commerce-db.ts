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
  // Le préfixe est configurable via le réglage boutique `orderNumberPrefix`
  // (cf. docs/lots/2026-06-10-settings-orders-v1-reference.md) : on valide la
  // forme `PREFIX-XXXXXXXXXX` sans figer le préfixe (CRY, CMD, …).
  if (!/^[A-Z0-9]+-[A-Z0-9]{10}$/.test(reference)) {
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

type OrderCreatedEmailEvidence = {
  status: string;
  recipientEmail: string | null;
};

/**
 * Preuve « email cadré » : l'événement email `order_created` est enregistré
 * en DB (EmailMessage) avec le bon destinataire. Le statut n'est pas contraint
 * à SENT : l'email est non fatal et son envoi réel dépend du provider local.
 */
export async function readOrderCreatedEmailEvidence(
  reference: string
): Promise<OrderCreatedEmailEvidence | null> {
  assertValidOrderReference(reference);

  const order = await prisma.order.findFirst({
    where: { orderNumber: reference },
    select: { id: true },
  });

  if (order === null) {
    return null;
  }

  const message = await prisma.emailMessage.findFirst({
    where: {
      subjectType: "order",
      subjectId: order.id,
      subjectLine: "order_created",
    },
    include: {
      recipients: { where: { type: "TO" }, take: 1 },
    },
  });

  if (message === null) {
    return null;
  }

  return {
    status: message.status,
    recipientEmail: message.recipients[0]?.email ?? null,
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
  const store = await readDefaultStore();
  const now = new Date();

  const fixtures = [
    {
      slug: "pochette-sable",
      name: "Pochette Sable",
      sku: "E2E-POC-SABLE",
      priceCents: 5900,
      availableQuantity: 12,
    },
    {
      slug: "besace-nuit",
      name: "Besace Nuit",
      sku: "E2E-BES-NUIT",
      priceCents: 8900,
      availableQuantity: 0,
    },
  ] as const;

  for (const fixture of fixtures) {
    const product = await prisma.product.upsert({
      where: {
        storeId_slug: {
          storeId: store.id,
          slug: fixture.slug,
        },
      },
      update: {
        name: fixture.name,
        shortDescription: "Produit simple déterministe pour les tests E2E.",
        status: "ACTIVE",
        isStandalone: true,
        catalogPriceCents: fixture.priceCents,
        catalogPriceCurrencyCode: "EUR",
        publishedAt: now,
        archivedAt: null,
      },
      create: {
        storeId: store.id,
        slug: fixture.slug,
        name: fixture.name,
        shortDescription: "Produit simple déterministe pour les tests E2E.",
        status: "ACTIVE",
        isStandalone: true,
        catalogPriceCents: fixture.priceCents,
        catalogPriceCurrencyCode: "EUR",
        publishedAt: now,
      },
      select: {
        id: true,
      },
    });

    const variant = await prisma.productVariant.upsert({
      where: {
        productId_sku: {
          productId: product.id,
          sku: fixture.sku,
        },
      },
      update: {
        name: "Produit simple",
        status: "ACTIVE",
        isDefault: true,
        sortOrder: 0,
        publishedAt: now,
        archivedAt: null,
      },
      create: {
        productId: product.id,
        sku: fixture.sku,
        name: "Produit simple",
        status: "ACTIVE",
        isDefault: true,
        sortOrder: 0,
        publishedAt: now,
      },
      select: {
        id: true,
      },
    });

    await prisma.productVariant.updateMany({
      where: {
        productId: product.id,
        id: {
          not: variant.id,
        },
      },
      data: {
        isDefault: false,
      },
    });

    await prisma.inventoryItem.upsert({
      where: {
        storeId_variantId: {
          storeId: store.id,
          variantId: variant.id,
        },
      },
      update: {
        sku: fixture.sku,
        status: "ACTIVE",
        onHandQuantity: fixture.availableQuantity,
        reservedQuantity: 0,
        archivedAt: null,
      },
      create: {
        storeId: store.id,
        variantId: variant.id,
        sku: fixture.sku,
        status: "ACTIVE",
        onHandQuantity: fixture.availableQuantity,
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
        status: fixture.availableQuantity > 0 ? "AVAILABLE" : "UNAVAILABLE",
        isSellable: fixture.availableQuantity > 0,
        backorderAllowed: false,
        archivedAt: null,
      },
      create: {
        storeId: store.id,
        variantId: variant.id,
        status: fixture.availableQuantity > 0 ? "AVAILABLE" : "UNAVAILABLE",
        isSellable: fixture.availableQuantity > 0,
        backorderAllowed: false,
      },
    });
  }
}

const BOUTIQUE_FIXTURE_PRODUCT_COUNT = 13;

const BOUTIQUE_FIXTURE_CATEGORY_CODES = [
  "mini-sacs",
  "cabas",
  "pochettes",
  "trousses",
] as const;

export type BoutiquePageFixture = Readonly<{
  countsByUrl: Readonly<Record<string, number>>;
}>;

/**
 * Catalogue public E2E minimal et idempotent.
 *
 * Il garantit une pagination sur `/boutique` sans dépendre de l'import Woo
 * local, tout en réutilisant la taxonomie canonique Creatyss.
 */
export async function ensureBoutiquePageFixture(): Promise<BoutiquePageFixture> {
  const { seedCreatyssCategories } = await import(
    "../../scripts/helpers/category-seed"
  );

  await seedCreatyssCategories(prisma);

  const store = await readDefaultStore();
  const now = new Date();

  const categories = await prisma.category.findMany({
    where: {
      storeId: store.id,
      code: {
        in: [...BOUTIQUE_FIXTURE_CATEGORY_CODES],
      },
    },
    select: {
      id: true,
      code: true,
    },
  });

  const categoryIdByCode = new Map(
    categories.map((category) => [category.code, category.id] as const)
  );

  for (const categoryCode of BOUTIQUE_FIXTURE_CATEGORY_CODES) {
    if (!categoryIdByCode.has(categoryCode)) {
      throw new Error(`Missing boutique E2E category: ${categoryCode}`);
    }
  }

  for (let index = 1; index <= BOUTIQUE_FIXTURE_PRODUCT_COUNT; index += 1) {
    const sequence = String(index).padStart(2, "0");
    const slug = `e2e-boutique-product-${sequence}`;
    const sku = `E2E-BOUTIQUE-${sequence}`;
    const categoryCode =
      BOUTIQUE_FIXTURE_CATEGORY_CODES[
        (index - 1) % BOUTIQUE_FIXTURE_CATEGORY_CODES.length
      ];

    if (categoryCode === undefined) {
      throw new Error(`Unable to resolve category for boutique fixture ${sequence}`);
    }

    const categoryId = categoryIdByCode.get(categoryCode);

    if (categoryId === undefined) {
      throw new Error(`Missing boutique E2E category id: ${categoryCode}`);
    }

    const product = await prisma.product.upsert({
      where: {
        storeId_slug: {
          storeId: store.id,
          slug,
        },
      },
      update: {
        name: `Création Boutique E2E ${sequence}`,
        shortDescription: "Produit déterministe pour les tests du listing boutique.",
        status: "ACTIVE",
        isStandalone: true,
        catalogPriceCents: 5000 + index * 100,
        catalogPriceCurrencyCode: "EUR",
        publishedAt: now,
        archivedAt: null,
      },
      create: {
        storeId: store.id,
        slug,
        name: `Création Boutique E2E ${sequence}`,
        shortDescription: "Produit déterministe pour les tests du listing boutique.",
        status: "ACTIVE",
        isStandalone: true,
        catalogPriceCents: 5000 + index * 100,
        catalogPriceCurrencyCode: "EUR",
        publishedAt: now,
      },
      select: {
        id: true,
      },
    });

    const variant = await prisma.productVariant.upsert({
      where: {
        productId_sku: {
          productId: product.id,
          sku,
        },
      },
      update: {
        name: "Version par défaut",
        status: "ACTIVE",
        isDefault: true,
        sortOrder: 0,
        publishedAt: now,
        archivedAt: null,
      },
      create: {
        productId: product.id,
        sku,
        name: "Version par défaut",
        status: "ACTIVE",
        isDefault: true,
        sortOrder: 0,
        publishedAt: now,
      },
      select: {
        id: true,
      },
    });

    await prisma.productCategory.deleteMany({
      where: {
        productId: product.id,
      },
    });

    await prisma.productCategory.create({
      data: {
        productId: product.id,
        categoryId,
        isPrimary: true,
        sortOrder: 0,
      },
    });

    await prisma.inventoryItem.upsert({
      where: {
        storeId_variantId: {
          storeId: store.id,
          variantId: variant.id,
        },
      },
      update: {
        sku,
        status: "ACTIVE",
        onHandQuantity: 10,
        reservedQuantity: 0,
        archivedAt: null,
      },
      create: {
        storeId: store.id,
        variantId: variant.id,
        sku,
        status: "ACTIVE",
        onHandQuantity: 10,
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
  }

  const urls = [
    "/boutique",
    "/boutique?category=sacs",
    "/boutique?category=mini-sacs",
    "/boutique?category=cabas",
    "/boutique?category=accessoires",
    "/boutique?category=pochettes",
    "/boutique?category=trousses",
  ] as const;

  const countsByUrl: Record<string, number> = {};

  for (const url of urls) {
    const parsed = new URL(url, "http://e2e.local");
    const categorySlug = parsed.searchParams.get("category");

    countsByUrl[url] = await prisma.product.count({
      where: {
        storeId: store.id,
        status: "ACTIVE",
        archivedAt: null,
        ...(categorySlug !== null
          ? {
              productCategories: {
                some: {
                  category: {
                    OR: [
                      { slug: categorySlug },
                      { parent: { slug: categorySlug } },
                    ],
                  },
                },
              },
            }
          : {}),
      },
    });
  }

  return {
    countsByUrl,
  };
}
