import { expect, test, type Page } from "@playwright/test";
import { ensureCommerceSmokeFixture } from "../commerce-db";

type Fixture = Awaited<ReturnType<typeof ensureCommerceSmokeFixture>>;

async function addFixtureProductToCart(page: Page, fixture: Fixture): Promise<void> {
  await page.goto(`/boutique/${fixture.productSlug}`);
  await expect(page.getByRole("heading", { name: fixture.productName }).first()).toBeVisible();

  await page.getByRole("button", { name: "Ajouter au panier" }).first().click();

  // Signal fiable de l'ajout : le toast fiche produit. Les assertions sur
  // ?cart_status=added sont racées (le composant toast retire le paramètre).
  await expect(page.getByText("Ajouté au panier.").first()).toBeVisible({ timeout: 10_000 });
}

test("adds, updates and removes a cart line from the product page", async ({ page }) => {
  const fixture = await ensureCommerceSmokeFixture();

  await addFixtureProductToCart(page, fixture);

  await page.goto("/panier");
  await expect(page.getByRole("heading", { level: 1, name: "Votre panier" })).toBeVisible();
  await expect(page.getByText(fixture.productName).first()).toBeVisible();

  // Mise à jour de quantité — l'input est visible côté panier.
  await page.locator('input[name="quantity"]').first().fill("2");
  await page.getByRole("button", { name: "Mettre à jour la quantité" }).click();

  await expect(page).toHaveURL(/\/panier\?status=updated$/);
  await expect(page.getByText("Quantité du panier mise à jour.")).toBeVisible();
  await expect(page.locator('input[name="quantity"]').first()).toHaveValue("2");

  await page.getByRole("button", { name: "Supprimer la ligne" }).click();

  await expect(page).toHaveURL(/\/panier\?status=removed$/);
  await expect(page.getByText("Ligne retirée du panier.")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Aucun article n'a encore été ajouté au panier",
    })
  ).toBeVisible();
});
