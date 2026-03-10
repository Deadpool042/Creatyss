import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

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

  await expect(variantCard.getByText(/^Disponible$/)).toBeVisible();

  await variantCard.getByLabel("Stock disponible").fill("0");
  await variantCard.getByRole("button", { name: "Enregistrer la variante" }).click();

  await expect(page).toHaveURL(/variant_status=updated$/);
  await expect(
    page.getByText("Variante mise a jour avec succes.")
  ).toBeVisible();
  await expect(
    variantCard.getByText(/^Temporairement indisponible$/)
  ).toBeVisible();

  await page.goto("/boutique/sac-camel");

  await expect(
    page.getByText("Temporairement indisponible").first()
  ).toBeVisible();
  await expect(page.getByText("Stock disponible :")).toHaveCount(0);

  await page.goto("/admin/products");
  await productCard.getByRole("link", { name: "Modifier le produit" }).click();

  await variantCard.getByLabel("Stock disponible").fill("5");
  await variantCard.getByRole("button", { name: "Enregistrer la variante" }).click();

  await expect(page).toHaveURL(/variant_status=updated$/);
  await expect(variantCard.getByText(/^Disponible$/)).toBeVisible();

  await page.goto("/boutique/sac-camel");
  await expect(page.getByText("Disponible").first()).toBeVisible();
});
