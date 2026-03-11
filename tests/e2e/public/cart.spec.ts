import { expect, test } from "@playwright/test";

test("adds, updates and removes a cart line from the product page", async ({
  page
}) => {
  await page.goto("/boutique/pochette-sable");

  const sableVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Sable" }) });

  await sableVariant.getByLabel("Quantite").fill("1");
  await sableVariant.getByRole("button", { name: "Ajouter au panier" }).click();

  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_status=added$/);
  await expect(page.getByText("Article ajoute au panier.")).toBeVisible();

  await page.getByRole("link", { name: "Voir le panier" }).click();

  await expect(page).toHaveURL(/\/panier$/);
  await expect(
    page.getByRole("heading", { name: "Panier invite" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pochette Sable" })).toBeVisible();
  await expect(page.getByText("Sable · Sable · #D8C3A5")).toBeVisible();

  await page.getByLabel("Quantite").fill("2");
  await page
    .getByRole("button", { name: "Mettre a jour la quantite" })
    .click();

  await expect(page).toHaveURL(/\/panier\?status=updated$/);
  await expect(page.getByText("Quantite du panier mise a jour.")).toBeVisible();
  await expect(page.getByLabel("Quantite")).toHaveValue("2");

  await page.getByRole("button", { name: "Supprimer la ligne" }).click();

  await expect(page).toHaveURL(/\/panier\?status=removed$/);
  await expect(page.getByText("Ligne retiree du panier.")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Aucune variante n'a encore ete ajoutee au panier"
    })
  ).toBeVisible();
});

test("rejects a quantity above available stock", async ({ page }) => {
  await page.goto("/boutique/pochette-sable");

  const sableVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Sable" }) });

  await sableVariant.getByLabel("Quantite").fill("13");
  await sableVariant.getByRole("button", { name: "Ajouter au panier" }).click();

  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_error=insufficient_stock$/);
  await expect(
    page.getByText("Le stock disponible est insuffisant pour cette quantite.")
  ).toBeVisible();
});
