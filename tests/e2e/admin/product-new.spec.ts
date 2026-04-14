import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import { createUniqueAdminProductIdentity } from "./product-test-helpers";

test("wizard création produit: 2 étapes, type métier, redirection /edit, sans type legacy", async ({
  page,
}) => {
  test.setTimeout(90_000);

  const identity = createUniqueAdminProductIdentity({
    namePrefix: "Produit Wizard E2E",
    slugPrefix: "produit-wizard-e2e",
  });

  await loginAsSeedAdmin(page);

  await page.goto("/admin/products/new", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/products\/new(?:\?.*)?$/);

  await expect(page.getByRole("heading", { level: 1, name: "Nouveau produit" })).toBeVisible();
  await expect(page.getByText("Étape 1 sur 2")).toBeVisible();
  const nameInput = page.locator("#new-name");
  const slugInput = page.locator("#new-slug");
  await expect(nameInput).toBeVisible();
  await expect(slugInput).toBeVisible();

  const nextButton = page.getByRole("button", { name: "Suivant" });

  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    await nameInput.click();
    await nameInput.fill("");
    await nameInput.pressSequentially(identity.name, { delay: 12 });
    const slugValue = await slugInput.inputValue();
    if (slugValue.trim().length === 0) {
      await page.waitForTimeout(500);
      continue;
    }

    if (await nextButton.isEnabled()) {
      break;
    }

    await page.waitForTimeout(500);
  }

  await expect(nextButton).toBeEnabled({ timeout: 1_000 });
  await page.getByRole("button", { name: "Suivant" }).click();

  await expect(page.getByText("Étape 2 sur 2")).toBeVisible();
  await expect(page.getByLabel("Type de produit")).toBeVisible();
  await page.getByLabel("Type de produit").click();
  await expect(page.getByRole("option", { name: "Produit simple", exact: true })).toBeVisible();
  await expect(
    page.getByRole("option", { name: "Produit à variantes", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("option", { name: /woo-imported/i })).toHaveCount(0);
  await page.getByRole("option", { name: "Produit simple", exact: true }).click();

  await Promise.all([
    page.waitForURL(/\/admin\/products\/[^/]+\/edit(?:\?.*)?$/, {
      timeout: 20_000,
    }),
    page.getByRole("button", { name: "Créer le produit" }).click(),
  ]);
});

test("wizard création produit: mobile critique sans overflow horizontal et CTA visible", async ({
  page,
}) => {
  await loginAsSeedAdmin(page);
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto("/admin/products/new", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Étape 1 sur 2")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  });

  expect(hasHorizontalOverflow).toBeFalsy();
  await expect(page.getByRole("button", { name: "Suivant" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Réinitialiser" })).toBeVisible();
});
