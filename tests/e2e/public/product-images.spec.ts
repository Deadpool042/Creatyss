// tests/e2e/public/product-images.spec.ts
import { expect, test, type Locator, type Page } from "@playwright/test";
import { loginAsSeedAdmin } from "../admin/admin-auth";
import {
  getAdminProductDetailUrlWithoutSearch,
  openAdminProductFromList,
  uploadAdminMediaImage
} from "../admin/product-test-helpers";

const PRIMARY_IMAGE_SUBMIT_BUTTON_PATTERN =
  /^(Définir|Remplacer) l'image principale$/;

function getProductPrimaryImageBlock(page: Page): Locator {
  return page
    .locator(".admin-product-subsection")
    .filter({
      has: page.getByRole("heading", {
        exact: true,
        level: 3,
        name: "Image principale du produit"
      })
    })
    .first();
}

function getVariantCard(page: Page, variantName: string): Locator {
  return page
    .locator("article.variant-card")
    .filter({
      has: page.getByRole("heading", {
        level: 3,
        name: variantName,
        exact: true
      })
    })
    .first();
}

function getVariantPrimaryImageBlock(page: Page, variantName: string): Locator {
  const variantCard = page
    .locator("article.admin-variant-card")
    .filter({
      has: page.getByRole("heading", {
        level: 3,
        name: variantName,
        exact: true
      })
    })
    .first();

  return variantCard
    .locator(".admin-product-subsection")
    .filter({
      has: page.getByRole("heading", {
        exact: true,
        level: 3,
        name: "Image principale de la déclinaison"
      })
    })
    .first();
}

test("affiche publiquement l'image principale produit choisie dans l'admin", async ({
  page
}) => {
  test.setTimeout(90_000);

  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
  const mediaFile = `public-product-primary-${suffix}.png`;

  await loginAsSeedAdmin(page);
  await uploadAdminMediaImage(page, mediaFile);
  await openAdminProductFromList(page, "Pochette Sable");

  const productDetailUrl = getAdminProductDetailUrlWithoutSearch(page.url());
  const primaryImageBlock = getProductPrimaryImageBlock(page);

  await primaryImageBlock
    .getByLabel("Média existant")
    .selectOption({ label: `${mediaFile} · image/png` });

  await Promise.all([
    page.waitForURL(/image_status=primary_updated&image_scope=product$/, {
      timeout: 15_000
    }),
    primaryImageBlock
      .getByRole("button", { name: "Remplacer l'image principale" })
      .click()
  ]);

  await page.goto(productDetailUrl, {
    waitUntil: "domcontentloaded"
  });

  const adminImageSrc =
    (await getProductPrimaryImageBlock(page)
      .locator("img")
      .first()
      .getAttribute("src")) ?? "";

  expect(adminImageSrc).not.toBe("");

  await page.goto("/boutique/pochette-sable", {
    waitUntil: "domcontentloaded"
  });

  await expect(
    page.getByRole("heading", { name: "Image principale" })
  ).toBeVisible();
  await expect(
    page.locator(".product-gallery .product-media img")
  ).toHaveAttribute("src", adminImageSrc);
});

test("affiche publiquement l'image principale de déclinaison choisie dans l'admin", async ({
  page
}) => {
  test.setTimeout(90_000);

  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
  const mediaFile = `public-variant-primary-${suffix}.png`;

  await loginAsSeedAdmin(page);
  await uploadAdminMediaImage(page, mediaFile);
  await openAdminProductFromList(page, "Sac Camel");

  const productDetailUrl = getAdminProductDetailUrlWithoutSearch(page.url());
  const primaryImageBlock = getVariantPrimaryImageBlock(page, "Camel");

  await primaryImageBlock
    .getByLabel("Média existant")
    .selectOption({ label: `${mediaFile} · image/png` });

  await Promise.all([
    page.waitForURL(/image_status=primary_updated&image_scope=variant$/, {
      timeout: 15_000
    }),
    primaryImageBlock
      .getByRole("button", {
        name: PRIMARY_IMAGE_SUBMIT_BUTTON_PATTERN
      })
      .click()
  ]);

  await page.goto(productDetailUrl, {
    waitUntil: "domcontentloaded"
  });

  const adminImageSrc =
    (await getVariantPrimaryImageBlock(page, "Camel")
      .locator("img")
      .first()
      .getAttribute("src")) ?? "";

  expect(adminImageSrc).not.toBe("");

  await page.goto("/boutique/sac-camel", {
    waitUntil: "domcontentloaded"
  });

  await expect(
    getVariantCard(page, "Camel").locator(".variant-images .variant-media img")
  ).toHaveAttribute("src", adminImageSrc);
});
