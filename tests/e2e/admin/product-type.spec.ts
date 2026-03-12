import { expect, test } from "@playwright/test";
import { createLegacyVariantForProduct } from "../product-db";
import { loginAsSeedAdmin } from "./admin-auth";

function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}

function getDetailUrlWithoutSearch(url: string): string {
  return url.replace(/\?.*$/, "");
}

test("edits a simple product natively without creating a legacy variant", async ({
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
  await page.getByRole("button", { name: "Créer le produit" }).click();

  await expect(page).toHaveURL(/\/admin\/products\/[0-9]+\?product_status=created$/);
  await expect(page.getByText("Produit créé avec succès.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Informations de vente" })).toBeVisible();
  await expect(
    page.getByText(
      "Vous pouvez enregistrer les informations de vente ici. Pour le moment, l'affichage public de ce produit reste limité tant qu'aucune déclinaison existante n'est associée."
    )
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Définir les informations de vente" })
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Données existantes" })
  ).toHaveCount(0);

  const simpleOfferForm = page
    .locator("form")
    .filter({
      has: page.getByRole("button", { name: "Enregistrer les informations de vente" })
    })
    .first();

  await simpleOfferForm.getByLabel("SKU").fill(`SIMPLE-${suffix}`);
  await simpleOfferForm.getByLabel("Prix", { exact: true }).fill("49");
  await simpleOfferForm.getByLabel("Prix barré").fill("59");
  await simpleOfferForm.getByLabel("Stock disponible").fill("3");
  await simpleOfferForm
    .getByRole("button", { name: "Enregistrer les informations de vente" })
    .click();

  await expect(page).toHaveURL(/simple_offer_status=updated$/);
  await expect(
    page.getByText("Les informations de vente ont été mises à jour avec succès.")
  ).toBeVisible();
  await expect(simpleOfferForm.getByLabel("SKU")).toHaveValue(`SIMPLE-${suffix}`);
  await expect(simpleOfferForm.getByLabel("Prix", { exact: true })).toHaveValue(
    "49.00"
  );
});

test("shows a clear incoherent state when a simple product has multiple legacy variants", async ({
  page
}) => {
  test.setTimeout(90_000);

  const suffix = uniqueSuffix();
  const productName = `Produit simple incoherent ${suffix}`;
  const productSlug = `produit-simple-incoherent-${suffix}`;

  await loginAsSeedAdmin(page);
  await page.goto("/admin/products/new");

  await page.getByLabel("Nom").fill(productName);
  await page.getByLabel("Slug").fill(productSlug);
  await page.getByLabel("Type de produit").selectOption("simple");
  await page.getByRole("button", { name: "Créer le produit" }).click();

  await expect(page).toHaveURL(/\/admin\/products\/[0-9]+\?product_status=created$/);

  createLegacyVariantForProduct({
    productSlug,
    name: "Version 1",
    colorName: "Naturel",
    colorHex: "#C19A6B",
    sku: `INCOHERENT-${suffix}-A`,
    price: "49.00",
    compareAtPrice: null,
    stockQuantity: 2,
    isDefault: true,
    status: "published"
  });
  createLegacyVariantForProduct({
    productSlug,
    name: "Version 2",
    colorName: "Noir",
    colorHex: "#1F1F1F",
    sku: `INCOHERENT-${suffix}-B`,
    price: "59.00",
    compareAtPrice: null,
    stockQuantity: 1,
    isDefault: false,
    status: "draft"
  });

  await page.goto(getDetailUrlWithoutSearch(page.url()));

  await expect(
    page.getByText(
      "Plusieurs déclinaisons sont encore associées à ce produit simple. Corrigez d'abord cet état dans les données existantes avant de modifier les informations de vente."
    )
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Enregistrer les informations de vente" })
  ).toHaveCount(0);
  await expect(
    page.getByText("Données existantes", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Enregistrer la déclinaison existante" })
  ).toHaveCount(2);
});

test("refuses unsafe conversion from variable to simple when several variants exist", async ({
  page
}) => {
  await loginAsSeedAdmin(page);
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
      .getByText("Un produit simple ne peut avoir qu'une seule déclinaison.")
      .first()
  ).toBeVisible();
});
