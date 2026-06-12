import { expect, test, type Page } from "@playwright/test";
import { ensureCommerceSmokeFixture } from "../commerce-db";

async function addFixtureProductToCart(page: Page): Promise<void> {
  const fixture = await ensureCommerceSmokeFixture();

  await page.goto(`/boutique/${fixture.productSlug}`);
  await expect(page.getByRole("heading", { name: fixture.productName }).first()).toBeVisible();

  await page.getByRole("button", { name: "Ajouter au panier" }).first().click();

  // Signal fiable de l'ajout : le toast fiche produit. Les assertions sur
  // ?cart_status=added sont racées (le composant toast retire le paramètre).
  await expect(page.getByText("Ajouté au panier.").first()).toBeVisible({ timeout: 10_000 });
}

async function fillGuestCheckoutForm(
  page: Page,
  overrides: { postalCode?: string } = {}
): Promise<void> {
  await page.locator('input[name="customerFirstName"]').fill("Jeanne");
  await page.locator('input[name="customerLastName"]').fill("Dupont");
  await page.locator('input[name="customerEmail"]').fill("jeanne@example.com");
  await page.locator('input[name="customerPhone"]').fill("0601020304");
  await page.locator('input[name="shippingAddressLine1"]').fill("12 rue des Tanneurs");
  await page.locator('input[name="shippingPostalCode"]').fill(overrides.postalCode ?? "75001");
  await page.locator('input[name="shippingCity"]').fill("Paris");
}

test("saves a guest checkout draft", async ({ page }) => {
  await addFixtureProductToCart(page);

  await page.goto("/checkout");

  await expect(page.getByRole("heading", { name: "Finaliser la commande" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Panier final" })).toBeVisible();

  await fillGuestCheckoutForm(page);
  await page.getByRole("button", { name: "Enregistrer mes informations" }).click();

  await expect(page).toHaveURL(/\/checkout\?status=saved$/);
  await expect(page.getByText("Les informations de commande ont été enregistrées.")).toBeVisible();
  await expect(page.locator('input[name="customerFirstName"]')).toHaveValue("Jeanne");
  await expect(page.locator('input[name="customerEmail"]')).toHaveValue("jeanne@example.com");
});

test("rejects an invalid French postal code", async ({ page }) => {
  await addFixtureProductToCart(page);

  await page.goto("/checkout");

  await fillGuestCheckoutForm(page, { postalCode: "7501" });
  await page.getByRole("button", { name: "Enregistrer mes informations" }).click();

  await expect(page).toHaveURL(/\/checkout\?error=invalid_shipping_postal_code$/);
  await expect(
    page.getByText("Renseignez un code postal de livraison à 5 chiffres.")
  ).toBeVisible();
});
