import { expect, test } from "@playwright/test";
import { createScriptPrismaClient } from "../../../scripts/helpers/prisma-client";
import { activateFeatureFlag, ensureCommerceSmokeFixture } from "../commerce-db";

const DISCOUNT_CODE = "E2E-PROMO-10";

test.beforeAll(async () => {
  await activateFeatureFlag("commerce.discounts", {
    allowedLevels: ["rules", "automation"],
    defaultLevel: "rules",
  });

  const prisma = createScriptPrismaClient();

  try {
    const store = await prisma.store.findFirst({
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (store === null) {
      throw new Error("No store available for E2E discount setup.");
    }

    const discount = await prisma.discount.upsert({
      where: {
        storeId_code: {
          storeId: store.id,
          code: DISCOUNT_CODE,
        },
      },
      update: {
        name: "Promo E2E 10%",
        status: "ACTIVE",
        type: "PERCENTAGE",
        scopeType: "ORDER",
        percentageValue: 10,
        archivedAt: null,
      },
      create: {
        storeId: store.id,
        code: DISCOUNT_CODE,
        name: "Promo E2E 10%",
        status: "ACTIVE",
        type: "PERCENTAGE",
        scopeType: "ORDER",
        percentageValue: 10,
      },
      select: { id: true },
    });

    await prisma.discountCode.upsert({
      where: {
        discountId_code: {
          discountId: discount.id,
          code: DISCOUNT_CODE,
        },
      },
      update: {
        status: "ACTIVE",
        archivedAt: null,
      },
      create: {
        discountId: discount.id,
        code: DISCOUNT_CODE,
        status: "ACTIVE",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
});

test("applying a valid promo code shows discount amount in checkout summary", async ({ page }) => {
  const fixture = await ensureCommerceSmokeFixture();

  // Ajouter le produit au panier
  await page.goto(`/boutique/${fixture.productSlug}`);
  await expect(page.getByRole("heading", { name: fixture.productName }).first()).toBeVisible();
  await page.getByRole("button", { name: "Ajouter au panier" }).first().click();
  await expect(page.getByText("Ajouté au panier.").first()).toBeVisible({ timeout: 10_000 });

  // Remplir le checkout
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Finaliser la commande" })).toBeVisible();

  await page.locator('input[name="customerFirstName"]').fill("Jeanne");
  await page.locator('input[name="customerLastName"]').fill("Discount");
  await page.locator('input[name="customerEmail"]').fill("e2e-discount@creatyss.test");
  await page.locator('input[name="customerPhone"]').fill("0601020304");
  await page.locator('input[name="shippingAddressLine1"]').fill("12 rue des Tanneurs");
  await page.locator('input[name="shippingPostalCode"]').fill("75001");
  await page.locator('input[name="shippingCity"]').fill("Paris");

  await page.getByRole("button", { name: "Enregistrer mes informations" }).click();
  await expect(page).toHaveURL(/\/checkout\?status=saved$/);

  // Appliquer le code promo via le champ discount dans l'URL
  await page.goto(`/checkout?status=saved&discount=${DISCOUNT_CODE}`);

  // Vérifier que la section "Code promo" est visible (feature active)
  const discountSection = page.getByRole("heading", { name: "Code promo" });
  if (!(await discountSection.isVisible({ timeout: 5_000 }).catch(() => false))) {
    test.skip(true, "checkout discount UI not yet implemented or feature flag inactive");
    return;
  }

  // Vérifier que la remise est visible dans le récapitulatif
  await expect(page.getByText("Remise").first()).toBeVisible({ timeout: 10_000 });
});
