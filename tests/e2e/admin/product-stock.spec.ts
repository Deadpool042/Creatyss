import { expect, test } from "@playwright/test";
import { createLegacyVariantForProduct } from "../product-db";
import { loginAsSeedAdmin } from "./admin-auth";

function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}

function getDetailUrlWithoutSearch(url: string): string {
  return url.replace(/\?.*$/, "");
}

test("updates a native simple offer and keeps a single legacy variant in sync", async ({
  page
}) => {
  test.setTimeout(90_000);

  const suffix = uniqueSuffix();
  const productName = `Produit simple sync ${suffix}`;
  const productSlug = `produit-simple-sync-${suffix}`;
  const initialSku = `SYNC-${suffix}-INITIAL`;
  const updatedSku = `SYNC-${suffix}-UPDATED`;

  await loginAsSeedAdmin(page);
  await page.goto("/admin/products/new");

  await page.getByLabel("Nom").fill(productName);
  await page.getByLabel("Slug").fill(productSlug);
  await page.getByLabel("Statut").selectOption("published");
  await page.getByLabel("Type de produit").selectOption("simple");
  await page.getByRole("button", { name: "Créer le produit" }).click();

  await expect(page).toHaveURL(/\/admin\/products\/[0-9]+\?product_status=created$/);

  createLegacyVariantForProduct({
    productSlug,
    name: "Version unique",
    colorName: "Sable",
    colorHex: "#D8C3A5",
    sku: initialSku,
    price: "89.00",
    compareAtPrice: "99.00",
    stockQuantity: 4,
    isDefault: true,
    status: "published"
  });

  await page.goto(getDetailUrlWithoutSearch(page.url()));

  await expect(
    page.getByText(
      "Les informations commerciales saisies ici restent synchronisées avec l'unique déclinaison déjà enregistrée. Les autres réglages de cette déclinaison restent disponibles plus bas sur la page."
    )
  ).toBeVisible();

  const simpleOfferForm = page
    .locator("form")
    .filter({
      has: page.getByRole("button", { name: "Enregistrer les informations de vente" })
    })
    .first();

  await expect(simpleOfferForm.getByLabel("SKU")).toHaveValue(initialSku);
  await simpleOfferForm.getByLabel("SKU").fill(updatedSku);
  await simpleOfferForm.getByLabel("Prix", { exact: true }).fill("109");
  await simpleOfferForm.getByLabel("Prix barré").fill("129");
  await simpleOfferForm.getByLabel("Stock disponible").fill("0");
  await simpleOfferForm
    .getByRole("button", { name: "Enregistrer les informations de vente" })
    .click();

  await expect(page).toHaveURL(/simple_offer_status=updated$/);
  await expect(
    page.getByText("Les informations de vente ont été mises à jour avec succès.")
  ).toBeVisible();

  const legacyVariantCard = page.getByRole("article").filter({
    hasText: updatedSku
  });

  await expect(legacyVariantCard.getByLabel("SKU")).toHaveValue(updatedSku);
  await expect(
    legacyVariantCard.getByLabel("Prix", { exact: true })
  ).toHaveValue("109.00");
  await expect(legacyVariantCard.getByLabel("Prix barré")).toHaveValue(
    "129.00"
  );
  await expect(legacyVariantCard.getByLabel("Stock disponible")).toHaveValue("0");
  await expect(legacyVariantCard.getByLabel("Statut")).toHaveValue("published");

  await page.goto(`/boutique/${productSlug}`);

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Produit temporairement indisponible"
    })
  ).toBeVisible();
  await expect(page.getByText("109.00").first()).toBeVisible();
  await expect(page.getByText("Prix barré : 129.00")).toBeVisible();
  await expect(
    page.getByText("Temporairement indisponible").first()
  ).toBeVisible();
});

test("updates variant stock and reflects simple availability on the product page", async ({
  page
}) => {
  await loginAsSeedAdmin(page);
  await page.goto("/admin/products");

  const productCard = page.getByRole("article").filter({
    hasText: "Sac Camel"
  });

  await productCard.getByRole("link", { name: "Modifier le produit" }).click();
  await expect(page).toHaveURL(/\/admin\/products\/[0-9]+$/);

  const variantCard = page.getByRole("article").filter({
    hasText: "SKU SAC-CAMEL-001"
  });

  await expect(
    variantCard.getByText(/Disponibilité actuelle :\s*Disponible/)
  ).toBeVisible();

  await variantCard.getByLabel("Stock disponible").fill("0");
  await variantCard
    .getByRole("button", { name: "Enregistrer la déclinaison" })
    .click();

  await expect(page).toHaveURL(/variant_status=updated$/);
  await expect(
    page.getByText("Déclinaison mise à jour avec succès.")
  ).toBeVisible();
  await expect(
    variantCard.getByText(
      /Disponibilité actuelle :\s*Temporairement indisponible/
    )
  ).toBeVisible();

  await page.goto("/boutique/sac-camel");

  await expect(
    page.getByText("Temporairement indisponible").first()
  ).toBeVisible();
  await expect(page.getByText("Stock disponible :")).toHaveCount(0);

  await page.goto("/admin/products");
  await productCard.getByRole("link", { name: "Modifier le produit" }).click();

  await variantCard.getByLabel("Stock disponible").fill("5");
  await variantCard
    .getByRole("button", { name: "Enregistrer la déclinaison" })
    .click();

  await expect(page).toHaveURL(/variant_status=updated$/);
  await expect(
    variantCard.getByText(/Disponibilité actuelle :\s*Disponible/)
  ).toBeVisible();

  await page.goto("/boutique/sac-camel");
  await expect(page.getByText("Disponible").first()).toBeVisible();
});
