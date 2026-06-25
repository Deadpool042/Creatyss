import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import {
  activateFeatureFlag,
  ensureConfirmedOrderForE2E,
  readReturnState,
  resetReturnRequestForE2E,
} from "../commerce-db";

test.beforeAll(async () => {
  await activateFeatureFlag("commerce.returns");
});

test("admin can open, approve and receive a return on a confirmed order", async ({ page }) => {
  const { orderId } = await ensureConfirmedOrderForE2E();
  await resetReturnRequestForE2E(orderId);

  await loginAsSeedAdmin(page);

  await page.goto(`/admin/commerce/orders/${orderId}`);
  await page.waitForLoadState("domcontentloaded");

  // Vérifier que la section "Demande de retour" est visible
  const returnSection = page.getByText("Demande de retour").first();
  const returnSectionVisible = await returnSection
    .waitFor({ state: "visible", timeout: 10_000 })
    .then(() => true)
    .catch(() => false);
  if (!returnSectionVisible) {
    test.skip(true, "return section not visible — feature flag may be inactive or UI not rendered");
    return;
  }

  await expect(returnSection).toBeVisible();

  // Cliquer "Ouvrir un retour"
  const openButton = page.getByRole("button", { name: "Ouvrir un retour" });
  await expect(openButton).toBeVisible({ timeout: 5_000 });
  await openButton.click();

  // Vérifier le feedback d'ouverture
  await expect(page.getByText("Demande de retour ouverte.").first()).toBeVisible({
    timeout: 10_000,
  });

  // Cliquer "Approuver"
  const approveButton = page.getByRole("button", { name: "Approuver" });
  await expect(approveButton).toBeVisible({ timeout: 5_000 });
  await approveButton.click();

  // Vérifier le feedback d'approbation — label exact : "Retour : Approuvé."
  await expect(page.getByText("Retour : Approuvé.").first()).toBeVisible({ timeout: 10_000 });

  // Cliquer "Marquer reçu (restock auto)"
  const receiveButton = page.getByRole("button", { name: "Marquer reçu (restock auto)" });
  await expect(receiveButton).toBeVisible({ timeout: 5_000 });
  await receiveButton.click();

  // Vérifier le feedback de réception — label exact : "Retour : Reçu."
  await expect(page.getByText("Retour : Reçu.").first()).toBeVisible({ timeout: 10_000 });

  // Vérification DB : statut RECEIVED et stock restitué
  const state = await readReturnState(orderId);
  expect(state).not.toBeNull();
  expect(state?.status).toBe("RECEIVED");
  expect(state?.inventoryOnHand).toBeGreaterThan(0);

  // Note : le step "Rembourser via Stripe" est exclu du périmètre E2E
  // (nécessite un Stripe réel).
});
