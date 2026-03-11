import { expect, test } from "@playwright/test";

test("creates an order from checkout and clears the cart", async ({ page }) => {
  await page.goto("/boutique/sac-camel");

  const camelVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Camel" }) });

  await camelVariant.getByLabel("Quantite").fill("1");
  await camelVariant.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page).toHaveURL(/\/boutique\/sac-camel\?cart_status=added$/);

  await page.goto("/checkout");

  await page.locator('input[name="customerFirstName"]').fill("Jeanne");
  await page.locator('input[name="customerLastName"]').fill("Dupont");
  await page.locator('input[name="customerEmail"]').fill("jeanne@example.com");
  await page
    .locator('input[name="shippingAddressLine1"]')
    .fill("12 rue des Tanneurs");
  await page.locator('input[name="shippingPostalCode"]').fill("75001");
  await page.locator('input[name="shippingCity"]').fill("Paris");

  await page.getByRole("button", { name: "Creer la commande" }).click();

  await expect(page).toHaveURL(/\/checkout\/confirmation\/CRY-[A-Z0-9]{10}$/);
  await expect(
    page.getByRole("heading", { name: "Commande creee" })
  ).toBeVisible();
  await expect(page.getByText("En attente")).toBeVisible();
  await expect(page.getByText("jeanne@example.com")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sac Camel" })).toBeVisible();

  const referenceText = await page.locator("body").innerText();
  expect(referenceText).toMatch(/CRY-[A-Z0-9]{10}/);

  await page.goto("/panier");
  await expect(
    page.getByRole("heading", {
      name: "Aucune variante n'a encore ete ajoutee au panier"
    })
  ).toBeVisible();
});
