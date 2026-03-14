import { expect, test } from "@playwright/test";

test("surfaces featured products first on the unfiltered catalogue", async ({
  page
}) => {
  await page.goto("/boutique");

  const productCards = page.locator("main article");
  await expect(productCards.first()).toBeVisible();

  const firstThreeTitles = await productCards
    .locator("h3")
    .evaluateAll(nodes =>
      nodes.slice(0, 3).map(node => node.textContent?.trim() ?? "")
    );

  expect(firstThreeTitles).toContain("Cabas Moka");
  expect(firstThreeTitles).toContain("Sac Camel");
  expect(firstThreeTitles).toContain("Pochette Sable");

  const cabasCard = productCards.filter({
    has: page.getByRole("heading", { name: "Cabas Moka", exact: true })
  });

  await expect(cabasCard.getByText("Mis en avant")).toBeVisible();
  await expect(
    cabasCard.getByText("Disponible", { exact: true })
  ).toBeVisible();
});

test("updates listing metadata for simple catalogue filters", async ({
  page
}) => {
  await page.goto("/boutique?category=edition-atelier&availability=available");

  await expect(page).toHaveTitle(
    /Edition atelier.*Disponibles.*Boutique Creatyss/
  );

  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");

  expect(description).not.toBeNull();
  expect(description).toMatch(/catégorie Edition atelier/i);
  expect(description).toMatch(/disponibl|commande/i);
});
