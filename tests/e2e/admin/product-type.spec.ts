import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

function uniqueSuffix(): string {
  return Date.now().toString();
}

test("keeps simple products focused on a single sellable offer and refuses unsafe conversion", async ({
  page
}) => {
  test.setTimeout(90_000);

  const suffix = uniqueSuffix();
  const productName = `Produit simple ${suffix}`;
  const productSlug = `produit-simple-${suffix}`;

  await loginAsSeedAdmin(page);
  await page.goto("/admin/products/new");

  await page.getByLabel("Nom").fill(productName);
  await page.getByLabel("Slug").fill(productSlug);
  await page.getByLabel("Type de produit").selectOption("simple");
  await page.getByRole("button", { name: "Creer le produit" }).click();

  await expect(page).toHaveURL(/\/admin\/products\/[0-9]+\?product_status=created$/);
  await expect(page.getByText("Produit cree avec succes.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Offre vendable", exact: true })
  ).toBeVisible();

  const variantCreateForm = page
    .locator("form")
    .filter({
      has: page.getByRole("button", { name: "Definir l'offre vendable" })
    })
    .first();

  await variantCreateForm.getByLabel("SKU").fill(`SKU-SIMPLE-${suffix}`);
  await variantCreateForm.getByLabel("Prix", { exact: true }).fill("49");
  await variantCreateForm.getByLabel("Statut").selectOption("published");
  await variantCreateForm.getByLabel("Stock disponible").fill("3");
  await variantCreateForm.getByLabel("Nom de la variante").fill("Version unique");
  await variantCreateForm.getByLabel("Nom de couleur").fill("Naturel");
  await variantCreateForm
    .getByRole("button", { name: "Definir l'offre vendable" })
    .click();

  await expect(page).toHaveURL(/variant_status=created$/);
  await expect(page.getByText("Variante creee avec succes.")).toBeVisible();
  await expect(
    page.getByText(
      "Ce produit simple utilise deja son offre vendable unique. Modifiez-la ci-dessous."
    )
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Definir l'offre vendable" })
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Enregistrer l'offre vendable" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Supprimer l'offre vendable" }).click();

  await expect(
    page.getByText("Un produit simple doit conserver son offre vendable unique.")
  ).toBeVisible();

  await page.goto("/admin/products");

  const productCard = page.getByRole("article").filter({
    hasText: "Sac Camel"
  });

  await productCard.getByRole("link", { name: "Modifier le produit" }).click();
  await expect(page).toHaveURL(/\/admin\/products\/[0-9]+$/);

  await page.getByLabel("Type de produit").selectOption("simple");
  await page.getByRole("button", { name: "Enregistrer le produit" }).click();

  await expect(
    page
      .getByText("Un produit simple ne peut avoir qu'une seule declinaison vendable.")
      .first()
  ).toBeVisible();
});
