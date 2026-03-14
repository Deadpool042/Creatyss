import { expect, type Locator, type Page } from "@playwright/test";

type AdminProductStatus = "draft" | "published";

const SAMPLE_PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn7s1cAAAAASUVORK5CYII=",
  "base64"
);

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
): Promise<string> {
  await page.goto("/admin/products/new", {
    waitUntil: "domcontentloaded"
  });

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

  return getAdminProductDetailUrlWithoutSearch(page.url());
}

export async function openAdminProduct(
  page: Page,
  productDetailUrl: string
): Promise<void> {
  await page.goto(productDetailUrl, {
    waitUntil: "domcontentloaded"
  });

  await expect(page).toHaveURL(
    new RegExp(
      `${productDetailUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`
    )
  );
}

export async function openAdminProductFromList(
  page: Page,
  productName: string
): Promise<void> {
  await page.goto("/admin/products", {
    waitUntil: "networkidle"
  });

  const searchInput = page.getByRole("textbox", {
    name: "Chercher un produit..."
  });

  await expect(searchInput).toBeVisible();
  await searchInput.fill(productName);

  const row = page.getByRole("row").filter({ hasText: productName }).first();
  const editLink = row.getByRole("link", {
    name: "Modifier le produit",
    exact: true
  });

  await expect(row).toBeVisible();
  await expect(editLink).toBeVisible();

  await Promise.all([
    page.waitForURL(/\/admin\/products\/[0-9]+(?:\?.*)?$/, {
      timeout: 15_000
    }),
    editLink.click()
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

export async function uploadAdminMediaImage(
  page: Page,
  fileName: string
): Promise<void> {
  await page.goto("/admin/media", {
    waitUntil: "domcontentloaded"
  });

  await page.locator('input[type="file"][name="file"]').setInputFiles({
    name: fileName,
    mimeType: "image/png",
    buffer: SAMPLE_PNG_BYTES
  });

  await Promise.all([
    page.waitForURL(/\/admin\/media\?status=uploaded$/, {
      timeout: 15_000
    }),
    page.getByRole("button", { name: "Importer le média" }).click()
  ]);
}
