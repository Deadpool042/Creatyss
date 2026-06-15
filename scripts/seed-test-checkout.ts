import { createScriptPrismaClient } from "./helpers/prisma-client";

/**
 * Active de quoi tester le checkout en dev : un mode de paiement (paiement à
 * l'atelier + virement) et une méthode de livraison ACTIVE. Dev uniquement.
 */
async function main(): Promise<void> {
  const prisma = createScriptPrismaClient();

  const store = await prisma.store.findFirst({
    select: { id: true, defaultCurrency: true },
    orderBy: { createdAt: "asc" },
  });
  if (!store) throw new Error("Aucun store. Lance d'abord le seed.");

  await prisma.store.update({
    where: { id: store.id },
    data: {
      cashOnDeliveryEnabled: true,
      cashOnDeliveryInstructions: "Réglez votre commande lors du retrait à l'atelier.",
      bankTransferEnabled: true,
      bankTransferInstructions: "IBAN communiqué par email après validation de la commande.",
    },
  });

  await prisma.shippingMethod.upsert({
    where: { storeId_code: { storeId: store.id, code: "STD" } },
    update: { status: "ACTIVE", amount: 6.9 },
    create: {
      storeId: store.id,
      code: "STD",
      name: "Livraison standard",
      description: "Expédition sous 3 à 5 jours ouvrés.",
      status: "ACTIVE",
      currencyCode: store.defaultCurrency,
      amount: 6.9,
      isDefault: true,
      sortOrder: 0,
    },
  });

  process.stdout.write(
    "Checkout de test prêt : paiement (atelier + virement) + livraison standard activés.\n"
  );
}

main().catch((error: unknown) => {
  console.error("Échec seed checkout de test :", error);
  process.exitCode = 1;
});
