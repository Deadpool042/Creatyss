import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("affiche la page homepage admin avec ses sections et le bouton d'enregistrement", async ({
  page,
}) => {
  await loginAsSeedAdmin(page);
  await page.goto("/admin/content/homepage");

  await expect(page).toHaveURL(/\/admin\/content\/homepage$/);
  await expect(page.getByRole("heading", { name: "Édition de la page d'accueil" })).toBeVisible();

  const createButton = page.getByRole("button", { name: "Créer la page d'accueil" });
  if (await createButton.isVisible()) {
    await expect(createButton).toBeVisible();
    return;
  }

  await expect(page.getByRole("heading", { name: "Bannière principale" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Bloc éditorial" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Produits mis en avant" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Catégories mises en avant" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Articles mis en avant" })).toBeVisible();

  await expect(page.getByRole("button", { name: "Enregistrer la page d'accueil" })).toBeVisible();
});
