import { type Locator, type Page } from "@playwright/test";

type AdminProductStatus = "draft" | "published";

export function createUniqueAdminProductIdentity(input: {
  namePrefix: string;
  slugPrefix: string;
}): {
  suffix: string;
  name: string;
  slug: string;
} {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;

  return {
    suffix,
    name: `${input.namePrefix} ${suffix}`,
    slug: `${input.slugPrefix}-${suffix}`
  };
}

export function getAdminProductDetailUrlWithoutSearch(url: string): string {
  return url.replace(/\?.*$/, "");
}

export async function createSimpleAdminProduct(
  page: Page,
  input: {
    name: string;
    slug: string;
    status?: AdminProductStatus;
  }
): Promise<void> {
  await page.goto("/admin/products/new");

  await page.getByLabel("Nom").fill(input.name);
  await page.getByLabel("Slug").fill(input.slug);

  if (input.status) {
    await page.getByLabel("Statut").selectOption(input.status);
  }

  await page.getByLabel("Type de produit").selectOption("simple");

  await Promise.all([
    page.waitForURL(/\/admin\/products\/[0-9]+\?product_status=created$/, {
      timeout: 15_000
    }),
    page.getByRole("button", { name: "Créer le produit" }).click()
  ]);
}

export async function openAdminProductFromList(
  page: Page,
  productName: string
): Promise<void> {
  const productCard = page
    .locator("article.admin-product-card")
    .filter({ hasText: productName })
    .first();

  await Promise.all([
    page.waitForURL(/\/admin\/products\/[0-9]+(?:\?.*)?$/, {
      timeout: 15_000
    }),
    productCard.getByRole("link", { name: "Modifier le produit" }).click()
  ]);
}

export function getSimpleOfferForm(page: Page): Locator {
  return page
    .locator("form")
    .filter({
      has: page.getByRole("button", {
        name: "Enregistrer les informations de vente"
      })
    })
    .first();
}
