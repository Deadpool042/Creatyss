import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("creates, updates and deletes a category", async ({ page }) => {
  const suffix = Date.now().toString();
  const categoryName = `Categorie smoke ${suffix}`;
  const updatedCategoryName = `Categorie smoke modifiee ${suffix}`;
  const normalizedSlug = `categorie-smoke-${suffix}`;
  const updatedSlug = `categorie-smoke-modifiee-${suffix}`;

  await loginAsSeedAdmin(page);
  await page.goto("/admin/categories/new");

  await page.getByLabel("Nom").fill(categoryName);
  await page.getByLabel("Slug").fill(`  Categorie Smoke ${suffix}  `);
  await page.getByLabel("Description").fill("Categorie de smoke test.");
  await page.getByRole("button", { name: "Creer la categorie" }).click();

  await expect(page).toHaveURL(/\/admin\/categories\?status=created$/);
  await expect(page.getByText("Categorie creee avec succes.")).toBeVisible();

  const createdCategoryCard = page
    .getByRole("article")
    .filter({ hasText: categoryName });

  await expect(createdCategoryCard).toContainText(normalizedSlug);
  await createdCategoryCard
    .getByRole("link", { name: "Modifier la categorie" })
    .click();

  await expect(page).toHaveURL(/\/admin\/categories\/[0-9]+$/);

  await page.getByLabel("Nom").fill(updatedCategoryName);
  await page.getByLabel("Slug").fill(` ${updatedSlug.toUpperCase()} `);
  await page.getByRole("button", { name: "Enregistrer les modifications" }).click();

  await expect(page).toHaveURL(/\/admin\/categories\?status=updated$/);
  await expect(
    page.getByText("Categorie mise a jour avec succes.")
  ).toBeVisible();

  const updatedCategoryCard = page
    .getByRole("article")
    .filter({ hasText: updatedCategoryName });

  await expect(updatedCategoryCard).toContainText(updatedSlug);
  await updatedCategoryCard
    .getByRole("link", { name: "Modifier la categorie" })
    .click();

  await page.getByRole("button", { name: "Supprimer la categorie" }).click();

  await expect(page).toHaveURL(/\/admin\/categories\?status=deleted$/);
  await expect(
    page.getByText("Categorie supprimee avec succes.")
  ).toBeVisible();
  await expect(page.getByText(updatedCategoryName)).toHaveCount(0);
});
