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

  await expect(page.locator("article, .empty-state").first()).toBeVisible();
});
