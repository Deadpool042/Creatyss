import { expect, test, type Locator, type Page } from "@playwright/test";

import { loginAsSeedAdmin } from "./admin-auth";
import { createSimpleAdminProduct, createUniqueAdminProductIdentity } from "./product-test-helpers";

type SeededListProduct = {
  name: string;
  slug: string;
};

async function openAdminProductsList(
  page: Page,
  view: "active" | "trash" = "active"
): Promise<void> {
  const suffix = view === "trash" ? "?view=trash" : "";
  await page.goto(`/admin/products${suffix}`);

  if (view === "trash") {
    await expect(page).toHaveURL(/\/admin\/products\?view=trash$/);
    await expect(page.getByRole("link", { name: "Corbeille" }).first()).toBeVisible();
  } else {
    await expect(page).toHaveURL(/\/admin\/products$/);
    await expect(page.getByRole("link", { name: "Actifs" }).first()).toBeVisible();
  }
}

async function searchProducts(page: Page, value: string, mobile = false): Promise<void> {
  if (mobile) {
    await page
      .getByRole("button", { name: /rechercher/i })
      .first()
      .click();

    const mobileSearchInput = page.getByPlaceholder("Rechercher un produit…").last();
    await expect(mobileSearchInput).toBeVisible();
    await mobileSearchInput.fill(value);

    await page.keyboard.press("Escape");
    await expect(mobileSearchInput).not.toBeVisible();

    return;
  }

  const searchInput = page.getByPlaceholder("Rechercher un produit…").first();
  await expect(searchInput).toBeVisible();
  await searchInput.fill(value);
}

function getDesktopRow(page: Page, productName: string): Locator {
  return page.getByRole("row").filter({ hasText: productName }).first();
}

function getDesktopRowCheckbox(page: Page, productName: string): Locator {
  return getDesktopRow(page, productName).getByRole("checkbox").first();
}

async function selectDesktopProducts(page: Page, productNames: string[]): Promise<void> {
  for (const productName of productNames) {
    const checkbox = getDesktopRowCheckbox(page, productName);
    await expect(checkbox).toBeVisible();
    await checkbox.check();
  }
}

function getMobileProductCard(page: Page, productName: string): Locator {
  return page.locator("article").filter({ hasText: productName }).first();
}

async function expectProductsVisible(page: Page, productNames: string[]): Promise<void> {
  for (const productName of productNames) {
    await expect(page.getByText(productName).first()).toBeVisible();
  }
}

async function expectProductsNotVisible(page: Page, productNames: string[]): Promise<void> {
  for (const productName of productNames) {
    await expect(page.getByText(productName)).toHaveCount(0);
  }
}

async function expectMobileProductsVisible(page: Page, productNames: string[]): Promise<void> {
  for (const productName of productNames) {
    await expect(getMobileProductCard(page, productName)).toBeVisible();
  }
}

async function readMobileSelectionCounter(page: Page): Promise<{
  selected: number;
  visible: number;
}> {
  const selectionBar = page
    .locator("div")
    .filter({
      has: page.getByLabel("Sélectionner les produits affichés"),
      hasText: /\d+\s*\/\s*\d+/,
    })
    .first();

  await expect(selectionBar).toBeVisible();

  const counter = selectionBar.getByText(/\d+\s*\/\s*\d+/).first();
  await expect(counter).toBeVisible();

  const text = (await counter.textContent())?.trim() ?? "";
  const match = text.match(/^(\d+)\s*\/\s*(\d+)$/);

  expect(match).not.toBeNull();

  return {
    selected: Number.parseInt(match?.[1] ?? "0", 10),
    visible: Number.parseInt(match?.[2] ?? "0", 10),
  };
}

test.describe.serial("admin products list bulk", () => {
  test.describe.configure({ timeout: 180_000 });

  let seededProducts: SeededListProduct[] = [];

  test("desktop archive puis restore", async ({ page }) => {
    const firstIdentity = createUniqueAdminProductIdentity({
      namePrefix: "Produit Bulk Liste A",
      slugPrefix: "produit-bulk-liste-a",
    });

    const secondIdentity = createUniqueAdminProductIdentity({
      namePrefix: "Produit Bulk Liste B",
      slugPrefix: "produit-bulk-liste-b",
    });

    await loginAsSeedAdmin(page);

    await createSimpleAdminProduct(page, {
      name: firstIdentity.name,
      slug: firstIdentity.slug,
      status: "draft",
    });

    await createSimpleAdminProduct(page, {
      name: secondIdentity.name,
      slug: secondIdentity.slug,
      status: "draft",
    });

    seededProducts = [
      { name: firstIdentity.name, slug: firstIdentity.slug },
      { name: secondIdentity.name, slug: secondIdentity.slug },
    ];

    const productNames = seededProducts.map((product) => product.name);

    await openAdminProductsList(page, "active");
    await searchProducts(page, "Produit Bulk Liste");

    await expectProductsVisible(page, productNames);
    await selectDesktopProducts(page, productNames);

    await expect(page.getByText("2 produits sélectionnés")).toBeVisible();
    await page.getByRole("button", { name: "Corbeille" }).click();

    await expectProductsNotVisible(page, productNames);

    await openAdminProductsList(page, "trash");
    await searchProducts(page, "Produit Bulk Liste");

    await expectProductsVisible(page, productNames);
    await selectDesktopProducts(page, productNames);

    await expect(page.getByText("2 produits sélectionnés")).toBeVisible();
    await page.getByRole("button", { name: "Restaurer" }).click();

    await expectProductsNotVisible(page, productNames);

    await openAdminProductsList(page, "active");
    await searchProducts(page, "Produit Bulk Liste");

    await expectProductsVisible(page, productNames);
  });

  test("mobile switch actifs corbeille", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await loginAsSeedAdmin(page);
    await openAdminProductsList(page, "active");

    await expect(page.getByRole("link", { name: "Actifs" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Corbeille" }).first()).toBeVisible();

    await page.getByRole("link", { name: "Corbeille" }).first().click();
    await expect(page).toHaveURL(/\/admin\/products\?view=trash$/);

    await page.getByRole("link", { name: "Actifs" }).first().click();
    await expect(page).toHaveURL(/\/admin\/products$/);
  });

  test("mobile sélectionne uniquement les visibles", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await loginAsSeedAdmin(page);
    await openAdminProductsList(page, "active");
    await searchProducts(page, "Produit Bulk Liste", true);

    await expectMobileProductsVisible(
      page,
      seededProducts.map((product) => product.name)
    );

    const initialCounter = await readMobileSelectionCounter(page);
    expect(initialCounter.selected).toBe(0);
    expect(initialCounter.visible).toBeGreaterThanOrEqual(2);

    await page.getByLabel("Sélectionner les produits affichés").click();

    const afterSelectCounter = await readMobileSelectionCounter(page);
    expect(afterSelectCounter.selected).toBe(afterSelectCounter.visible);
    expect(afterSelectCounter.visible).toBe(initialCounter.visible);

    await expect(
      page.getByText(new RegExp(`${afterSelectCounter.selected} sélectionné`))
    ).toBeVisible();
  });

  test("mobile archive puis restore", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await loginAsSeedAdmin(page);
    await openAdminProductsList(page, "active");
    await searchProducts(page, "Produit Bulk Liste", true);

    await expectMobileProductsVisible(
      page,
      seededProducts.map((product) => product.name)
    );

    const firstCard = getMobileProductCard(page, seededProducts[0]!.name);
    const secondCard = getMobileProductCard(page, seededProducts[1]!.name);

    await firstCard.getByLabel(new RegExp(`Sélectionner ${seededProducts[0]!.name}`)).click();
    await secondCard.getByLabel(new RegExp(`Sélectionner ${seededProducts[1]!.name}`)).click();

    await expect(page.getByText("2 sélectionnés")).toBeVisible();
    await expect(page.getByRole("button", { name: "Corbeille" })).toBeVisible();

    await page.getByRole("button", { name: "Corbeille" }).click();
    await expectProductsNotVisible(
      page,
      seededProducts.map((product) => product.name)
    );

    await openAdminProductsList(page, "trash");
    await searchProducts(page, "Produit Bulk Liste", true);

    await expectMobileProductsVisible(
      page,
      seededProducts.map((product) => product.name)
    );

    const firstTrashCard = getMobileProductCard(page, seededProducts[0]!.name);
    const secondTrashCard = getMobileProductCard(page, seededProducts[1]!.name);

    await firstTrashCard.getByLabel(new RegExp(`Sélectionner ${seededProducts[0]!.name}`)).click();
    await secondTrashCard.getByLabel(new RegExp(`Sélectionner ${seededProducts[1]!.name}`)).click();

    await expect(page.getByText("2 sélectionnés")).toBeVisible();
    await page.getByRole("button", { name: "Restaurer" }).click();

    await expectProductsNotVisible(
      page,
      seededProducts.map((product) => product.name)
    );

    await openAdminProductsList(page, "active");
    await searchProducts(page, "Produit Bulk Liste", true);

    await expectMobileProductsVisible(
      page,
      seededProducts.map((product) => product.name)
    );
  });
});
