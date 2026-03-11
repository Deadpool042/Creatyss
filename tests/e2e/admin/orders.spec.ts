import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("shows a created order in the admin list and detail", async ({ page }) => {
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
  await expect(page.getByText("alice.orders@example.com")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pochette Sable" })).toBeVisible();
  await expect(page.getByText("En attente", { exact: true })).toBeVisible();
  await expect(page.getByText("Paiement en attente")).toBeVisible();
  await expect(page.getByText("Provider : stripe")).toBeVisible();
});
