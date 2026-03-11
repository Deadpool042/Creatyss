import { expect, test } from "@playwright/test";

test("keeps variable products focused on multiple sellable offers", async ({
  page
}) => {
  await page.goto("/boutique/cabas-moka");

  await expect(
    page.getByRole("heading", { level: 2, name: "Produit disponible" })
  ).toBeVisible();
  await expect(
    page.getByText("Choisissez une declinaison disponible ci-dessous.")
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Choisir une declinaison" })
  ).toBeVisible();

  const mokaVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Moka" }) });

  await expect(mokaVariant.getByText("Par defaut")).toBeVisible();
  await expect(mokaVariant.getByText("Disponible", { exact: true })).toBeVisible();
  await expect(
    mokaVariant.getByText(
      "Selectionnez une quantite puis ajoutez cette declinaison au panier."
    )
  ).toBeVisible();
  await expect(
    mokaVariant.getByRole("button", { name: "Ajouter au panier" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "Espresso" })
  ).toBeVisible();
});
