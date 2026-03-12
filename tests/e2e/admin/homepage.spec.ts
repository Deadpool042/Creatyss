import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("affiche la page homepage admin avec ses sections et le bouton d'enregistrement", async ({
  page
}) => {
  await loginAsSeedAdmin(page);
  await page.goto("/admin/homepage");

  await expect(page).toHaveURL(/\/admin\/homepage$/);

  await expect(
    page.getByRole("heading", { name: "Bannière principale" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Bloc éditorial" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Produits mis en avant" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Catégories mises en avant" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Articles mis en avant" })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: /enregistrer/i })
  ).toBeVisible();
});
