import { expect, test } from "@playwright/test";

test("renders a simple product as a single purchasable offer", async ({
  page
}) => {
  await page.goto("/boutique/pochette-sable");

  await expect(
    page.getByRole("heading", { level: 2, name: "Produit disponible" })
  ).toBeVisible();
  await expect(
    page.getByText("Cette offre unique est disponible a l'achat.")
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Offre vendable" })
  ).toBeVisible();
  await expect(
    page.getByText("Ce produit simple se presente comme une offre vendable unique.")
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Choisir une declinaison" })
  ).toHaveCount(0);

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Offre vendable" }) });

  await expect(offerCard.getByText(/^Disponible$/)).toBeVisible();
  await expect(
    offerCard.getByText(
      "Choisissez la quantite puis ajoutez le produit au panier."
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
    page.getByRole("heading", { level: 2, name: "Offre vendable" })
  ).toBeVisible();

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Offre vendable" }) });

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
