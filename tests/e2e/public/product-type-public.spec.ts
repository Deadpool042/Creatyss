import { expect, test } from "@playwright/test";
import { resetSimpleProductCatalogState } from "../order-db";

test.beforeEach(() => {
  resetSimpleProductCatalogState();
});

test("renders a simple product as a single purchasable offer", async ({
  page
}) => {
  await page.goto("/boutique/pochette-sable");

  await expect(
    page.getByRole("heading", { level: 2, name: "Produit disponible" })
  ).toBeVisible();
  await expect(
    page.getByText("Ce produit est disponible à l'achat.")
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Informations de vente" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Retrouvez ici le prix, le stock et les informations utiles pour commander ce produit simple."
    )
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Choisir une déclinaison" })
  ).toHaveCount(0);

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Produit simple" }) });

  await expect(offerCard.getByText(/^Disponible$/)).toBeVisible();
  await expect(
    offerCard.getByText(
      "Choisissez la quantité puis ajoutez le produit au panier."
    )
  ).toBeVisible();
  await expect(
    offerCard.getByRole("button", { name: "Ajouter au panier" })
  ).toBeVisible();
});

test("shows a discreet unavailable state for a simple product", async ({
  page
}) => {
  await page.goto("/boutique/besace-nuit");

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Produit temporairement indisponible"
    })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Informations de vente" })
  ).toBeVisible();

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Produit simple" }) });

  await expect(
    offerCard.getByText(/^Temporairement indisponible$/)
  ).toBeVisible();
  await expect(
    offerCard.getByText("Cette offre est temporairement indisponible.")
  ).toBeVisible();
  await expect(
    offerCard.getByRole("button", { name: "Ajouter au panier" })
  ).toHaveCount(0);
});
