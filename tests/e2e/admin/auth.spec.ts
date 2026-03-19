import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("redirects unauthenticated admin access to login", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
});

test("logs in and logs out the seeded admin", async ({ page }) => {
  await loginAsSeedAdmin(page);

  await page.getByRole("button", { name: "Se déconnecter" }).click();

  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
});

test("rejects the inactive seeded admin", async ({ page }) => {
  await page.goto("/admin/login");

  await page.getByLabel("Email").fill("inactive-admin@creatyss.local");
  await page.getByLabel("Mot de passe").fill("AdminDev123!");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page).toHaveURL(/\/admin\/login\?error=invalid_credentials$/);
  await expect(page.getByText("Identifiants invalides.")).toBeVisible();
});
