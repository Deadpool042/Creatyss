import { expect, test } from "@playwright/test";

import { createScriptPrismaClient } from "../../../scripts/helpers/prisma-client";
import { activateFeatureFlag } from "../commerce-db";
import { loginAsSeedAdmin } from "./admin-auth";

const prisma = createScriptPrismaClient();

const MANUAL_DISCOUNT_CODE = "E2E-ADMIN-DISCOUNT-MANUAL";
const AUTOMATIC_DISCOUNT_CODE = "E2E-ADMIN-DISCOUNT-AUTO";
const AUTOMATIC_PRIORITY_INITIAL = 11;
const AUTOMATIC_PRIORITY_UPDATED = 12;
const REDEMPTION_CUSTOMER_EMAIL = "e2e-admin-discount@creatyss.test";
const REDEMPTION_ORDER_NUMBER = "E2E-DISCOUNT-ADMIN-0001";
const REDEMPTION_AMOUNT = 5;

let manualDiscountId: string;
let automaticDiscountId: string;

test.beforeAll(async () => {
  await activateFeatureFlag("commerce.discounts", {
    allowedLevels: ["simple", "rules", "automation"],
    defaultLevel: "automation",
  });

  const store = await prisma.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (store === null) {
    throw new Error("No store available for admin discounts E2E setup.");
  }

  const manualDiscount = await prisma.discount.upsert({
    where: {
      storeId_code: {
        storeId: store.id,
        code: MANUAL_DISCOUNT_CODE,
      },
    },
    update: {
      name: "Remise admin E2E manuelle",
      status: "ACTIVE",
      type: "PERCENTAGE",
      scopeType: "ORDER",
      percentageValue: 10,
      isAutomatic: false,
      priority: 0,
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      code: MANUAL_DISCOUNT_CODE,
      name: "Remise admin E2E manuelle",
      status: "ACTIVE",
      type: "PERCENTAGE",
      scopeType: "ORDER",
      percentageValue: 10,
      isAutomatic: false,
      priority: 0,
    },
    select: { id: true },
  });

  const automaticDiscount = await prisma.discount.upsert({
    where: {
      storeId_code: {
        storeId: store.id,
        code: AUTOMATIC_DISCOUNT_CODE,
      },
    },
    update: {
      name: "Remise admin E2E automatique",
      status: "ACTIVE",
      type: "PERCENTAGE",
      scopeType: "ORDER",
      percentageValue: 15,
      isAutomatic: true,
      priority: AUTOMATIC_PRIORITY_INITIAL,
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      code: AUTOMATIC_DISCOUNT_CODE,
      name: "Remise admin E2E automatique",
      status: "ACTIVE",
      type: "PERCENTAGE",
      scopeType: "ORDER",
      percentageValue: 15,
      isAutomatic: true,
      priority: AUTOMATIC_PRIORITY_INITIAL,
    },
    select: { id: true },
  });

  manualDiscountId = manualDiscount.id;
  automaticDiscountId = automaticDiscount.id;

  const customer = await prisma.customer.upsert({
    where: {
      storeId_email: {
        storeId: store.id,
        email: REDEMPTION_CUSTOMER_EMAIL,
      },
    },
    update: {
      displayName: "Cliente remise E2E",
      firstName: "Cliente",
      lastName: "Remise",
      status: "ACTIVE",
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      email: REDEMPTION_CUSTOMER_EMAIL,
      displayName: "Cliente remise E2E",
      firstName: "Cliente",
      lastName: "Remise",
      status: "ACTIVE",
    },
    select: { id: true },
  });

  const order = await prisma.order.upsert({
    where: {
      storeId_orderNumber: {
        storeId: store.id,
        orderNumber: REDEMPTION_ORDER_NUMBER,
      },
    },
    update: {
      customerId: customer.id,
      status: "CONFIRMED",
      currencyCode: "EUR",
      subtotalAmount: 50,
      shippingAmount: 0,
      discountAmount: REDEMPTION_AMOUNT,
      taxAmount: 0,
      totalAmount: 45,
      customerEmail: REDEMPTION_CUSTOMER_EMAIL,
      customerFirstName: "Cliente",
      customerLastName: "Remise",
      placedAt: new Date("2026-06-25T09:00:00.000Z"),
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      customerId: customer.id,
      orderNumber: REDEMPTION_ORDER_NUMBER,
      status: "CONFIRMED",
      currencyCode: "EUR",
      subtotalAmount: 50,
      shippingAmount: 0,
      discountAmount: REDEMPTION_AMOUNT,
      taxAmount: 0,
      totalAmount: 45,
      customerEmail: REDEMPTION_CUSTOMER_EMAIL,
      customerFirstName: "Cliente",
      customerLastName: "Remise",
      placedAt: new Date("2026-06-25T09:00:00.000Z"),
    },
    select: { id: true },
  });

  const existingRedemption = await prisma.discountRedemption.findFirst({
    where: {
      discountId: manualDiscountId,
      orderId: order.id,
      customerId: customer.id,
    },
    select: { id: true },
  });

  if (existingRedemption === null) {
    await prisma.discountRedemption.create({
      data: {
        discountId: manualDiscountId,
        orderId: order.id,
        customerId: customer.id,
        redeemedAt: new Date("2026-06-25T09:15:00.000Z"),
        amountApplied: REDEMPTION_AMOUNT,
        currencyCode: "EUR",
      },
    });
  }
});

test.afterAll(async () => {
  await prisma.$disconnect();
});

test("admin can open discount detail, create a secondary code and update automatic priority", async ({
  page,
}) => {
  const secondaryCode = `E2E-CODE-${Date.now().toString(36).toUpperCase()}`;

  await loginAsSeedAdmin(page);

  await page.goto("/admin/marketing/discounts", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Codes promo" }).first()).toBeVisible();

  const manualRow = page
    .locator("tr")
    .filter({ has: page.getByText(MANUAL_DISCOUNT_CODE, { exact: true }) })
    .first();

  await expect(manualRow).toBeVisible({ timeout: 10_000 });
  await manualRow.getByRole("link", { name: "Detail" }).click();

  await expect(page).toHaveURL(new RegExp(`/admin/marketing/discounts/${manualDiscountId}(?:\\?.*)?$`));
  await expect(page.getByRole("heading", { name: "Remise admin E2E manuelle" }).first()).toBeVisible();
  await expect(page.getByText("Cliente remise E2E").first()).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("link", { name: REDEMPTION_ORDER_NUMBER }).first()).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.getByText("5,00 €").first()).toBeVisible({ timeout: 10_000 });

  await page.getByLabel("Code secondaire").fill(secondaryCode);
  await page.getByLabel("Limite d'utilisations").fill("3");
  await page.getByRole("button", { name: "Créer le code" }).click();

  await expect(page.getByText("Code secondaire cree.").first()).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(secondaryCode).first()).toBeVisible({ timeout: 10_000 });

  await expect
    .poll(async () => {
      const code = await prisma.discountCode.findUnique({
        where: {
          discountId_code: {
            discountId: manualDiscountId,
            code: secondaryCode,
          },
        },
        select: {
          code: true,
          status: true,
          maxRedemptions: true,
        },
      });

      return code;
    })
    .toEqual({
      code: secondaryCode,
      status: "ACTIVE",
      maxRedemptions: 3,
    });

  const createdCodeRow = page
    .locator("tr")
    .filter({ has: page.getByText(secondaryCode, { exact: true }) })
    .first();

  await expect(createdCodeRow).toBeVisible({ timeout: 10_000 });
  await createdCodeRow.getByRole("button", { name: "Désactiver" }).click();

  await expect
    .poll(async () => {
      const code = await prisma.discountCode.findUnique({
        where: {
          discountId_code: {
            discountId: manualDiscountId,
            code: secondaryCode,
          },
        },
        select: { status: true },
      });

      return code?.status ?? null;
    })
    .toBe("INACTIVE");

  await createdCodeRow.getByRole("button", { name: "Activer" }).click();

  await expect
    .poll(async () => {
      const code = await prisma.discountCode.findUnique({
        where: {
          discountId_code: {
            discountId: manualDiscountId,
            code: secondaryCode,
          },
        },
        select: { status: true },
      });

      return code?.status ?? null;
    })
    .toBe("ACTIVE");

  await page.goto(`/admin/marketing/discounts/${automaticDiscountId}`, {
    waitUntil: "domcontentloaded",
  });

  await expect(page.getByRole("heading", { name: "Remise admin E2E automatique" }).first()).toBeVisible();

  const priorityInput = page.getByLabel("Priorité de la remise");
  await expect(priorityInput).toHaveValue(String(AUTOMATIC_PRIORITY_INITIAL));

  await priorityInput.fill(String(AUTOMATIC_PRIORITY_UPDATED));
  await page.getByRole("button", { name: "Enregistrer" }).click();

  await expect
    .poll(async () => {
      const discount = await prisma.discount.findUnique({
        where: { id: automaticDiscountId },
        select: { priority: true },
      });

      return discount?.priority ?? null;
    })
    .toBe(AUTOMATIC_PRIORITY_UPDATED);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Priorité de la remise")).toHaveValue(
    String(AUTOMATIC_PRIORITY_UPDATED)
  );
});

test("admin sees a validation error when the secondary code validity window is inconsistent", async ({
  page,
}) => {
  await loginAsSeedAdmin(page);

  await page.goto(`/admin/marketing/discounts/${manualDiscountId}`, {
    waitUntil: "domcontentloaded",
  });

  await expect(page.getByRole("heading", { name: "Remise admin E2E manuelle" }).first()).toBeVisible();

  await page.getByLabel("Code secondaire").fill("E2E-INVALID-DATE");
  await page.getByLabel("Date de début").fill("2026-07-10T10:00");
  await page.getByLabel("Date de fin").fill("2026-07-09T10:00");
  await page.getByRole("button", { name: "Créer le code" }).click();

  await expect(page.getByText("Le formulaire code secondaire est invalide.").first()).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.getByText("E2E-INVALID-DATE").first()).toHaveCount(0);
});

test("admin sees a duplicate error when creating an existing secondary code", async ({ page }) => {
  const duplicateCode = "E2E-DUPLICATE-CODE";

  await prisma.discountCode.upsert({
    where: {
      discountId_code: {
        discountId: manualDiscountId,
        code: duplicateCode,
      },
    },
    update: {
      status: "ACTIVE",
      archivedAt: null,
    },
    create: {
      discountId: manualDiscountId,
      code: duplicateCode,
      status: "ACTIVE",
    },
  });

  await loginAsSeedAdmin(page);

  await page.goto(`/admin/marketing/discounts/${manualDiscountId}`, {
    waitUntil: "domcontentloaded",
  });

  await expect(page.getByRole("heading", { name: "Remise admin E2E manuelle" }).first()).toBeVisible();

  await page.getByLabel("Code secondaire").fill(duplicateCode);
  await page.getByRole("button", { name: "Créer le code" }).click();

  await expect(
    page.getByText("Ce code secondaire existe deja pour cette remise.").first()
  ).toBeVisible({
    timeout: 10_000,
  });
});
