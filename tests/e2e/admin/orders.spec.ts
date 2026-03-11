import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import { markOrderAsPaid } from "../order-db";

test("lets admin cancel a pending order from the detail page", async ({ page }) => {
  await page.goto("/boutique/pochette-sable");

  const sableVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Sable" }) });

  await sableVariant.getByLabel("Quantite").fill("1");
  await sableVariant.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_status=added$/);

  await page.goto("/checkout");
  await expect(
    page.getByRole("heading", { name: "Checkout invite" })
  ).toBeVisible();

  await page.locator('input[name="customerFirstName"]').fill("Alice");
  await page.locator('input[name="customerLastName"]').fill("Martin");
  await page.locator('input[name="customerEmail"]').fill("alice.orders@example.com");
  await page
    .locator('input[name="shippingAddressLine1"]')
    .fill("18 rue du Commerce");
  await page.locator('input[name="shippingPostalCode"]').fill("75015");
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

  await loginAsSeedAdmin(page);
  await page.goto("/admin/orders");

  const createdOrderCard = page
    .getByRole("article")
    .filter({ hasText: reference ?? "" })
    .first();

  await expect(createdOrderCard).toContainText(reference ?? "");
  await expect(createdOrderCard).toContainText("Paiement en attente");
  await createdOrderCard.getByRole("link", { name: "Voir le detail" }).click();

  await expect(page).toHaveURL(/\/admin\/orders\/[0-9]+$/);
  await expect(
    page.getByRole("heading", { name: `Commande ${reference}` })
  ).toBeVisible();
  await expect(page.getByText("alice.orders@example.com").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pochette Sable" })).toBeVisible();
  await expect(page.getByText("En attente", { exact: true })).toBeVisible();
  await expect(page.getByText("Paiement en attente")).toBeVisible();
  await expect(page.getByText("Provider : stripe")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Marquer en preparation" })
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Annuler la commande" }).click();

  await expect(page).toHaveURL(/order_status=updated$/);
  await expect(
    page.getByText("Le statut de la commande a ete mis a jour.")
  ).toBeVisible();
  await expect(page.getByText("Annulee", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Aucune autre action n'est disponible pour cette commande.")
  ).toBeVisible();

  await page.goto("/admin/orders");
  const updatedOrderCard = page
    .getByRole("article")
    .filter({ hasText: reference ?? "" })
    .first();

  await expect(updatedOrderCard).toContainText("Annulee");
});

test("lets admin ship a paid order from the detail page", async ({ page }) => {
  await page.goto("/boutique/pochette-sable");

  const sableVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Sable" }) });

  await sableVariant.getByLabel("Quantite").fill("1");
  await sableVariant.getByRole("button", { name: "Ajouter au panier" }).click();
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

  await page.getByRole("button", { name: "Creer la commande" }).click();
  await expect(page).toHaveURL(/\/checkout\/confirmation\/CRY-[A-Z0-9]{10}$/);

  const reference = await page
    .locator("article")
    .filter({ hasText: "Reference" })
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

  await createdOrderCard.getByRole("link", { name: "Voir le detail" }).click();
  await expect(page.getByText("Payee", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Marquer en preparation" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Marquer en preparation" }).click();
  await expect(page).toHaveURL(/order_status=updated$/);
  await expect(page.getByText("En preparation", { exact: true })).toBeVisible();

  await page.getByLabel("Reference de suivi optionnelle").fill("COL-123456");
  await page.getByRole("button", { name: "Marquer comme expediee" }).click();

  await expect(page).toHaveURL(/order_status=shipped$/);
  await expect(page.getByText("Expediee", { exact: true })).toBeVisible();
  await expect(
    page.getByText(/Expediee le /)
  ).toBeVisible();
  await expect(
    page.getByText("Reference de suivi : COL-123456")
  ).toBeVisible();
  await expect(
    page.getByText("Aucune autre action n'est disponible pour cette commande.")
  ).toBeVisible();
});
