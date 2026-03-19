import { expect, test } from "@playwright/test";

test("searches published products by name or variant color", async ({ page }) => {
  await page.goto("/boutique");

  await page.getByLabel("Recherche").fill("Sable");
  await page.getByRole("button", { name: "Rechercher" }).click();

  await expect(page).toHaveURL(/\/boutique\?q=Sable&category=$/);

  const resultsSummary = page.getByText(/résultats pour/i);
  await expect(resultsSummary).toContainText("Sable");

  await expect(page.getByRole("heading", { name: "Pochette Sable", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cabas Moka", exact: true })).toHaveCount(0);
});

test("shows a discreet empty state and reset link when nothing matches", async ({ page }) => {
  await page.goto("/boutique");

  await page.getByLabel("Recherche").fill("introuvable-xyz");
  await page.getByRole("button", { name: "Rechercher" }).click();

  await expect(page).toHaveURL(/\/boutique\?q=introuvable-xyz&category=$/);
  await expect(
    page.getByRole("heading", {
      name: /aucun produit ne correspond/i,
    })
  ).toBeVisible();

  await page.getByRole("link", { name: "Voir tous les produits" }).click();

  await expect(page).toHaveURL(/\/boutique$/);
  await expect(page.getByRole("heading", { name: "Pochette Sable", exact: true })).toBeVisible();
});
