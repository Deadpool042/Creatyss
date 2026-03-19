import { expect, test, type Page } from "@playwright/test";

async function addCamelVariantToCart(page: Page) {
  await page.goto("/boutique/sac-camel");

  const camelVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Camel" }) });

  await camelVariant.getByLabel("Quantité").fill("1");
  await camelVariant.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page).toHaveURL(/\/boutique\/sac-camel\?cart_status=added$/);
}

test("saves a guest checkout draft", async ({ page }) => {
  await addCamelVariantToCart(page);

  await page.goto("/checkout");

  await expect(page.getByRole("heading", { name: "Finaliser la commande" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Panier final" })).toBeVisible();

  await page.locator('input[name="customerFirstName"]').fill("Jeanne");
  await page.locator('input[name="customerLastName"]').fill("Dupont");
  await page.locator('input[name="customerEmail"]').fill("jeanne@example.com");
  await page.locator('input[name="shippingAddressLine1"]').fill("12 rue des Tanneurs");
  await page.locator('input[name="shippingPostalCode"]').fill("75001");
  await page.locator('input[name="shippingCity"]').fill("Paris");

  await page.getByRole("button", { name: "Enregistrer mes informations" }).click();

  await expect(page).toHaveURL(/\/checkout\?status=saved$/);
  await expect(page.getByText("Les informations de commande ont été enregistrées.")).toBeVisible();
  await expect(page.locator('input[name="customerFirstName"]')).toHaveValue("Jeanne");
  await expect(page.locator('input[name="customerEmail"]')).toHaveValue("jeanne@example.com");
});

test("rejects an invalid French postal code", async ({ page }) => {
  await addCamelVariantToCart(page);

  await page.goto("/checkout");

  await page.locator('input[name="customerFirstName"]').fill("Jeanne");
  await page.locator('input[name="customerLastName"]').fill("Dupont");
  await page.locator('input[name="customerEmail"]').fill("jeanne@example.com");
  await page.locator('input[name="shippingAddressLine1"]').fill("12 rue des Tanneurs");
  await page.locator('input[name="shippingPostalCode"]').fill("7501");
  await page.locator('input[name="shippingCity"]').fill("Paris");

  await page.getByRole("button", { name: "Enregistrer mes informations" }).click();

  await expect(page).toHaveURL(/\/checkout\?error=invalid_shipping_postal_code$/);
  await expect(
    page.getByText("Renseignez un code postal de livraison à 5 chiffres.")
  ).toBeVisible();
});
