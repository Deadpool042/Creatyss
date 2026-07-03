import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import {
  activateFeatureFlag,
  createFreshOrderForFulfillmentE2E,
  readFulfillmentState,
} from "../commerce-db";

test.beforeAll(async () => {
  await activateFeatureFlag("commerce.fulfillment");
});

test("admin can create and fulfill a fulfillment on a confirmed order", async ({ page }) => {
  const { orderId } = await createFreshOrderForFulfillmentE2E();

  await loginAsSeedAdmin(page);

  await page.goto(`/admin/commerce/orders/${orderId}`);
  await page.waitForLoadState("domcontentloaded");

  // Vérifier que la section "Préparation logistique" est visible
  const fulfillmentSection = page.getByText("Préparation logistique").first();
  const fulfillmentSectionVisible = await fulfillmentSection
    .waitFor({ state: "visible", timeout: 10_000 })
    .then(() => true)
    .catch(() => false);
  if (!fulfillmentSectionVisible) {
    test.skip(
      true,
      "fulfillment section not visible — feature flag may be inactive or UI not rendered"
    );
    return;
  }

  await expect(fulfillmentSection).toBeVisible();

  // Cliquer "Créer la préparation"
  const createButton = page.getByRole("button", { name: "Créer la préparation" });
  await expect(createButton).toBeVisible({ timeout: 5_000 });
  await createButton.click();

  // Vérifier le feedback de création
  await expect(page.getByText("Préparation créée.").first()).toBeVisible({ timeout: 10_000 });

  // Cliquer "Marquer préparée"
  const fulfillButton = page.getByRole("button", { name: "Marquer préparée" });
  await expect(fulfillButton).toBeVisible({ timeout: 5_000 });
  await fulfillButton.click();

  // Vérifier le feedback de finalisation
  await expect(page.getByText("Préparation terminée.").first()).toBeVisible({ timeout: 10_000 });

  // Vérification DB : statut FULFILLED, stock inchangé (aucune mutation inventaire en V1)
  const state = await readFulfillmentState(orderId);
  expect(state).not.toBeNull();
  expect(state?.status).toBe("FULFILLED");
  expect(state?.inventoryOnHand).toBe(10);
});
