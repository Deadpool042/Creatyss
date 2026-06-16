import { expect, test, type Locator, type Page } from "@playwright/test";

import { loginAsSeedAdmin } from "./admin-auth";
import { setupAdminEditorScenario } from "./product-test-helpers";

async function getAiEntry(page: Page): Promise<Locator> {
  await page.goto("/admin/settings/advanced/optional", {
    waitUntil: "domcontentloaded",
  });

  const entry = page.locator(
    "//code[normalize-space()='ai.core']/ancestor::div[contains(@class, 'px-4') and contains(@class, 'py-3.5')][1]"
  );

  await expect(entry).toBeVisible();
  return entry;
}

async function ensureAiCoreBasicEnabled(page: Page): Promise<void> {
  const entry = await getAiEntry(page);

  const activateButton = entry.getByRole("button", { name: "Activer Intelligence artificielle" });
  const deactivateButton = entry.getByRole("button", {
    name: "Désactiver Intelligence artificielle",
  });

  if ((await deactivateButton.count()) === 1) {
    await expect(deactivateButton).toBeVisible();
  } else {
    await expect(activateButton).toBeVisible();
    await activateButton.click();
    await expect(entry.getByText("Actif", { exact: true })).toBeVisible({
      timeout: 10_000,
    });
  }

  const levelTrigger = entry.getByLabel("Niveau de Intelligence artificielle");
  await expect(levelTrigger).toBeVisible();
  await levelTrigger.click();
  await page.getByRole("option", { name: "Basic", exact: true }).click();

  await expect(entry.getByRole("link", { name: "Reglages" })).toBeVisible();
}

test.describe.serial("ai.core browser flow", () => {
  test.describe.configure({ timeout: 180_000 });

  test("active le module et affiche la lecture admin IA", async ({ page }) => {
    await loginAsSeedAdmin(page);
    await ensureAiCoreBasicEnabled(page);

    await page.goto("/admin/settings/ai", { waitUntil: "domcontentloaded" });

    const heroSection = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Assistance IA" }) });

    await expect(page.getByRole("heading", { name: "Assistance IA" })).toBeVisible();
    await expect(
      heroSection.getByText("Le premier usage borne est maintenant la suggestion SEO manuelle")
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Taches recentes" })).toBeVisible();
  });

  test("propose et applique une suggestion SEO produit", async ({ page }) => {
    await loginAsSeedAdmin(page);
    await ensureAiCoreBasicEnabled(page);

    const scenario = await setupAdminEditorScenario(page);
    const seoUrl = scenario.editorProduct.detailUrl.replace(/\/edit$/, "/seo");

    await page.goto(seoUrl, {
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByRole("heading", { name: "Référencement principal" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Proposition SEO IA" })).toBeVisible();

    const titleInput = page.locator('input[name="title"]').first();
    const descriptionTextarea = page.locator('textarea[name="description"]').first();

    const titleBefore = await titleInput.inputValue();
    const descriptionBefore = await descriptionTextarea.inputValue();

    await page.getByRole("button", { name: "Suggérer avec l'IA" }).click();

    await expect(page.getByText("Suggestion SEO prête. Relisez-la avant de l'appliquer.")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("button", { name: "Remplir les champs" })).toBeVisible();

    await page.getByRole("button", { name: "Remplir les champs" }).click();

    await expect(titleInput).not.toHaveValue(titleBefore);
    await expect(descriptionTextarea).not.toHaveValue(descriptionBefore);
    await expect(titleInput).not.toHaveValue("");
    await expect(descriptionTextarea).not.toHaveValue("");
  });
});
