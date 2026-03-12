import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("affiche la page médias avec le formulaire d'import et la bibliothèque", async ({ page }) => {
  await loginAsSeedAdmin(page);
  await page.goto("/admin/media");

  await expect(
    page.getByRole("heading", { name: "Bibliothèque médias" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Importer une image" })
  ).toBeVisible();

  await expect(page.locator('input[type="file"][name="file"]')).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Importer le média" })
  ).toBeVisible();

  const bibliothequeLocale = page.getByRole("heading", {
    name: "Bibliothèque locale"
  });
  await expect(bibliothequeLocale).toBeVisible();

  const grille = page.locator(".admin-media-grid");
  const emptyState = page.getByText("La bibliothèque est encore vide");
  await expect(grille.or(emptyState)).toBeVisible();
});
