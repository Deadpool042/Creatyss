import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "../admin/admin-auth";
import { markOrderAsPaid } from "../order-db";

test("creates an order from checkout and clears the cart", async ({ page }) => {
  await page.goto("/boutique/pochette-sable");

  const sableVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Sable" }) });

  await sableVariant.getByLabel("Quantite").fill("1");
  await sableVariant.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_status=added$/);

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
  await expect(page.getByText("En attente", { exact: true })).toBeVisible();
  await expect(page.getByText("Paiement en attente")).toBeVisible();
  await expect(page.getByText("jeanne@example.com")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pochette Sable" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Payer la commande" })
  ).toBeVisible();

  const referenceText = await page.locator("body").innerText();
  expect(referenceText).toMatch(/CRY-[A-Z0-9]{10}/);

  await page.goto("/panier");
  await expect(
    page.getByRole("heading", {
      name: "Aucune variante n'a encore ete ajoutee au panier"
    })
  ).toBeVisible();
});

test("reflects a cancelled order consistently on the public confirmation page", async ({
  page
}) => {
  await page.goto("/boutique/pochette-sable");

  const sableVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Sable" }) });

  await sableVariant.getByLabel("Quantite").fill("10");
  await sableVariant.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_status=added$/);

  await page.goto("/checkout");

  await page.locator('input[name="customerFirstName"]').fill("Nina");
  await page.locator('input[name="customerLastName"]').fill("Martin");
  await page.locator('input[name="customerEmail"]').fill("nina@example.com");
  await page
    .locator('input[name="shippingAddressLine1"]')
    .fill("4 rue des Fleurs");
  await page.locator('input[name="shippingPostalCode"]').fill("75002");
  await page.locator('input[name="shippingCity"]').fill("Paris");

  await page.getByRole("button", { name: "Creer la commande" }).click();
  await expect(page).toHaveURL(/\/checkout\/confirmation\/CRY-[A-Z0-9]{10}$/);

  const confirmationUrl = page.url();

  await page.goto("/boutique/pochette-sable");
  await expect(
    sableVariant.getByText("Temporairement indisponible", { exact: true })
  ).toBeVisible();

  await loginAsSeedAdmin(page);
  await page.goto("/admin/orders");

  const createdOrderCard = page
    .getByRole("article")
    .filter({ hasText: "nina@example.com" })
    .first();

  await createdOrderCard.getByRole("link", { name: "Voir le detail" }).click();
  await page.getByRole("button", { name: "Annuler la commande" }).click();
  await expect(page).toHaveURL(/order_status=updated$/);

  await page.goto(confirmationUrl);
  await expect(page.getByText("Annulee", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Cette commande a ete annulee.")
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Payer la commande" })
  ).toHaveCount(0);

  await page.goto("/boutique/pochette-sable");
  await expect(sableVariant.getByText("Disponible", { exact: true })).toBeVisible();
});

test("reflects a shipped order consistently on the public confirmation page", async ({
  page
}) => {
  await page.goto("/boutique/pochette-sable");

  const sableVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Sable" }) });

  await sableVariant.getByLabel("Quantite").fill("1");
  await sableVariant.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_status=added$/);

  await page.goto("/checkout");

  await page.locator('input[name="customerFirstName"]').fill("Claire");
  await page.locator('input[name="customerLastName"]').fill("Meyer");
  await page.locator('input[name="customerEmail"]').fill("claire@example.com");
  await page
    .locator('input[name="shippingAddressLine1"]')
    .fill("10 rue du Bac");
  await page.locator('input[name="shippingPostalCode"]').fill("75007");
  await page.locator('input[name="shippingCity"]').fill("Paris");

  await page.getByRole("button", { name: "Creer la commande" }).click();
  await expect(page).toHaveURL(/\/checkout\/confirmation\/CRY-[A-Z0-9]{10}$/);

  const reference = await page
    .locator("article")
    .filter({ hasText: "Reference" })
    .locator("p.card-copy")
    .first()
    .textContent();

  expect(reference).toMatch(/^CRY-[A-Z0-9]{10}$/);
  const confirmationUrl = page.url();

  markOrderAsPaid(reference ?? "");

  await loginAsSeedAdmin(page);
  await page.goto("/admin/orders");

  const createdOrderCard = page
    .getByRole("article")
    .filter({ hasText: reference ?? "" })
    .first();

  await createdOrderCard.getByRole("link", { name: "Voir le detail" }).click();
  await page.getByRole("button", { name: "Marquer en preparation" }).click();
  await expect(page).toHaveURL(/order_status=updated$/);
  await page.getByLabel("Reference de suivi optionnelle").fill("COL-654321");
  await page.getByRole("button", { name: "Marquer comme expediee" }).click();
  await expect(page).toHaveURL(/order_status=shipped$/);

  await page.goto(confirmationUrl);
  await expect(page.getByText("Expediee", { exact: true })).toBeVisible();
  await expect(page.getByText("Votre commande a ete expediee.")).toBeVisible();
  await expect(page.getByText(/Date d'expedition : /)).toBeVisible();
  await expect(page.getByText("Reference de suivi : COL-654321")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Payer la commande" })
  ).toHaveCount(0);
});
