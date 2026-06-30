import { expect, type Locator, type Page, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import { createFreshOrderForLifecycleE2E, readOrderLifecycleState } from "../commerce-db";

const CARRIER = "Colissimo";
const TRACKING = "colissimo-e2e-lifecycle";

/**
 * La route `/admin/commerce/orders/[id]` est une vue split (parallel routes) :
 * le panneau gauche liste TOUTES les commandes, le panneau droit affiche le
 * détail. Les assertions de statut doivent être scopées au panneau détail,
 * sinon `getByText("Annulée"/"Expédiée")` matche une autre commande de la liste.
 * On ancre le panneau détail sur son titre `h1 "Commande <orderNumber>"`.
 */
function getOrderDetailPane(page: Page, orderNumber: string): Locator {
  return page.locator("section.admin-split-detail-pane-scroll", {
    has: page.getByRole("heading", { level: 1, name: `Commande ${orderNumber}` }),
  });
}

test("admin drives a confirmed order through preparation, shipping and delivery", async ({
  page,
}) => {
  const { orderId, orderNumber, initialOnHand } = await createFreshOrderForLifecycleE2E();

  await loginAsSeedAdmin(page);
  await page.goto(`/admin/commerce/orders/${orderId}`);
  await page.waitForLoadState("domcontentloaded");

  const detail = getOrderDetailPane(page, orderNumber);

  // CONFIRMED → PROCESSING
  await detail.getByRole("button", { name: "Marquer en préparation" }).click();

  // En préparation, le formulaire d'expédition (transporteur + suivi) apparaît.
  const carrierField = detail.getByLabel("Transporteur optionnel");
  await expect(carrierField).toBeVisible({ timeout: 15_000 });
  await carrierField.fill(CARRIER);
  await detail.getByLabel("Référence de suivi optionnelle").fill(TRACKING);

  // PROCESSING → COMPLETED (Order) + shipment SHIPPED
  await detail.getByRole("button", { name: "Marquer comme expédiée" }).click();

  // SHIPPED → DELIVERED (le bouton n'apparaît qu'une fois la commande expédiée)
  const deliverButton = detail.getByRole("button", { name: "Marquer comme livrée" });
  await expect(deliverButton).toBeVisible({ timeout: 15_000 });
  await deliverButton.click();

  // Synchronisation DB : on attend que la Server Action ait persisté l'état
  // complet avant de faire les assertions UI et DB finales.
  await expect
    .poll(
      async () => {
        const s = await readOrderLifecycleState(orderId);
        return (
          s?.orderStatus === "COMPLETED" &&
          s?.shipmentStatus === "DELIVERED" &&
          s?.deliveredAt !== null
        );
      },
      { timeout: 15_000 }
    )
    .toBe(true);

  // État persistant DB.
  const state = await readOrderLifecycleState(orderId);
  expect(state).not.toBeNull();
  expect(state?.orderStatus).toBe("COMPLETED");
  expect(state?.shipmentStatus).toBe("DELIVERED");
  expect(state?.carrier).toBe(CARRIER);
  expect(state?.trackingNumber).toBe(TRACKING);
  expect(state?.deliveredAt).not.toBeNull();
  // Fixture sans CONSUMPTION : la restitution à l'expédition/livraison est un no-op.
  expect(state?.inventoryOnHand).toBe(initialOnHand);

  // État persistant UI (scopé au détail, après confirmation DB).
  await expect(detail.getByRole("heading", { name: "Suivi d'expédition" })).toBeVisible();
  await expect(detail.getByRole("heading", { name: "Historique de statut" })).toBeVisible();
  await expect(detail.getByText(CARRIER).first()).toBeVisible();
  await expect(detail.getByText(TRACKING).first()).toBeVisible();
});

test("admin cancels a confirmed order from the detail dialog", async ({ page }) => {
  const { orderId, orderNumber, initialOnHand } = await createFreshOrderForLifecycleE2E();

  await loginAsSeedAdmin(page);
  await page.goto(`/admin/commerce/orders/${orderId}`);
  await page.waitForLoadState("domcontentloaded");

  const detail = getOrderDetailPane(page, orderNumber);

  // Ouvre le dialog d'annulation (bouton déclencheur du panneau détail).
  await detail.getByRole("button", { name: "Annuler la commande" }).click();

  // Le confirm porte le même libellé que le déclencheur : on scope au dialog.
  const dialog = page.getByRole("alertdialog");
  await expect(dialog.getByText("Annuler cette commande ?")).toBeVisible({ timeout: 10_000 });
  await dialog.getByRole("button", { name: "Annuler la commande" }).click();

  // Synchronisation DB : on attend que la Server Action ait persisté CANCELLED
  // avant de faire les assertions UI et DB finales.
  await expect
    .poll(
      async () => {
        const s = await readOrderLifecycleState(orderId);
        return s?.orderStatus;
      },
      { timeout: 15_000 }
    )
    .toBe("CANCELLED");

  // État persistant DB.
  const state = await readOrderLifecycleState(orderId);
  expect(state).not.toBeNull();
  expect(state?.orderStatus).toBe("CANCELLED");
  // Fixture sans CONSUMPTION : la restitution à l'annulation est un no-op, stock inchangé.
  expect(state?.inventoryOnHand).toBe(initialOnHand);

  // État persistant UI (scopé au détail, après confirmation DB).
  await expect(detail.getByText("Annulée").first()).toBeVisible();
});
