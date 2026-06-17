import { expect, test } from "@playwright/test";

import { resetSimpleProductCatalogState } from "../order-db";

test.beforeEach(() => {
  return resetSimpleProductCatalogState();
});

test("renders a simple product as a single purchasable offer", async ({ page }) => {
  await page.goto("/boutique/pochette-sable");

  await expect(
    page.getByRole("heading", { level: 1, name: "Pochette Sable" })
  ).toBeVisible();
  await expect(page.getByRole("complementary").getByText("59,00 €", { exact: true })).toBeVisible();
  await expect(page.getByRole("complementary").getByText("En stock", { exact: true })).toBeVisible();

  await expect(page.getByRole("complementary").getByText("Quantité", { exact: true })).toBeVisible();
  await expect(page.getByRole("spinbutton")).toHaveValue("1");
  await expect(
    page.getByRole("button", { name: "Ajouter au panier" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Achat immédiat" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: "Choisir une déclinaison" })
  ).toHaveCount(0);
});

test("shows a discreet unavailable state for a simple product", async ({ page }) => {
  await page.goto("/boutique/besace-nuit");

  await expect(
    page.getByRole("heading", { level: 1, name: "Besace Nuit" })
  ).toBeVisible();
  await expect(page.getByRole("complementary").getByText("89,00 €", { exact: true })).toBeVisible();
  await expect(page.getByRole("complementary").getByText("Indisponible", { exact: true })).toBeVisible();

  await expect(page.getByRole("spinbutton")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Ajouter au panier" })
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Achat immédiat" })
  ).toHaveCount(0);

  await expect(
    page.getByRole("heading", { level: 2, name: "Choisir une déclinaison" })
  ).toHaveCount(0);
});
