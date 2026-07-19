import { expect, test, type Page } from "@playwright/test";
import { activateFeatureFlag, createFreshOrderForStorefrontReturnsE2E } from "../commerce-db";

test.beforeAll(async () => {
  await activateFeatureFlag("commerce.returns");
});

/**
 * `/compte` porte deux formulaires distincts partageant le même libellé
 * "Référence de commande" (suivi de commande + éligibilité au retour) : on
 * scope systématiquement au `<form>` contenant le bouton de soumission des
 * retours pour éviter toute ambiguïté de sélecteur.
 */
function getReturnEligibilityForm(page: Page) {
  return page.locator("form").filter({
    has: page.getByRole("button", { name: "Vérifier mon éligibilité" }),
  });
}

test("displays the return eligibility form with its essential fields", async ({ page }) => {
  await page.goto("/compte");

  await expect(page.getByText("Vérifier un retour")).toBeVisible({ timeout: 10_000 });

  const form = getReturnEligibilityForm(page);
  await expect(form.getByLabel("Référence de commande")).toBeVisible();
  await expect(form.getByLabel("Email")).toBeVisible();
  await expect(form.getByLabel("Motif du retour")).toBeVisible();
  await expect(form.getByRole("button", { name: "Vérifier mon éligibilité" })).toBeVisible();
});

test("shows visible field errors on invalid input without calling the server", async ({ page }) => {
  await page.goto("/compte");

  const form = getReturnEligibilityForm(page);
  await expect(form).toBeVisible({ timeout: 10_000 });

  // Soumission à vide : déclenche la validation applicative (setFieldErrors)
  // sans passer par la validation native du navigateur sur `type="email"`,
  // qui bloquerait silencieusement le `submit` avant que le handler React
  // ne s'exécute si un texte non vide et non conforme y était saisi.
  await form.getByRole("button", { name: "Vérifier mon éligibilité" }).click();

  await expect(form.getByText("La référence de commande est requise.")).toBeVisible();
  await expect(form.getByText("Renseignez une adresse email valide.")).toBeVisible();
  await expect(form.getByText("Choisissez un motif.")).toBeVisible();
});

test("returns the public eligible outcome without leaking internal eligibility details", async ({
  page,
}) => {
  const fixture = await createFreshOrderForStorefrontReturnsE2E();

  await page.goto("/compte");
  const form = getReturnEligibilityForm(page);
  await expect(form).toBeVisible({ timeout: 10_000 });

  await form.getByLabel("Référence de commande").fill(fixture.reference);
  await form.getByLabel("Email").fill(fixture.email);
  await form.getByLabel("Motif du retour").selectOption({ label: "Je change d'avis" });
  await form.getByRole("button", { name: "Vérifier mon éligibilité" }).click();

  const resultRegion = page.locator('[aria-live="polite"]');
  await expect(
    resultRegion.getByText("Votre commande contient au moins un article potentiellement éligible")
  ).toBeVisible({ timeout: 10_000 });

  // Aucun détail métier interne (code/message du domaine) ne doit fuiter dans l'UI.
  await expect(page.getByText("WITHDRAWAL_PERIOD_VALID")).toHaveCount(0);
  await expect(page.getByText("Délai de rétractation respecté.")).toHaveCount(0);
});

test("returns the public manual review outcome for a non-withdrawal reason", async ({ page }) => {
  const fixture = await createFreshOrderForStorefrontReturnsE2E();

  await page.goto("/compte");
  const form = getReturnEligibilityForm(page);
  await expect(form).toBeVisible({ timeout: 10_000 });

  await form.getByLabel("Référence de commande").fill(fixture.reference);
  await form.getByLabel("Email").fill(fixture.email);
  await form.getByLabel("Motif du retour").selectOption({ label: "Autre motif" });
  await form.getByRole("button", { name: "Vérifier mon éligibilité" }).click();

  const resultRegion = page.locator('[aria-live="polite"]');
  await expect(
    resultRegion.getByText("Votre situation nécessite une vérification manuelle.")
  ).toBeVisible({ timeout: 10_000 });

  // Aucun détail métier interne (code/message du domaine) ne doit fuiter dans l'UI.
  await expect(page.getByText("MANUAL_REVIEW_REQUIRED")).toHaveCount(0);
  await expect(page.getByText("nécessite systématiquement une revue manuelle")).toHaveCount(0);
});

test("clears the previous result once a field is edited again", async ({ page }) => {
  const fixture = await createFreshOrderForStorefrontReturnsE2E();

  await page.goto("/compte");
  const form = getReturnEligibilityForm(page);
  await expect(form).toBeVisible({ timeout: 10_000 });

  await form.getByLabel("Référence de commande").fill(fixture.reference);
  await form.getByLabel("Email").fill(fixture.email);
  await form.getByLabel("Motif du retour").selectOption({ label: "Je change d'avis" });
  await form.getByRole("button", { name: "Vérifier mon éligibilité" }).click();

  const resultRegion = page.locator('[aria-live="polite"]');
  await expect(
    resultRegion.getByText("Votre commande contient au moins un article potentiellement éligible")
  ).toBeVisible({ timeout: 10_000 });

  await form.getByLabel("Référence de commande").fill(`${fixture.reference}X`);

  await expect(
    resultRegion.getByText("Votre commande contient au moins un article potentiellement éligible")
  ).toHaveCount(0);
});
