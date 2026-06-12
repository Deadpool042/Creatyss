import { expect, test } from "@playwright/test";
import { ensureCommerceLowStockFixture } from "../commerce-db";

test("refuses add to cart when requested quantity exceeds available stock", async ({ page }) => {
  const fixture = await ensureCommerceLowStockFixture();

  await page.goto(`/boutique/${fixture.productSlug}`);
  await expect(page.getByRole("heading", { name: fixture.productName }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Ajouter au panier" }).first()).toBeVisible();

  // 1er ajout : consomme l'unique unité disponible (stock fixture = 1).
  await page.getByRole("button", { name: "Ajouter au panier" }).first().click();
  await expect(page.getByText("Ajouté au panier.").first()).toBeVisible({ timeout: 10_000 });

  // 2e ajout : quantité cible (2) > stock disponible (1) → refus attendu
  // (contrat : redirect ?cart_error=insufficient_stock + toast d'erreur ;
  // le query param est retiré aussitôt par le composant toast, on s'appuie
  // donc sur le message utilisateur comme signal).
  await page.getByRole("button", { name: "Ajouter au panier" }).first().click();
  await expect(
    page.getByText("Le stock disponible est insuffisant pour cette quantité.").first()
  ).toBeVisible({ timeout: 10_000 });

  // Preuve fonctionnelle : le panier contient toujours une seule ligne à
  // quantité 1 — le refus n'a rien ajouté.
  await page.goto("/panier");
  await expect(page.getByRole("heading", { level: 1, name: "Votre panier" })).toBeVisible();
  await expect(page.getByText(fixture.productName).first()).toBeVisible();

  const quantityInputs = page.locator('input[name="quantity"]');
  await expect(quantityInputs).toHaveCount(1);
  await expect(quantityInputs.first()).toHaveValue("1");
});
