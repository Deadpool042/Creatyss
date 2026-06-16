import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import { createUniqueAdminProductIdentity } from "./product-test-helpers";

test("création produit: redirection /edit depuis la création rapide catalogue", async ({
  page,
}) => {
  test.setTimeout(90_000);

  const identity = createUniqueAdminProductIdentity({
    namePrefix: "Produit Wizard E2E",
    slugPrefix: "produit-wizard-e2e",
  });

  await loginAsSeedAdmin(page);

  await page.goto("/admin/catalog/products/new", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/catalog\/products\/new(?:\?.*)?$/);

  await expect(page.locator("#new-name")).toBeVisible();
  const nameInput = page.locator("#new-name");
  const slugInput = page.locator("#new-slug");
  await expect(slugInput).toBeVisible();

  const submitButton = page.getByRole("button", { name: "Créer la fiche produit" });

  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    await nameInput.click();
    await nameInput.fill("");
    await nameInput.pressSequentially(identity.name, { delay: 12 });
    await slugInput.click();
    await slugInput.fill("");
    await slugInput.pressSequentially(identity.slug, { delay: 8 });

    const slugValue = await slugInput.inputValue();
    if (slugValue.trim() === identity.slug && (await submitButton.isEnabled())) {
      break;
    }

    await page.waitForTimeout(500);
  }

  await expect(submitButton).toBeEnabled({ timeout: 1_000 });

  await Promise.all([
    page.waitForURL(/\/admin\/catalog\/products\/[^/]+\/edit(?:\?.*)?$/, {
      timeout: 20_000,
    }),
    submitButton.click(),
  ]);
});

test("wizard création produit: mobile critique sans overflow horizontal et CTA visible", async ({
  page,
}) => {
  await loginAsSeedAdmin(page);
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto("/admin/catalog/products/new", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#new-name")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  });

  expect(hasHorizontalOverflow).toBeFalsy();
  await expect(page.getByRole("button", { name: "Créer la fiche produit" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Réinitialiser" })).toBeVisible();
});
