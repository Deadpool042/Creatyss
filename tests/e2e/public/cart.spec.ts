import { expect, test } from "@playwright/test";
import { resetSimpleProductCatalogState } from "../order-db";

test.beforeEach(() => {
  resetSimpleProductCatalogState();
});

test("adds, updates and removes a cart line from the product page", async ({ page }) => {
  await page.goto("/boutique/pochette-sable");

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Produit simple" }) });

  await offerCard.getByLabel("Quantité").fill("1");
  await offerCard.getByRole("button", { name: "Ajouter au panier" }).click();

  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_status=added$/);
  await expect(page.getByText("Article ajouté au panier.")).toBeVisible();

  await page.getByRole("link", { name: "Voir le panier" }).click();

  await expect(page).toHaveURL(/\/panier$/);
  await expect(page.getByRole("heading", { name: "Votre panier" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pochette Sable" })).toBeVisible();
  await expect(page.getByText("Sable · Sable · #D8C3A5")).toBeVisible();

  await page.getByLabel("Quantité").fill("2");
  await page.getByRole("button", { name: "Mettre à jour la quantité" }).click();

  await expect(page).toHaveURL(/\/panier\?status=updated$/);
  await expect(page.getByText("Quantité du panier mise à jour.")).toBeVisible();
  await expect(page.getByLabel("Quantité")).toHaveValue("2");

  await page.getByRole("button", { name: "Supprimer la ligne" }).click();

  await expect(page).toHaveURL(/\/panier\?status=removed$/);
  await expect(page.getByText("Ligne retirée du panier.")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Aucun article n'a encore été ajouté au panier",
    })
  ).toBeVisible();
});

test("rejects a quantity above available stock", async ({ page }) => {
  await page.goto("/boutique/pochette-sable");

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Produit simple" }) });

  await offerCard.getByLabel("Quantité").fill("13");
  await offerCard.getByRole("button", { name: "Ajouter au panier" }).click();

  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_error=insufficient_stock$/);
  await expect(
    page.getByText("Le stock disponible est insuffisant pour cette quantité.")
  ).toBeVisible();
});
