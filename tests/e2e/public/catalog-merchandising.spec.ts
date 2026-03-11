import { expect, test } from "@playwright/test";

test("surfaces featured products first on the unfiltered catalogue", async ({
  page
}) => {
  await page.goto("/boutique");

  const headings = page.locator(".store-card h3");

  await expect(headings.nth(0)).toHaveText("Cabas Moka");
  await expect(headings.nth(1)).toHaveText("Sac Camel");

  const featuredCard = page.locator("article.store-card").filter({
    has: page.getByRole("heading", { name: "Cabas Moka" })
  });

  await expect(featuredCard.getByText("Mis en avant")).toBeVisible();
  await expect(featuredCard.getByText("Disponible", { exact: true })).toBeVisible();
});

test("updates listing metadata for simple catalogue filters", async ({
  page
}) => {
  await page.goto("/boutique?category=edition-atelier&availability=available");

  await expect(page).toHaveTitle(/Edition atelier.*Disponibles.*Boutique Creatyss/);

  await expect(
    page.locator('meta[name="description"]')
  ).toHaveAttribute("content", /categorie Edition atelier/i);
});
