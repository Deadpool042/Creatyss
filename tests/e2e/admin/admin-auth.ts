import { expect, type Page } from "@playwright/test";

const SEEDED_ADMIN_EMAIL = "admin@creatyss.local";
const SEEDED_ADMIN_PASSWORD = "AdminDev123!";
const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_HOME_URL_PATTERN = /\/admin$/;
const ADMIN_LOGIN_READY_HEADING = "Connexion";
const ADMIN_HOME_READY_HEADING = "Espace d'administration";
const ADMIN_LOGOUT_BUTTON_LABEL = "Se déconnecter";
const ADMIN_LOGIN_MAX_ATTEMPTS = 3;
const ADMIN_LOGIN_NAVIGATION_TIMEOUT_MS = 30_000;
const ADMIN_LOGIN_SUBMIT_TIMEOUT_MS = 15_000;
const ADMIN_LOGIN_RETRY_DELAY_MS = 1_000;

function isRecoverableAdminLoginNavigationError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("ERR_ABORTED") ||
      error.message.includes("Timeout"))
  );
}

async function waitForAdminLoginForm(page: Page): Promise<void> {
  await expect(
    page.getByRole("heading", { name: ADMIN_LOGIN_READY_HEADING })
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Mot de passe")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Se connecter" })
  ).toBeVisible();
}

async function waitForAdminShell(page: Page): Promise<void> {
  await expect(page).toHaveURL(ADMIN_HOME_URL_PATTERN);
  await expect(
    page.getByRole("heading", { name: ADMIN_HOME_READY_HEADING })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: ADMIN_LOGOUT_BUTTON_LABEL })
  ).toBeVisible();
}

async function gotoAdminLogin(page: Page): Promise<void> {
  for (let attempt = 0; attempt < ADMIN_LOGIN_MAX_ATTEMPTS; attempt += 1) {
    try {
      await page.goto(ADMIN_LOGIN_PATH, {
        timeout: ADMIN_LOGIN_NAVIGATION_TIMEOUT_MS,
        waitUntil: "domcontentloaded"
      });
      return;
    } catch (error) {
      const isLastAttempt = attempt === ADMIN_LOGIN_MAX_ATTEMPTS - 1;

      if (!isRecoverableAdminLoginNavigationError(error) || isLastAttempt) {
        throw error;
      }

      await page.waitForTimeout(ADMIN_LOGIN_RETRY_DELAY_MS);
    }
  }
}

export async function loginAsSeedAdmin(page: Page): Promise<void> {
  await gotoAdminLogin(page);
  await waitForAdminLoginForm(page);

  await page.getByLabel("Email").fill(SEEDED_ADMIN_EMAIL);
  await page.getByLabel("Mot de passe").fill(SEEDED_ADMIN_PASSWORD);

  await Promise.all([
    page.waitForURL(ADMIN_HOME_URL_PATTERN, {
      timeout: ADMIN_LOGIN_SUBMIT_TIMEOUT_MS
    }),
    page.getByRole("button", { name: "Se connecter" }).click()
  ]);

  await waitForAdminShell(page);
}
