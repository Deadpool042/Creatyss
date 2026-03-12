import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("affiche la page liste admin des produits avec le lien d'action et la zone de contenu", async ({
  page
}) => {
  await loginAsSeedAdmin(page);

  await page.goto("/admin/products", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/products$/);

  await expect(page.getByRole("heading", { name: "Produits" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Nouveau produit" })
  ).toBeVisible();

  const productCards = page.locator("article.admin-product-card");

  if ((await productCards.count()) > 0) {
    await expect(productCards.first()).toBeVisible();
    await expect(
      productCards.first().getByRole("link", { name: "Modifier le produit" })
    ).toBeVisible();
    return;
  }

  await expect(page.locator(".empty-state")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Le catalogue ne contient pas encore de produit"
    })
  ).toBeVisible();
});
