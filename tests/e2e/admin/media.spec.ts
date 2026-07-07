import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("affiche la page médias avec le formulaire d'import et la bibliothèque", async ({ page }) => {
  await loginAsSeedAdmin(page);
  await page.goto("/admin/catalog/media");

  await expect(page.getByRole("heading", { name: "Bibliothèque médias" })).toBeVisible();

  const importButton = page.getByRole("button", { name: "Importer", exact: true });
  await expect(importButton).toBeVisible();
  await importButton.click();

  const importDialog = page.getByRole("dialog");
  await expect(importDialog).toBeVisible();
  await expect(importDialog.getByRole("heading", { name: "Importer un média" })).toBeVisible();

  await expect(importDialog.locator('input[type="file"][name="file"]')).toBeVisible();

  await expect(importDialog.getByRole("button", { name: "Importer le média" })).toBeVisible();

  await expect(page.getByText("Images actives").first()).toBeVisible();
});
