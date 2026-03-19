import { expect, test } from "@playwright/test";

test("filters published products by category and availability", async ({ page }) => {
  await page.goto("/boutique");

  await page.getByLabel("Catégorie").selectOption("edition-atelier");
  await page.getByLabel("Disponibles uniquement").check();
  await page.getByRole("button", { name: "Rechercher" }).click();

  await expect(page).toHaveURL(/\/boutique\?q=&category=edition-atelier&availability=available$/);
  await expect(page.getByText("Filtres actifs", { exact: false })).toContainText(
    "Catégorie : Edition atelier"
  );
  await expect(page.getByText("Filtres actifs", { exact: false })).toContainText(
    "Disponibles uniquement"
  );
  await expect(page.getByRole("heading", { name: "Pochette Sable" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cabas Moka" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sac Camel" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Besace Nuit" })).toHaveCount(0);
});

test("combines search with filters and keeps a simple reset path", async ({ page }) => {
  await page.goto("/boutique");

  await page.getByLabel("Recherche").fill("Moka");
  await page.getByLabel("Catégorie").selectOption("edition-atelier");
  await page.getByRole("button", { name: "Rechercher" }).click();

  await expect(page).toHaveURL(/\/boutique\?q=Moka&category=edition-atelier$/);
  await expect(page.getByRole("heading", { name: "Cabas Moka" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pochette Sable" })).toHaveCount(0);

  await page.getByRole("link", { name: "Revenir à la liste complète" }).click();

  await expect(page).toHaveURL(/\/boutique$/);
  await expect(page.getByRole("heading", { name: "Pochette Sable" })).toBeVisible();
});
