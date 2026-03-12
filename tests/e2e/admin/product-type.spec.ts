import { expect, test } from "@playwright/test";
import { createLegacyVariantForProduct } from "../product-db";
import { loginAsSeedAdmin } from "./admin-auth";
import {
  createSimpleAdminProduct,
  createUniqueAdminProductIdentity,
  getAdminProductDetailUrlWithoutSearch,
  getSimpleOfferForm,
  openAdminProductFromList
} from "./product-test-helpers";

test("edits a simple product natively without creating a legacy variant", async ({
  page
}) => {
  test.setTimeout(90_000);

  const product = createUniqueAdminProductIdentity({
    namePrefix: "Produit simple",
    slugPrefix: "produit-simple"
  });

  await loginAsSeedAdmin(page);
  await test.step("crée un produit simple depuis l'admin", async () => {
    await createSimpleAdminProduct(page, {
      name: product.name,
      slug: product.slug
    });

    await expect(page).toHaveURL(
      /\/admin\/products\/[0-9]+\?product_status=created$/
    );
    await expect(page.getByText("Produit créé avec succès.")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Informations de vente" })
    ).toBeVisible();
    await expect(getSimpleOfferForm(page)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Données existantes" })
    ).toHaveCount(0);
  });

  await test.step("enregistre les informations de vente natives", async () => {
    const simpleOfferForm = getSimpleOfferForm(page);

    await simpleOfferForm.getByLabel("SKU").fill(`SIMPLE-${product.suffix}`);
    await simpleOfferForm.getByLabel("Prix", { exact: true }).fill("49");
    await simpleOfferForm.getByLabel("Prix barré").fill("59");
    await simpleOfferForm.getByLabel("Stock disponible").fill("3");

    await Promise.all([
      page.waitForURL(/simple_offer_status=updated$/, { timeout: 15_000 }),
      simpleOfferForm
        .getByRole("button", { name: "Enregistrer les informations de vente" })
        .click()
    ]);

    await expect(page).toHaveURL(/simple_offer_status=updated$/);
    await expect(
      page.getByText("Les informations de vente ont été mises à jour avec succès.")
    ).toBeVisible();
    await expect(simpleOfferForm.getByLabel("SKU")).toHaveValue(
      `SIMPLE-${product.suffix}`
    );
    await expect(
      simpleOfferForm.getByLabel("Prix", { exact: true })
    ).toHaveValue("49.00");
  });
});

test("shows a clear incoherent state when a simple product has multiple legacy variants", async ({
  page
}) => {
  test.setTimeout(90_000);

  const product = createUniqueAdminProductIdentity({
    namePrefix: "Produit simple incoherent",
    slugPrefix: "produit-simple-incoherent"
  });

  await loginAsSeedAdmin(page);
  await test.step("crée un produit simple", async () => {
    await createSimpleAdminProduct(page, {
      name: product.name,
      slug: product.slug
    });

    await expect(page).toHaveURL(
      /\/admin\/products\/[0-9]+\?product_status=created$/
    );
  });

  await test.step("injecte deux déclinaisons legacy puis recharge la page détail", async () => {
    createLegacyVariantForProduct({
      productSlug: product.slug,
      name: "Version 1",
      colorName: "Naturel",
      colorHex: "#C19A6B",
      sku: `INCOHERENT-${product.suffix}-A`,
      price: "49.00",
      compareAtPrice: null,
      stockQuantity: 2,
      isDefault: true,
      status: "published"
    });
    createLegacyVariantForProduct({
      productSlug: product.slug,
      name: "Version 2",
      colorName: "Noir",
      colorHex: "#1F1F1F",
      sku: `INCOHERENT-${product.suffix}-B`,
      price: "59.00",
      compareAtPrice: null,
      stockQuantity: 1,
      isDefault: false,
      status: "draft"
    });

    await page.goto(getAdminProductDetailUrlWithoutSearch(page.url()));
  });

  await test.step("affiche l'état incohérent et bloque l'édition native", async () => {
    await expect(
      page.getByText(
        "Plusieurs déclinaisons sont encore associées à ce produit simple. Corrigez d'abord cet état dans les données existantes avant de modifier les informations de vente."
      )
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Enregistrer les informations de vente" })
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Déclinaisons existantes" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Enregistrer la déclinaison existante" })
    ).toHaveCount(2);
  });
});

test("refuses unsafe conversion from variable to simple when several variants exist", async ({
  page
}) => {
  await loginAsSeedAdmin(page);
  await page.goto("/admin/products");

  await test.step("ouvre le produit avec déclinaisons depuis la liste admin", async () => {
    await openAdminProductFromList(page, "Sac Camel");

    await expect(page).toHaveURL(/\/admin\/products\/[0-9]+$/);
  });

  await test.step("refuse le passage en produit simple", async () => {
    await page.getByLabel("Type de produit").selectOption("simple");
    await page.getByRole("button", { name: "Enregistrer le produit" }).click();

    await expect(
      page
        .getByText("Un produit simple ne peut avoir qu'une seule déclinaison.")
        .first()
    ).toBeVisible();
  });
});
