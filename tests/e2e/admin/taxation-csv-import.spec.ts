import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import { activateFeatureFlag } from "../commerce-db";

const TAXATION_PATH = "/admin/commerce/taxation";

const VALID_CSV = [
  "code,name,countryCode,regionCode,ratePercent,startsAt,endsAt,status",
  "E2E-TVA-METRO,TVA test métropole,FR,,20,,,ACTIVE",
  "E2E-TVA-971,TVA test Guadeloupe,FR,971,8.5,,,ACTIVE",
].join("\n");

// Code avec espaces (invalide) et taux non numérique → Zod rejette la ligne
const INVALID_ROWS_CSV = [
  "code,name,countryCode,regionCode,ratePercent,startsAt,endsAt,status",
  "CODE INVALIDE,Taux TVA,FR,,pas-un-nombre,,,ACTIVE",
].join("\n");

test.beforeAll(async () => {
  await activateFeatureFlag("commerce.taxation");
});

test("golden path — upload CSV valide, 2 règles créées", async ({ page }) => {
  await loginAsSeedAdmin(page);
  await page.goto(TAXATION_PATH);
  await page.waitForLoadState("domcontentloaded");

  const fileInput = page.locator('input[type="file"][name="csvFile"]');
  await expect(fileInput).toBeVisible({ timeout: 10_000 });

  await fileInput.setInputFiles({
    name: "tax-rules.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(VALID_CSV),
  });

  await page.getByRole("button", { name: "Importer" }).click();

  await expect(page.getByText(/Import terminé/i).first()).toBeVisible({ timeout: 15_000 });

  await expect(page.getByText(/créée/i).first()).toBeVisible();
});

test("CSV mal formé — affiche une erreur d'import", async ({ page }) => {
  await loginAsSeedAdmin(page);
  await page.goto(TAXATION_PATH);
  await page.waitForLoadState("domcontentloaded");

  const fileInput = page.locator('input[type="file"][name="csvFile"]');
  await expect(fileInput).toBeVisible({ timeout: 10_000 });

  await fileInput.setInputFiles({
    name: "bad.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(INVALID_ROWS_CSV),
  });

  await page.getByRole("button", { name: "Importer" }).click();

  await expect(page.getByText(/\d+ erreur/i).first()).toBeVisible({ timeout: 15_000 });
});
