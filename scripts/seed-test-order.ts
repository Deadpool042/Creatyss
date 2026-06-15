import { createScriptPrismaClient } from "./helpers/prisma-client";

/**
 * Crée une commande de test (1 ligne, TVA 20 % métropole, prix TTC) pour
 * pouvoir tester l'émission de facture en admin. Dev uniquement.
 * Prérequis : un store, et au moins un produit variable (`pnpm seed:variables`).
 */
async function main(): Promise<void> {
  const prisma = createScriptPrismaClient();

  try {
    const store = await prisma.store.findFirst({
      select: { id: true, defaultCurrency: true },
      orderBy: { createdAt: "asc" },
    });
    if (!store) throw new Error("Aucun store. Lance d'abord le seed.");

    const variant = await prisma.productVariant.findFirst({
      where: { prices: { some: {} } },
      select: {
        id: true,
        sku: true,
        name: true,
        slug: true,
        product: { select: { id: true, name: true, slug: true } },
        prices: { select: { amount: true }, take: 1 },
      },
      orderBy: { createdAt: "asc" },
    });
    if (!variant || variant.prices[0] === undefined) {
      throw new Error("Aucun produit avec prix. Lance `pnpm seed:variables`.");
    }

    const unitTtc = Number(variant.prices[0].amount);
    const quantity = 1;
    const lineTtc = Math.round(unitTtc * quantity * 100) / 100;
    const lineTax = Math.round((lineTtc - lineTtc / 1.2) * 100) / 100;

    const order = await prisma.order.create({
      data: {
        storeId: store.id,
        orderNumber: `TEST-${Date.now()}`,
        status: "PENDING",
        currencyCode: store.defaultCurrency,
        subtotalAmount: lineTtc,
        shippingAmount: 0,
        discountAmount: 0,
        taxAmount: lineTax,
        totalAmount: lineTtc,
        customerEmail: "client.test@example.com",
        customerFirstName: "Client",
        customerLastName: "Test",
        placedAt: new Date(),
        lines: {
          create: [
            {
              productId: variant.product.id,
              variantId: variant.id,
              quantity,
              unitPriceAmount: unitTtc,
              lineSubtotalAmount: lineTtc,
              lineDiscountAmount: 0,
              lineTaxAmount: lineTax,
              lineTotalAmount: lineTtc,
              taxRatePercent: 20,
              taxTerritory: "METROPOLE",
              productName: variant.product.name,
              variantName: variant.name ?? null,
              sku: variant.sku,
              productSlug: variant.product.slug,
              variantSlug: variant.slug ?? null,
            },
          ],
        },
        addresses: {
          create: [
            {
              type: "BILLING",
              firstName: "Client",
              lastName: "Test",
              line1: "1 rue de Test",
              postalCode: "75001",
              city: "Paris",
              countryCode: "FR",
            },
            {
              type: "SHIPPING",
              firstName: "Client",
              lastName: "Test",
              line1: "1 rue de Test",
              postalCode: "75001",
              city: "Paris",
              countryCode: "FR",
            },
          ],
        },
      },
      select: { id: true, orderNumber: true },
    });

    process.stdout.write(`Commande de test créée : ${order.orderNumber} (${order.id})\n`);
  } finally {
    // rien
  }
}

main().catch((error: unknown) => {
  console.error("Échec seed commande de test :", error);
  process.exitCode = 1;
});
