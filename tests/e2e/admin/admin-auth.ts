import { expect, type Page } from "@playwright/test";

const SEEDED_ADMIN_EMAIL = "admin@creatyss.local";
const SEEDED_ADMIN_PASSWORD = "AdminDev123!";

async function gotoAdminLogin(page: Page): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto("/admin/login", {
        timeout: 30_000,
        waitUntil: "domcontentloaded"
      });
      return;
    } catch (error) {
      const isLastAttempt = attempt === 2;
      const isRecoverableNavigationError =
        error instanceof Error &&
        (error.message.includes("ERR_ABORTED") ||
          error.message.includes("Timeout"));

      if (!isRecoverableNavigationError || isLastAttempt) {
        throw error;
      }

      await page.waitForTimeout(1_000);
    }
  }
}

export async function loginAsSeedAdmin(page: Page): Promise<void> {
  await gotoAdminLogin(page);

  await expect(
    page.getByRole("heading", { name: "Connexion" })
  ).toBeVisible();

  await page.getByLabel("Email").fill(SEEDED_ADMIN_EMAIL);
  await page.getByLabel("Mot de passe").fill(SEEDED_ADMIN_PASSWORD);

  await Promise.all([
    page.waitForURL(/\/admin$/, { timeout: 15_000 }),
    page.getByRole("button", { name: "Se connecter" }).click()
  ]);

  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "Admin Creatyss" })
  ).toBeVisible();
}
