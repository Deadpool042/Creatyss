import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("affiche la page création produit avec le heading, le lien retour, le champ Nom et le bouton de soumission", async ({
  page
}) => {
  await loginAsSeedAdmin(page);

  await page.goto("/admin/products/new", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/products\/new$/);

  await expect(
    page.getByRole("heading", { name: "Nouveau produit" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Retour à la liste" })
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Nom" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Créer le produit" })
  ).toBeVisible();
});
