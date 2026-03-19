import { expect, test, type Locator, type Page } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import {
  createSimpleAdminProduct,
  createUniqueAdminProductIdentity,
  getAdminProductDetailUrlWithoutSearch,
  openAdminProductFromList,
  uploadAdminMediaImage,
} from "./product-test-helpers";

const PRIMARY_IMAGE_SUBMIT_BUTTON_PATTERN = /^(Définir|Remplacer) l'image principale$/;

function getProductPrimaryImageBlock(page: Page): Locator {
  return page
    .locator(".admin-product-subsection")
    .filter({
      has: page.getByRole("heading", {
        exact: true,
        level: 3,
        name: "Image principale du produit",
      }),
    })
    .first();
}

function getVariantCard(page: Page, variantName: string): Locator {
  return page
    .locator("article.admin-variant-card")
    .filter({
      has: page.getByRole("heading", { level: 3, name: variantName, exact: true }),
    })
    .first();
}

function getVariantPrimaryImageBlock(page: Page, variantName: string): Locator {
  const variantCard = getVariantCard(page, variantName);

  return variantCard
    .locator(".admin-product-subsection")
    .filter({
      has: page.getByRole("heading", {
        exact: true,
        level: 3,
        name: "Image principale de la déclinaison",
      }),
    })
    .first();
}

test("gère l'image principale du produit par sélection simple, remplacement et suppression", async ({
  page,
}) => {
  test.setTimeout(90_000);

  const product = createUniqueAdminProductIdentity({
    namePrefix: "Produit image",
    slugPrefix: "produit-image",
  });
  const mediaFileA = `product-primary-${product.suffix}-a.png`;
  const mediaFileB = `product-primary-${product.suffix}-b.png`;

  await loginAsSeedAdmin(page);

  await test.step("importe deux médias réutilisables", async () => {
    await uploadAdminMediaImage(page, mediaFileA);
    await uploadAdminMediaImage(page, mediaFileB);
  });

  await test.step("crée un produit simple publié", async () => {
    await createSimpleAdminProduct(page, {
      name: product.name,
      slug: product.slug,
      status: "published",
    });

    await expect(page).toHaveURL(/\/admin\/products\/[0-9]+\?product_status=created$/);
  });

  const productDetailUrl = getAdminProductDetailUrlWithoutSearch(page.url());

  await test.step("définit une image principale produit", async () => {
    const primaryImageBlock = getProductPrimaryImageBlock(page);

    await primaryImageBlock
      .getByLabel("Média existant")
      .selectOption({ label: `${mediaFileA} · image/png` });

    await Promise.all([
      page.waitForURL(/image_status=primary_updated&image_scope=product$/, {
        timeout: 15_000,
      }),
      primaryImageBlock.getByRole("button", { name: "Définir l'image principale" }).click(),
    ]);

    await expect(page.getByText("Image principale enregistrée avec succès.")).toBeVisible();
  });

  const productPrimaryImageSrcA =
    await test.step("confirme l'aperçu de l'image principale", async () => {
      await page.goto(productDetailUrl, {
        waitUntil: "domcontentloaded",
      });

      const primaryImageBlock = getProductPrimaryImageBlock(page);
      const preview = primaryImageBlock.locator("img").first();

      await expect(preview).toBeVisible();

      return (await preview.getAttribute("src")) ?? "";
    });

  await test.step("remplace l'image principale produit", async () => {
    const primaryImageBlock = getProductPrimaryImageBlock(page);

    await primaryImageBlock
      .getByLabel("Média existant")
      .selectOption({ label: `${mediaFileB} · image/png` });

    await Promise.all([
      page.waitForURL(/image_status=primary_updated&image_scope=product$/, {
        timeout: 15_000,
      }),
      primaryImageBlock.getByRole("button", { name: "Remplacer l'image principale" }).click(),
    ]);

    await expect(page.getByText("Image principale enregistrée avec succès.")).toBeVisible();
  });

  await test.step("met à jour l'aperçu après remplacement", async () => {
    await page.goto(productDetailUrl, {
      waitUntil: "domcontentloaded",
    });

    const preview = getProductPrimaryImageBlock(page).locator("img").first();
    const productPrimaryImageSrcB = (await preview.getAttribute("src")) ?? "";

    expect(productPrimaryImageSrcB).not.toBe("");
    expect(productPrimaryImageSrcB).not.toBe(productPrimaryImageSrcA);
  });

  await test.step("supprime l'image principale produit", async () => {
    const primaryImageBlock = getProductPrimaryImageBlock(page);

    await Promise.all([
      page.waitForURL(/image_status=primary_deleted&image_scope=product$/, {
        timeout: 15_000,
      }),
      primaryImageBlock.getByRole("button", { name: "Supprimer l'image principale" }).click(),
    ]);

    await expect(page.getByText("Image principale supprimée avec succès.")).toBeVisible();
  });

  await test.step("revient à un état sans image principale explicite", async () => {
    await page.goto(productDetailUrl, {
      waitUntil: "domcontentloaded",
    });

    const primaryImageBlock = getProductPrimaryImageBlock(page);

    await expect(
      primaryImageBlock.getByText("Aucune image principale définie pour ce produit.")
    ).toBeVisible();
    await expect(
      primaryImageBlock.getByRole("button", {
        name: "Supprimer l'image principale",
      })
    ).toHaveCount(0);
  });
});

test("gère l'image principale de la déclinaison par sélection simple, remplacement et suppression", async ({
  page,
}) => {
  test.setTimeout(90_000);

  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
  const mediaFileA = `variant-primary-${suffix}-a.png`;
  const mediaFileB = `variant-primary-${suffix}-b.png`;

  await loginAsSeedAdmin(page);

  await test.step("importe deux médias réutilisables", async () => {
    await uploadAdminMediaImage(page, mediaFileA);
    await uploadAdminMediaImage(page, mediaFileB);
  });

  await page.goto("/admin/products", {
    waitUntil: "domcontentloaded",
  });

  await test.step("ouvre le produit avec déclinaisons depuis la liste admin", async () => {
    await openAdminProductFromList(page, "Sac Camel");
    await expect(page).toHaveURL(/\/admin\/products\/[0-9]+$/);
  });

  const productDetailUrl = getAdminProductDetailUrlWithoutSearch(page.url());

  await test.step("définit une image principale de déclinaison", async () => {
    const primaryImageBlock = getVariantPrimaryImageBlock(page, "Camel");

    await primaryImageBlock
      .getByLabel("Média existant")
      .selectOption({ label: `${mediaFileA} · image/png` });

    await Promise.all([
      page.waitForURL(/image_status=primary_updated&image_scope=variant$/, {
        timeout: 15_000,
      }),
      primaryImageBlock
        .getByRole("button", {
          name: PRIMARY_IMAGE_SUBMIT_BUTTON_PATTERN,
        })
        .click(),
    ]);

    await expect(page.getByText("Image principale enregistrée avec succès.")).toBeVisible();
  });

  const variantPrimaryImageSrcA =
    await test.step("confirme l'aperçu de la déclinaison", async () => {
      await page.goto(productDetailUrl, {
        waitUntil: "domcontentloaded",
      });

      const preview = getVariantPrimaryImageBlock(page, "Camel").locator("img").first();

      await expect(preview).toBeVisible();

      return (await preview.getAttribute("src")) ?? "";
    });

  await test.step("remplace l'image principale de la déclinaison", async () => {
    const primaryImageBlock = getVariantPrimaryImageBlock(page, "Camel");

    await primaryImageBlock
      .getByLabel("Média existant")
      .selectOption({ label: `${mediaFileB} · image/png` });

    await Promise.all([
      page.waitForURL(/image_status=primary_updated&image_scope=variant$/, {
        timeout: 15_000,
      }),
      primaryImageBlock.getByRole("button", { name: "Remplacer l'image principale" }).click(),
    ]);

    await expect(page.getByText("Image principale enregistrée avec succès.")).toBeVisible();
  });

  await test.step("met à jour l'aperçu après remplacement", async () => {
    await page.goto(productDetailUrl, {
      waitUntil: "domcontentloaded",
    });

    const preview = getVariantPrimaryImageBlock(page, "Camel").locator("img").first();
    const variantPrimaryImageSrcB = (await preview.getAttribute("src")) ?? "";

    expect(variantPrimaryImageSrcB).not.toBe("");
    expect(variantPrimaryImageSrcB).not.toBe(variantPrimaryImageSrcA);
  });

  await test.step("supprime l'image principale de la déclinaison", async () => {
    const primaryImageBlock = getVariantPrimaryImageBlock(page, "Camel");

    await Promise.all([
      page.waitForURL(/image_status=primary_deleted&image_scope=variant$/, {
        timeout: 15_000,
      }),
      primaryImageBlock.getByRole("button", { name: "Supprimer l'image principale" }).click(),
    ]);

    await expect(page.getByText("Image principale supprimée avec succès.")).toBeVisible();
  });

  await test.step("revient à un état sans image principale explicite", async () => {
    await page.goto(productDetailUrl, {
      waitUntil: "domcontentloaded",
    });

    const primaryImageBlock = getVariantPrimaryImageBlock(page, "Camel");

    await expect(
      primaryImageBlock.getByText("Aucune image principale définie pour cette déclinaison.")
    ).toBeVisible();
    await expect(
      primaryImageBlock.getByRole("button", {
        name: "Supprimer l'image principale",
      })
    ).toHaveCount(0);
  });
});
