import { expect, type Page } from "@playwright/test";

const SEEDED_ADMIN_EMAIL = "admin@creatyss.local";
const SEEDED_ADMIN_PASSWORD = "AdminDev123!";

export async function loginAsSeedAdmin(page: Page): Promise<void> {
  await page.goto("/admin/login");

  await expect(
    page.getByRole("heading", { name: "Connexion" })
  ).toBeVisible();

  await page.getByLabel("Email").fill(SEEDED_ADMIN_EMAIL);
  await page.getByLabel("Mot de passe").fill(SEEDED_ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "Admin Creatyss" })
  ).toBeVisible();
}
