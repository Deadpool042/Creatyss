import { expect, test } from "@playwright/test";
import { createLegacyVariantForProduct } from "../product-db";
import { loginAsSeedAdmin } from "./admin-auth";
import {
  createSimpleAdminProduct,
  createUniqueAdminProductIdentity,
  getAdminProductDetailUrlWithoutSearch,
  getSimpleOfferForm,
  openAdminProductFromList,
} from "./product-test-helpers";

test.skip(
  true,
  "Legacy product spec quarantined: migrate to wizard/edit current UI before re-enabling."
);

test("updates a native simple offer and keeps a single legacy variant in sync", async ({
  page,
}) => {
  test.setTimeout(90_000);

  const product = createUniqueAdminProductIdentity({
    namePrefix: "Produit simple sync",
    slugPrefix: "produit-simple-sync",
  });
  const initialSku = `SYNC-${product.suffix}-INITIAL`;
  const updatedSku = `SYNC-${product.suffix}-UPDATED`;

  await loginAsSeedAdmin(page);
  await test.step("crée un produit simple publié", async () => {
    await createSimpleAdminProduct(page, {
      name: product.name,
      slug: product.slug,
      status: "published",
    });

    await expect(page).toHaveURL(/\/admin\/products\/[0-9]+\?product_status=created$/);
  });

  await test.step("injecte une déclinaison legacy unique puis recharge le détail", async () => {
    createLegacyVariantForProduct({
      productSlug: product.slug,
      name: "Version unique",
      colorName: "Sable",
      colorHex: "#D8C3A5",
      sku: initialSku,
      price: "89.00",
      compareAtPrice: "99.00",
      stockQuantity: 4,
      isDefault: true,
      status: "published",
    });

    await page.goto(getAdminProductDetailUrlWithoutSearch(page.url()));
  });

  await test.step("met à jour les informations de vente natives", async () => {
    const simpleOfferForm = getSimpleOfferForm(page);

    await expect(simpleOfferForm.getByLabel("SKU")).toHaveValue(initialSku);
    await expect(
      page.getByRole("button", { name: "Enregistrer la déclinaison existante" })
    ).toHaveCount(1);

    await simpleOfferForm.getByLabel("SKU").fill(updatedSku);
    await simpleOfferForm.getByLabel("Prix", { exact: true }).fill("109");
    await simpleOfferForm.getByLabel("Prix avant réduction").fill("129");
    await simpleOfferForm.getByLabel("Stock disponible").fill("0");

    await Promise.all([
      page.waitForURL(/simple_offer_status=updated$/, { timeout: 15_000 }),
      simpleOfferForm
        .getByRole("button", { name: "Enregistrer les informations de vente" })
        .click(),
    ]);

    await expect(page).toHaveURL(/simple_offer_status=updated$/);
    await expect(
      page.getByText("Les informations de vente ont été mises à jour avec succès.")
    ).toBeVisible();
  });

  await test.step("répercute la mise à jour sur la déclinaison legacy unique", async () => {
    const legacyVariantCard = page
      .locator("article.admin-variant-card")
      .filter({ hasText: updatedSku })
      .first();

    await expect(legacyVariantCard.getByLabel("SKU")).toHaveValue(updatedSku);
    await expect(legacyVariantCard.getByLabel("Prix", { exact: true })).toHaveValue("109.00");
    await expect(legacyVariantCard.getByLabel("Prix avant réduction")).toHaveValue("129.00");
    await expect(legacyVariantCard.getByLabel("Stock disponible")).toHaveValue("0");
    await expect(legacyVariantCard.getByLabel("Statut")).toHaveValue("published");
  });

  await test.step("répercute aussi la disponibilité sur la page publique", async () => {
    await page.goto(`/boutique/${product.slug}`);

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Produit temporairement indisponible",
      })
    ).toBeVisible();
    await expect(page.getByText("109.00").first()).toBeVisible();
    await expect(page.getByText("Prix avant réduction : 129.00")).toBeVisible();
    await expect(page.getByText("Temporairement indisponible").first()).toBeVisible();
  });
});

test("updates variant stock and reflects simple availability on the product page", async ({
  page,
}) => {
  await loginAsSeedAdmin(page);
  await page.goto("/admin/products");

  await test.step("ouvre le produit seed depuis la liste admin", async () => {
    await openAdminProductFromList(page, "Sac Camel");

    await expect(page).toHaveURL(/\/admin\/products\/[0-9]+$/);
  });

  await test.step("met le stock à zéro et vérifie l'indisponibilité", async () => {
    const variantCard = page
      .locator("article.admin-variant-card")
      .filter({ hasText: "SKU SAC-CAMEL-001" })
      .first();

    await expect(variantCard.getByText(/Disponibilité actuelle :\s*Disponible/)).toBeVisible();

    await variantCard.getByLabel("Stock disponible").fill("0");

    await Promise.all([
      page.waitForURL(/variant_status=updated$/, { timeout: 15_000 }),
      variantCard.getByRole("button", { name: "Enregistrer la déclinaison" }).click(),
    ]);

    await expect(page).toHaveURL(/variant_status=updated$/);
    await expect(page.getByText("Déclinaison mise à jour avec succès.")).toBeVisible();
    await expect(
      variantCard.getByText(/Disponibilité actuelle :\s*Temporairement indisponible/)
    ).toBeVisible();

    await page.goto("/boutique/sac-camel");

    await expect(page.getByText("Temporairement indisponible").first()).toBeVisible();
    await expect(page.getByText("Stock disponible :")).toHaveCount(0);
  });

  await test.step("remet du stock et vérifie le retour à la disponibilité", async () => {
    await page.goto("/admin/products");
    await openAdminProductFromList(page, "Sac Camel");

    const variantCard = page
      .locator("article.admin-variant-card")
      .filter({ hasText: "SKU SAC-CAMEL-001" })
      .first();

    await variantCard.getByLabel("Stock disponible").fill("5");

    await Promise.all([
      page.waitForURL(/variant_status=updated$/, { timeout: 15_000 }),
      variantCard.getByRole("button", { name: "Enregistrer la déclinaison" }).click(),
    ]);

    await expect(page).toHaveURL(/variant_status=updated$/);
    await expect(variantCard.getByText(/Disponibilité actuelle :\s*Disponible/)).toBeVisible();

    await page.goto("/boutique/sac-camel");
    await expect(page.getByText("Disponible").first()).toBeVisible();
  });
});
