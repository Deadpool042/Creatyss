import { expect, test, type Page } from "@playwright/test";
import { loginAsSeedAdmin } from "../admin/admin-auth";
import { markOrderAsPaid, resetSimpleProductCatalogState } from "../order-db";

test.beforeEach(() => {
  resetSimpleProductCatalogState();
});

type CheckoutOrderInput = {
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string;
  postalCode: string;
  city: string;
};

type CreatedOrder = {
  confirmationUrl: string;
  reference: string;
};

async function createCheckoutOrder(page: Page, input: CheckoutOrderInput): Promise<CreatedOrder> {
  await page.goto("/boutique/pochette-sable");

  const offerCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Produit simple" }) });

  await offerCard.getByLabel("Quantité").fill("1");
  await offerCard.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page).toHaveURL(/\/boutique\/pochette-sable\?cart_status=added$/);

  await page.goto("/checkout");

  await page.locator('input[name="customerFirstName"]').fill(input.firstName);
  await page.locator('input[name="customerLastName"]').fill(input.lastName);
  await page.locator('input[name="customerEmail"]').fill(input.email);
  await page.locator('input[name="shippingAddressLine1"]').fill(input.addressLine1);
  await page.locator('input[name="shippingPostalCode"]').fill(input.postalCode);
  await page.locator('input[name="shippingCity"]').fill(input.city);

  await page.getByRole("button", { name: "Créer la commande" }).click();
  await expect(page).toHaveURL(/\/checkout\/confirmation\/CRY-[A-Z0-9]{10}$/);

  const reference = await page
    .locator("article")
    .filter({ hasText: "Référence" })
    .locator("p.card-copy")
    .first()
    .textContent();

  expect(reference).toMatch(/^CRY-[A-Z0-9]{10}$/);

  return {
    confirmationUrl: page.url(),
    reference: reference ?? "",
  };
}

async function openAdminOrderFromListByReference(page: Page, reference: string): Promise<void> {
  await loginAsSeedAdmin(page);
  await page.goto("/admin/orders");

  const createdOrderRow = page.getByRole("row").filter({ hasText: reference });
  await expect(createdOrderRow).toBeVisible();

  await Promise.all([
    page.waitForURL(/\/admin\/orders\/[0-9]+(?:\?.*)?$/, { timeout: 15_000 }),
    createdOrderRow.getByRole("link", { name: "Voir le détail", exact: true }).click(),
  ]);
}

async function cancelOrderFromAdminDetail(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Annuler la commande" }).click();

  const confirmDialog = page.getByRole("alertdialog", {
    name: "Annuler cette commande ?",
  });
  await expect(confirmDialog).toBeVisible();

  await Promise.all([
    page.waitForURL(/order_status=updated$/, { timeout: 15_000 }),
    confirmDialog.getByRole("button", { name: "Annuler la commande", exact: true }).click(),
  ]);
}

test("creates an order from checkout and clears the cart", async ({ page }) => {
  const { reference } = await createCheckoutOrder(page, {
    firstName: "Jeanne",
    lastName: "Dupont",
    email: "jeanne@example.com",
    addressLine1: "12 rue des Tanneurs",
    postalCode: "75001",
    city: "Paris",
  });

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Commande en attente de paiement",
    })
  ).toBeVisible();
  await expect(
    page.getByText("La commande est créée, mais le paiement doit encore être confirmé.").first()
  ).toBeVisible();
  await expect(page.getByText("En attente", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Paiement en attente").first()).toBeVisible();
  await expect(page.getByText("jeanne@example.com")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pochette Sable" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Payer la commande" })).toBeVisible();

  expect(reference).toMatch(/^CRY-[A-Z0-9]{10}$/);

  await page.goto("/panier");
  await expect(
    page.getByRole("heading", {
      name: "Aucun article n'a encore été ajouté au panier",
    })
  ).toBeVisible();
});

test("reflects a cancelled order consistently on the public confirmation page", async ({
  page,
}) => {
  const { confirmationUrl, reference } = await createCheckoutOrder(page, {
    firstName: "Nina",
    lastName: "Martin",
    email: "nina@example.com",
    addressLine1: "4 rue des Fleurs",
    postalCode: "75002",
    city: "Paris",
  });

  await openAdminOrderFromListByReference(page, reference);
  await cancelOrderFromAdminDetail(page);

  await page.goto(confirmationUrl);
  await expect(page.getByRole("heading", { level: 1, name: "Commande annulée" })).toBeVisible();
  await expect(page.getByText("Annulée", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Cette commande a été annulée.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Payer la commande" })).toHaveCount(0);
});

test("reflects a shipped order consistently on the public confirmation page", async ({ page }) => {
  const { confirmationUrl, reference } = await createCheckoutOrder(page, {
    firstName: "Claire",
    lastName: "Meyer",
    email: "claire@example.com",
    addressLine1: "10 rue du Bac",
    postalCode: "75007",
    city: "Paris",
  });

  markOrderAsPaid(reference);

  await openAdminOrderFromListByReference(page, reference);

  await page.getByRole("button", { name: "Marquer en préparation" }).click();
  await expect(page).toHaveURL(/order_status=updated$/);

  await page.getByLabel("Référence de suivi optionnelle").fill("COL-654321");
  await page.getByRole("button", { name: "Marquer comme expédiée" }).click();
  await expect(page).toHaveURL(/order_status=shipped$/);

  await page.goto(confirmationUrl);
  await expect(page.getByRole("heading", { level: 1, name: "Commande expédiée" })).toBeVisible();
  await expect(page.getByText("Expédiée", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("La commande a quitté l'atelier et est en cours d'acheminement.").first()
  ).toBeVisible();
  await expect(page.getByText(/Date d'expédition : /)).toBeVisible();
  await expect(page.getByText("Référence de suivi : COL-654321")).toBeVisible();
  await expect(page.getByRole("button", { name: "Payer la commande" })).toHaveCount(0);
});
