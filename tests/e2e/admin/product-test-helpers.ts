import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { expect, type Locator, type Page } from "@playwright/test";

const ADMIN_GOTO_TIMEOUT_MS = 30_000;
const ADMIN_GOTO_MAX_ATTEMPTS = 3;
const ADMIN_GOTO_RETRY_DELAY_MS = 750;
const ADMIN_SHELL_READY_TIMEOUT_MS = 5_000;

type CreateSimpleAdminProductInput = {
  name: string;
  slug: string;
  status?: "draft" | "active" | "inactive" | "published";
  productTypeCode?: "simple" | "variable";
};

type UniqueAdminProductIdentityInput = {
  namePrefix: string;
  slugPrefix: string;
};

export type SeededAdminEditorProduct = {
  name: string;
  slug: string;
  detailUrl: string;
};

export type SeededAdminEditorScenario = {
  editorProduct: SeededAdminEditorProduct;
  relatedTargetProduct: SeededAdminEditorProduct;
};

function isRecoverableNavigationError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("ERR_ABORTED") ||
      error.message.includes("ERR_EMPTY_RESPONSE") ||
      error.message.includes("ERR_CONNECTION_REFUSED") ||
      error.message.includes("Timeout") ||
      error.message.includes("frame was detached"))
  );
}

async function isAdminShellVisible(page: Page): Promise<boolean> {
  const shellCandidates = [
    page.getByRole("button", { name: "Se déconnecter" }).first(),
    page.getByRole("link", { name: "Produits" }).first(),
  ];

  for (const candidate of shellCandidates) {
    try {
      await candidate.waitFor({
        state: "visible",
        timeout: ADMIN_SHELL_READY_TIMEOUT_MS,
      });
      return true;
    } catch {
      continue;
    }
  }

  return false;
}

async function waitForAdminShell(page: Page): Promise<void> {
  const shellVisible = await isAdminShellVisible(page);
  expect(shellVisible).toBeTruthy();
  await page.waitForLoadState("domcontentloaded");
}

async function gotoAdminPageWithRetry(page: Page, url: string): Promise<void> {
  for (let attempt = 0; attempt < ADMIN_GOTO_MAX_ATTEMPTS; attempt += 1) {
    try {
      await page.waitForLoadState("domcontentloaded");
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: ADMIN_GOTO_TIMEOUT_MS,
      });
      return;
    } catch (error) {
      const isLastAttempt = attempt === ADMIN_GOTO_MAX_ATTEMPTS - 1;

      if (!isRecoverableNavigationError(error) || isLastAttempt) {
        throw error;
      }

      await page.waitForTimeout(ADMIN_GOTO_RETRY_DELAY_MS);
    }
  }
}

export function createUniqueAdminProductIdentity(input: UniqueAdminProductIdentityInput): {
  suffix: string;
  name: string;
  slug: string;
} {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;

  return {
    suffix,
    name: `${input.namePrefix} ${suffix}`,
    slug: `${input.slugPrefix}-${suffix}`,
  };
}

function toRegExpEscaped(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mapProductTypeToVisibleLabel(code: "simple" | "variable"): string {
  if (code === "simple") {
    return "Produit simple";
  }

  return "Produit à variantes";
}

function toCanonicalEditUrl(url: string): string {
  const withoutQuery = url.split("?")[0] ?? url;
  const trimmed = withoutQuery.replace(/\/$/, "");

  if (trimmed.endsWith("/edit")) {
    return trimmed;
  }

  return `${trimmed}/edit`;
}

async function completeCreateWizardIdentityStep(
  page: Page,
  input: Pick<CreateSimpleAdminProductInput, "name">
): Promise<void> {
  const nameInput = page.locator("#new-name");
  const slugInput = page.locator("#new-slug");
  const nextButton = page.getByRole("button", { name: "Suivant" });

  await expect(nameInput).toBeVisible();
  await expect(slugInput).toBeVisible();

  const timeoutMs = 60_000;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await nameInput.click();
    await nameInput.fill("");
    await nameInput.pressSequentially(input.name, { delay: 12 });

    const slugValue = await slugInput.inputValue();
    if (slugValue.trim().length === 0) {
      await page.waitForTimeout(500);
      continue;
    }

    if (await nextButton.isEnabled()) {
      return;
    }

    await page.waitForTimeout(500);
  }

  await expect(nextButton).toBeEnabled({ timeout: 1_000 });
}

export async function createSimpleAdminProduct(
  page: Page,
  input: CreateSimpleAdminProductInput
): Promise<string> {
  await waitForAdminShell(page);
  await gotoAdminPageWithRetry(page, "/admin/products/new");

  await expect(page.getByLabel("Nom")).toBeVisible();
  await expect(page.getByLabel("Slug")).toBeVisible();

  await completeCreateWizardIdentityStep(page, input);
  await page.getByRole("button", { name: "Suivant" }).click();

  const productTypeCode = input.productTypeCode ?? "simple";
  const productTypeLabel = mapProductTypeToVisibleLabel(productTypeCode);
  const submitButton = page.getByRole("button", { name: "Créer le produit" });

  await expect(page.getByLabel("Type de produit")).toBeVisible();

  let redirectedToEditor = false;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.getByLabel("Type de produit").click();
    await page.getByRole("option", { name: productTypeLabel, exact: true }).click();
    await expect(submitButton).toBeEnabled({ timeout: 3_000 });
    await submitButton.click();

    try {
      await page.waitForURL(/\/admin\/products\/[^/]+\/edit(?:\?.*)?$/, {
        timeout: 10_000,
      });
      redirectedToEditor = true;
      break;
    } catch {
      await page.waitForTimeout(500);
    }
  }

  expect(redirectedToEditor).toBeTruthy();

  await page.waitForLoadState("domcontentloaded");
  return toCanonicalEditUrl(page.url());
}

export async function setupAdminEditorScenario(page: Page): Promise<SeededAdminEditorScenario> {
  await waitForAdminShell(page);

  const targetIdentity = createUniqueAdminProductIdentity({
    namePrefix: "Produit Cible E2E",
    slugPrefix: "produit-cible-e2e",
  });

  const editorIdentity = createUniqueAdminProductIdentity({
    namePrefix: "Produit Éditeur E2E",
    slugPrefix: "produit-editeur-e2e",
  });

  const relatedTargetDetailUrl = await createSimpleAdminProduct(page, {
    name: targetIdentity.name,
    slug: targetIdentity.slug,
    status: "draft",
  });

  const editorDetailUrl = await createSimpleAdminProduct(page, {
    name: editorIdentity.name,
    slug: editorIdentity.slug,
    status: "draft",
  });

  return {
    relatedTargetProduct: {
      name: targetIdentity.name,
      slug: targetIdentity.slug,
      detailUrl: relatedTargetDetailUrl,
    },
    editorProduct: {
      name: editorIdentity.name,
      slug: editorIdentity.slug,
      detailUrl: editorDetailUrl,
    },
  };
}

export async function openAdminProduct(page: Page, detailUrl: string): Promise<void> {
  const canonicalUrl = toCanonicalEditUrl(detailUrl);
  await gotoAdminPageWithRetry(page, canonicalUrl);
  await expect(page).toHaveURL(
    new RegExp(`${toRegExpEscaped(canonicalUrl)}(?:\\?.*)?$`)
  );
}

export function getAdminProductDetailUrlWithoutSearch(url: string): string {
  const withoutQuery = url.split("?")[0] ?? url;
  return withoutQuery;
}

export async function openAdminProductFromList(page: Page, productName: string): Promise<void> {
  await waitForAdminShell(page);
  await gotoAdminPageWithRetry(page, "/admin/products");

  const row = page
    .locator("tr")
    .filter({
      has: page.getByText(productName, { exact: false }),
    })
    .first();

  if ((await row.count()) > 0) {
    const link = row.getByRole("link").first();
    await expect(link).toBeVisible();
    await link.click();
  } else {
    const card = page
      .locator("article")
      .filter({
        hasText: productName,
      })
      .first();

    await expect(card).toBeVisible();

    const cardLink = card.getByRole("link").first();
    await expect(cardLink).toBeVisible();
    await cardLink.click();
  }

  await page.waitForLoadState("domcontentloaded");
}

export function getSimpleOfferForm(page: Page): Locator {
  return page
    .locator("form")
    .filter({
      hasText: "Informations de vente",
    })
    .first();
}

const ONE_PIXEL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7ZC7sAAAAASUVORK5CYII=",
  "base64"
);

async function ensureTempImagePath(filename: string): Promise<string> {
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const absolutePath = join(tmpdir(), safeFilename.endsWith(".png") ? safeFilename : `${safeFilename}.png`);
  await writeFile(absolutePath, ONE_PIXEL_PNG);
  return absolutePath;
}

export async function uploadAdminMediaImage(page: Page, filename: string): Promise<void> {
  await waitForAdminShell(page);
  await gotoAdminPageWithRetry(page, "/admin/media");

  const fileInput = page.locator('input[type="file"][name="file"]');
  await expect(fileInput).toBeVisible();

  const imagePath = await ensureTempImagePath(filename);
  await fileInput.setInputFiles(imagePath);
  await page.getByRole("button", { name: "Importer le média" }).click();

  await page.waitForLoadState("domcontentloaded");
}
