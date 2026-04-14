import { expect, type Page } from "@playwright/test";

const SEEDED_ADMIN_EMAIL = "admin@creatyss.local";
const SEEDED_ADMIN_PASSWORD = "AdminDev123!";
const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_HOME_URL_PATTERN = /\/admin(?!\/login(?:\/|$))(?:\/.*)?$/;
const ADMIN_LOGOUT_BUTTON_LABEL = "Se déconnecter";
const ADMIN_LOGIN_MAX_ATTEMPTS = 3;
const ADMIN_LOGIN_NAVIGATION_TIMEOUT_MS = 30_000;
const ADMIN_LOGIN_SUBMIT_TIMEOUT_MS = 15_000;
const ADMIN_LOGIN_RETRY_DELAY_MS = 1_000;
const ADMIN_READY_CHECK_TIMEOUT_MS = 1_500;

function isRecoverableAdminLoginNavigationErrorMessage(message: string): boolean {
  return message.includes("ERR_ABORTED") || message.includes("Timeout");
}

async function waitForAdminLoginForm(page: Page): Promise<void> {
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Mot de passe")).toBeVisible();
  await expect(page.locator("form button[type='submit']").first()).toBeVisible();
}

async function isAdminLoginFormVisible(page: Page): Promise<boolean> {
  const emailField = page.getByLabel("Email").first();
  const passwordField = page.getByLabel("Mot de passe").first();
  const submitButton = page.locator("form button[type='submit']").first();

  try {
    await emailField.waitFor({ state: "visible", timeout: ADMIN_READY_CHECK_TIMEOUT_MS });
    await passwordField.waitFor({ state: "visible", timeout: ADMIN_READY_CHECK_TIMEOUT_MS });
    await submitButton.waitFor({ state: "visible", timeout: ADMIN_READY_CHECK_TIMEOUT_MS });
    return true;
  } catch {
    return false;
  }
}

async function isAdminShellVisible(page: Page): Promise<boolean> {
  if (await isAdminLoginFormVisible(page)) {
    return false;
  }

  const shellCandidates = [
    page.getByRole("button", { name: ADMIN_LOGOUT_BUTTON_LABEL }).first(),
    page.getByRole("link", { name: "Produits" }).first(),
    page.locator('a[href="/admin/products"]').first(),
    page.locator("main").first(),
  ];

  for (const candidate of shellCandidates) {
    try {
      await candidate.waitFor({ state: "attached", timeout: ADMIN_READY_CHECK_TIMEOUT_MS });
      return true;
    } catch {
      continue;
    }
  }

  return false;
}

async function waitForAdminShell(page: Page): Promise<void> {
  await expect(page).toHaveURL(ADMIN_HOME_URL_PATTERN, {
    timeout: ADMIN_LOGIN_SUBMIT_TIMEOUT_MS,
  });
  await page.waitForLoadState("domcontentloaded");

  const shellIsVisible = await isAdminShellVisible(page);
  if (shellIsVisible) {
    return;
  }

  const loginFormVisible = await isAdminLoginFormVisible(page);
  expect(loginFormVisible).toBeFalsy();
}

async function gotoAdminLogin(page: Page): Promise<void> {
  for (let attempt = 0; attempt < ADMIN_LOGIN_MAX_ATTEMPTS; attempt += 1) {
    try {
      await page.goto(ADMIN_LOGIN_PATH, {
        timeout: ADMIN_LOGIN_NAVIGATION_TIMEOUT_MS,
        waitUntil: "domcontentloaded",
      });
      return;
    } catch (error) {
      const isLastAttempt = attempt === ADMIN_LOGIN_MAX_ATTEMPTS - 1;
      const recoverable =
        error instanceof Error && isRecoverableAdminLoginNavigationErrorMessage(error.message);

      if (!recoverable || isLastAttempt) {
        throw error;
      }

      await page.waitForTimeout(ADMIN_LOGIN_RETRY_DELAY_MS);
    }
  }
}

export async function loginAsSeedAdmin(page: Page): Promise<void> {
  await gotoAdminLogin(page);

  const shellAlreadyVisible = await isAdminShellVisible(page);
  if (shellAlreadyVisible) {
    await waitForAdminShell(page);
    return;
  }

  await waitForAdminLoginForm(page);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.getByLabel("Email").fill(SEEDED_ADMIN_EMAIL);
    await page.getByLabel("Mot de passe").fill(SEEDED_ADMIN_PASSWORD);
    await page.locator("form button[type='submit']").first().click();

    try {
      await waitForAdminShell(page);
      return;
    } catch {
      const loginStillVisible = await isAdminLoginFormVisible(page);
      if (!loginStillVisible || attempt === 1) {
        throw new Error("Impossible de finaliser la connexion admin seed.");
      }
    }
  }

  throw new Error("Connexion admin non établie.");
}
