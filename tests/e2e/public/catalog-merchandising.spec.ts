import { expect, test } from "@playwright/test";

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
