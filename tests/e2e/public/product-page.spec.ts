import { expect, test } from "@playwright/test";

test("keeps variable products focused on multiple sellable offers", async ({
  page
}) => {
  await page.goto("/boutique/cabas-moka");

  await expect(
    page.getByRole("heading", { level: 2, name: "Produit disponible" })
  ).toBeVisible();
  await expect(
    page.getByText("Choisissez une déclinaison disponible ci-dessous.")
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Choisir une déclinaison" })
  ).toBeVisible();

  const mokaVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Moka" }) });

  await expect(mokaVariant.getByText("Par défaut")).toBeVisible();
  await expect(mokaVariant.getByText("Disponible", { exact: true })).toBeVisible();
  await expect(
    mokaVariant.getByText(
      "Sélectionnez une quantité puis ajoutez cette déclinaison au panier."
    )
  ).toBeVisible();
  await expect(
    mokaVariant.getByRole("button", { name: "Ajouter au panier" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "Espresso" })
  ).toBeVisible();
});
