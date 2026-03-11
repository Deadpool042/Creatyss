import { expect, test } from "@playwright/test";

test("surfaces a clearer purchase summary for an available product", async ({
  page
}) => {
  await page.goto("/boutique/pochette-sable");

  await expect(
    page.getByRole("heading", { level: 2, name: "Produit disponible" })
  ).toBeVisible();
  await expect(
    page.getByText("Choisissez une declinaison disponible ci-dessous.")
  ).toBeVisible();

  const sableVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Sable" }) });

  await expect(sableVariant.getByText("Par defaut")).toBeVisible();
  await expect(sableVariant.getByText("Disponible", { exact: true })).toBeVisible();
  await expect(
    sableVariant.getByText(
      "Selectionnez une quantite puis ajoutez cette declinaison au panier."
    )
  ).toBeVisible();
  await expect(
    sableVariant.getByRole("button", { name: "Ajouter au panier" })
  ).toBeVisible();
});

test("keeps the unavailable state useful and discreet for an unavailable product", async ({
  page
}) => {
  await page.goto("/boutique/besace-nuit");

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Produit temporairement indisponible"
    })
  ).toBeVisible();

  const nuitVariant = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Nuit" }) });

  await expect(
    nuitVariant.getByText("Temporairement indisponible", { exact: true })
  ).toBeVisible();
  await expect(
    nuitVariant.getByText(
      "Cette declinaison est temporairement indisponible. Choisissez une autre declinaison pour continuer."
    )
  ).toBeVisible();
  await expect(
    nuitVariant.getByRole("button", { name: "Ajouter au panier" })
  ).toHaveCount(0);
});
