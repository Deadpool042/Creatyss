import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import {
  createLegacyVariantForProduct,
  createSimpleProductDraft,
  deleteProductBySlug,
} from "../product-db";

const TEST_PRODUCT_SLUG = "test-incoherent-simple-e2e";
const TEST_PRODUCT_NAME = "Test Incohérent E2E";

test("affiche la page liste admin des produits avec le lien d'action et la zone de contenu", async ({
  page,
}) => {
  await loginAsSeedAdmin(page);

  await page.goto("/admin/products", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/products$/);

  await expect(page.getByRole("heading", { name: "Produits" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Nouveau produit" })).toBeVisible();

  const productCards = page.locator("article.admin-product-card");

  if ((await productCards.count()) > 0) {
    await expect(productCards.first()).toBeVisible();
    await expect(
      productCards.first().getByRole("link", { name: "Modifier le produit" })
    ).toBeVisible();
    return;
  }

  await expect(page.locator(".empty-state")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Le catalogue ne contient pas encore de produit",
    })
  ).toBeVisible();
});

test("refuse la publication d'un produit simple avec plusieurs déclinaisons", async ({ page }) => {
  // Cleanup any leftover state from a previous failed run
  deleteProductBySlug(TEST_PRODUCT_SLUG);

  // Setup: simple draft product with 2 variants → incoherent, not publishable
  createSimpleProductDraft({ slug: TEST_PRODUCT_SLUG, name: TEST_PRODUCT_NAME });
  createLegacyVariantForProduct({
    productSlug: TEST_PRODUCT_SLUG,
    name: "Variante 1",
    colorName: "Rouge",
    colorHex: null,
    sku: "TEST-V1-E2E",
    price: "49.00",
    compareAtPrice: null,
    stockQuantity: 5,
    isDefault: true,
    status: "published",
  });
  createLegacyVariantForProduct({
    productSlug: TEST_PRODUCT_SLUG,
    name: "Variante 2",
    colorName: "Bleu",
    colorHex: null,
    sku: "TEST-V2-E2E",
    price: "49.00",
    compareAtPrice: null,
    stockQuantity: 5,
    isDefault: false,
    status: "published",
  });

  try {
    await loginAsSeedAdmin(page);
    await page.goto("/admin/products", { waitUntil: "networkidle" });

    // Find the product row in the table (newest product appears first, no filter needed)
    const productRow = page.locator("tr").filter({ hasText: TEST_PRODUCT_NAME });
    await expect(productRow).toBeVisible();

    // The "Non publiable" indicator should be visible in the status column
    await expect(productRow.getByText("Non publiable")).toBeVisible();

    // Open the DropdownMenu using the exact accessible name of the trigger button
    const actionsButton = page.getByRole("button", {
      name: `Actions produit ${TEST_PRODUCT_NAME}`,
    });
    await expect(actionsButton).toBeVisible();
    await actionsButton.focus();
    await actionsButton.press("Enter");

    // Wait for the Radix portal menu to appear, then verify "Publier" is disabled
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect(menu.locator('[role="menuitem"]').filter({ hasText: "Publier" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );

    // Close the menu and navigate to the detail page
    await page.keyboard.press("Escape");
    await productRow.getByRole("link", { name: "Modifier le produit" }).click();

    await expect(page).toHaveURL(/\/admin\/products\/\d+$/);

    // The non-publishable notice should be visible on the detail page
    await expect(
      page.getByText("Ce produit simple a plusieurs déclinaisons").first()
    ).toBeVisible();

    // Try to save as published — should be refused (scope to product-level status select, not variant ones)
    await page.locator('select[id^="product-status"]').selectOption("published");
    await page.getByRole("button", { name: "Enregistrer le produit" }).click();

    await expect(page).toHaveURL(/product_error=simple_product_incoherent_variants/);
    await expect(
      page.getByText("Ce produit simple a plusieurs déclinaisons").first()
    ).toBeVisible();

    // Product must still be a draft
    await expect(page.getByText("Brouillon").first()).toBeVisible();
  } finally {
    deleteProductBySlug(TEST_PRODUCT_SLUG);
  }
});
