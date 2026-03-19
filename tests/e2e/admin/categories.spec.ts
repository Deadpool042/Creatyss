import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("creates, updates and deletes a category", async ({ page }) => {
  const suffix = Date.now().toString();
  const categoryName = `Catégorie smoke ${suffix}`;
  const updatedCategoryName = `Catégorie smoke modifiée ${suffix}`;
  const normalizedSlug = `categorie-smoke-${suffix}`;
  const updatedSlug = `categorie-smoke-modifiee-${suffix}`;

  await loginAsSeedAdmin(page);
  await page.goto("/admin/categories/new");

  await page.getByLabel("Nom").fill(categoryName);
  await page.getByLabel("Slug").fill(`  Categorie Smoke ${suffix}  `);
  await page.getByLabel("Description").fill("Catégorie de smoke test.");
  await page.getByRole("button", { name: "Créer la catégorie" }).click();

  await expect(page).toHaveURL(/\/admin\/categories\?status=created$/);
  await expect(page.getByText("Catégorie créée avec succès.")).toBeVisible();

  const createdCategoryCard = page.getByRole("article").filter({ hasText: categoryName });

  await expect(createdCategoryCard).toContainText(normalizedSlug);
  await createdCategoryCard.getByRole("link", { name: "Modifier la catégorie" }).click();

  await expect(page).toHaveURL(/\/admin\/categories\/[0-9]+$/);

  await page.getByLabel("Nom").fill(updatedCategoryName);
  await page.getByLabel("Slug").fill(` ${updatedSlug.toUpperCase()} `);
  await page.getByRole("button", { name: "Enregistrer les modifications" }).click();

  await expect(page).toHaveURL(/\/admin\/categories\?status=updated$/);
  await expect(page.getByText("Catégorie mise à jour avec succès.")).toBeVisible();

  const updatedCategoryCard = page.getByRole("article").filter({ hasText: updatedCategoryName });

  await expect(updatedCategoryCard).toContainText(updatedSlug);
  await updatedCategoryCard.getByRole("link", { name: "Modifier la catégorie" }).click();

  await page.getByRole("button", { name: "Supprimer la catégorie" }).click();

  await expect(page).toHaveURL(/\/admin\/categories\?status=deleted$/);
  await expect(page.getByText("Catégorie supprimée avec succès.")).toBeVisible();
  await expect(page.getByText(updatedCategoryName)).toHaveCount(0);
});
