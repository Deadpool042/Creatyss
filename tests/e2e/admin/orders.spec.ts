import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import { markOrderAsPaid, resetSimpleProductCatalogState } from "../order-db";

test.beforeEach(() => {
  resetSimpleProductCatalogState();
});

test("lets admin cancel a pending order from the detail page", async ({ page }) => {
  await page.goto("/boutique/pochette-sable");

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Produit simple" }) });

  await offerCard.getByLabel("Quantité").fill("1");
  await offerCard.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_status=added$/);

  await page.goto("/checkout");
  await expect(
    page.getByRole("heading", { name: "Finaliser la commande" })
  ).toBeVisible();

  await page.locator('input[name="customerFirstName"]').fill("Alice");
  await page.locator('input[name="customerLastName"]').fill("Martin");
  await page.locator('input[name="customerEmail"]').fill("alice.orders@example.com");
  await page
    .locator('input[name="shippingAddressLine1"]')
    .fill("18 rue du Commerce");
  await page.locator('input[name="shippingPostalCode"]').fill("75015");
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

  await loginAsSeedAdmin(page);
  await page.goto("/admin/orders");

  const createdOrderCard = page
    .getByRole("article")
    .filter({ hasText: reference ?? "" })
    .first();

  await expect(createdOrderCard).toContainText(reference ?? "");
  await expect(createdOrderCard).toContainText("Paiement en attente");
  await createdOrderCard.getByRole("link", { name: "Voir le détail" }).click();

  await expect(page).toHaveURL(/\/admin\/orders\/[0-9]+$/);
  await expect(
    page.getByRole("heading", { name: `Commande ${reference}` })
  ).toBeVisible();
  await expect(page.getByText("alice.orders@example.com").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pochette Sable" })).toBeVisible();
  await expect(page.getByText("En attente", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Paiement en attente").first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Commande en attente de paiement" })
  ).toBeVisible();
  await expect(page.getByText("Prestataire : stripe")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Marquer en préparation" })
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Annuler la commande" }).click();

  await expect(page).toHaveURL(/order_status=updated$/);
  await expect(
    page.getByText("Le statut de la commande a été mis à jour.")
  ).toBeVisible();
  await expect(page.getByText("Annulée", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("Aucune autre action n'est disponible pour cette commande.", {
      exact: true,
    })
  ).toBeVisible();

  await page.goto("/admin/orders");
  const updatedOrderCard = page
    .getByRole("article")
    .filter({ hasText: reference ?? "" })
    .first();

  await expect(updatedOrderCard).toContainText("Annulée");
});

test("lets admin ship a paid order from the detail page", async ({ page }) => {
  await page.goto("/boutique/pochette-sable");

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Produit simple" }) });

  await offerCard.getByLabel("Quantité").fill("1");
  await offerCard.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_status=added$/);

  await page.goto("/checkout");

  await page.locator('input[name="customerFirstName"]').fill("Sarah");
  await page.locator('input[name="customerLastName"]').fill("Bodin");
  await page.locator('input[name="customerEmail"]').fill("sarah.orders@example.com");
  await page
    .locator('input[name="shippingAddressLine1"]')
    .fill("22 rue de Rennes");
  await page.locator('input[name="shippingPostalCode"]').fill("75006");
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
  markOrderAsPaid(reference ?? "");

  await loginAsSeedAdmin(page);
  await page.goto("/admin/orders");

  const createdOrderCard = page
    .getByRole("article")
    .filter({ hasText: reference ?? "" })
    .first();

  await createdOrderCard.getByRole("link", { name: "Voir le détail" }).click();
  await expect(page.getByText("Payée", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Commande payée" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Marquer en préparation" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Marquer en préparation" }).click();
  await expect(page).toHaveURL(/order_status=updated$/);
  await expect(page.getByText("En préparation", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Commande en préparation" })
  ).toBeVisible();

  await page.getByLabel("Référence de suivi optionnelle").fill("COL-123456");
  await page.getByRole("button", { name: "Marquer comme expédiée" }).click();

  await expect(page).toHaveURL(/order_status=shipped$/);
  await expect(page.getByText("Expédiée", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText(/Expédiée le /)
  ).toBeVisible();
  await expect(
    page.getByText("Référence de suivi : COL-123456")
  ).toBeVisible();
  await expect(
    page.getByText("Aucune autre action n'est disponible pour cette commande.")
  ).toBeVisible();
});
