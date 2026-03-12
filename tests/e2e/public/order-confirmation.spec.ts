import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "../admin/admin-auth";
import { markOrderAsPaid, resetSimpleProductCatalogState } from "../order-db";

test.beforeEach(() => {
  resetSimpleProductCatalogState();
});

test("creates an order from checkout and clears the cart", async ({ page }) => {
  await page.goto("/boutique/pochette-sable");

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Produit simple" }) });

  await offerCard.getByLabel("Quantité").fill("1");
  await offerCard.getByRole("button", { name: "Ajouter au panier" }).click();
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

  await page.getByRole("button", { name: "Créer la commande" }).click();

  await expect(page).toHaveURL(/\/checkout\/confirmation\/CRY-[A-Z0-9]{10}$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Commande en attente de paiement"
    })
  ).toBeVisible();
  await expect(
    page.getByText(
      "La commande est créée, mais le paiement doit encore être confirmé."
    ).first()
  ).toBeVisible();
  await expect(page.getByText("En attente", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Paiement en attente").first()).toBeVisible();
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
      name: "Aucun article n'a encore été ajouté au panier"
    })
  ).toBeVisible();
});

test("reflects a cancelled order consistently on the public confirmation page", async ({
  page
}) => {
  await page.goto("/boutique/pochette-sable");

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Produit simple" }) });

  await offerCard.getByLabel("Quantité").fill("1");
  await offerCard.getByRole("button", { name: "Ajouter au panier" }).click();
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

  await page.getByRole("button", { name: "Créer la commande" }).click();
  await expect(page).toHaveURL(/\/checkout\/confirmation\/CRY-[A-Z0-9]{10}$/);

  const confirmationUrl = page.url();

  await loginAsSeedAdmin(page);
  await page.goto("/admin/orders");

  const createdOrderCard = page
    .getByRole("article")
    .filter({ hasText: "nina@example.com" })
    .first();

  await createdOrderCard.getByRole("link", { name: "Voir le détail" }).click();
  await page.getByRole("button", { name: "Annuler la commande" }).click();
  await expect(page).toHaveURL(/order_status=updated$/);

  await page.goto(confirmationUrl);
  await expect(
    page.getByRole("heading", { level: 1, name: "Commande annulée" })
  ).toBeVisible();
  await expect(page.getByText("Annulée", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("Cette commande a été annulée.")
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Payer la commande" })
  ).toHaveCount(0);
});

test("reflects a shipped order consistently on the public confirmation page", async ({
  page
}) => {
  await page.goto("/boutique/pochette-sable");

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Produit simple" }) });

  await offerCard.getByLabel("Quantité").fill("1");
  await offerCard.getByRole("button", { name: "Ajouter au panier" }).click();
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

  await page.getByRole("button", { name: "Créer la commande" }).click();
  await expect(page).toHaveURL(/\/checkout\/confirmation\/CRY-[A-Z0-9]{10}$/);

  const reference = await page
    .locator("article")
    .filter({ hasText: "Référence" })
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

  await createdOrderCard.getByRole("link", { name: "Voir le détail" }).click();
  await page.getByRole("button", { name: "Marquer en préparation" }).click();
  await expect(page).toHaveURL(/order_status=updated$/);
  await page.getByLabel("Référence de suivi optionnelle").fill("COL-654321");
  await page.getByRole("button", { name: "Marquer comme expédiée" }).click();
  await expect(page).toHaveURL(/order_status=shipped$/);

  await page.goto(confirmationUrl);
  await expect(
    page.getByRole("heading", { level: 1, name: "Commande expédiée" })
  ).toBeVisible();
  await expect(page.getByText("Expédiée", { exact: true }).first()).toBeVisible();
  await expect(
    page
      .getByText("La commande a quitté l'atelier et est en cours d'acheminement.")
      .first()
  ).toBeVisible();
  await expect(page.getByText(/Date d'expédition : /)).toBeVisible();
  await expect(page.getByText("Référence de suivi : COL-654321")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Payer la commande" })
  ).toHaveCount(0);
});
