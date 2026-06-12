import { expect, test, type Locator, type Page } from "@playwright/test";
import { loginAsSeedAdmin } from "../admin/admin-auth";
import { ensureCommerceSmokeFixture } from "../commerce-db";

function extractOrderReference(page: Page): string {
  const match = page.url().match(/\/checkout\/confirmation\/(CMD-[A-Z0-9]{10})(?:\?.*)?$/);

  if (match?.[1] === undefined) {
    throw new Error(`Unable to extract order reference from URL: ${page.url()}`);
  }

  return match[1];
}

function getSelectableButton(page: Page, name: string): Locator {
  return page.getByRole("button", { name });
}

async function addFixtureProductToCart(
  page: Page,
  fixture: Awaited<ReturnType<typeof ensureCommerceSmokeFixture>>
): Promise<void> {
  await page.goto(`/boutique/${fixture.productSlug}`);

  // La fiche produit n'expose pas forcément le nom de variante pour un produit
  // simple : on s'appuie uniquement sur des éléments stables (heading + CTA).
  await expect(page.getByRole("heading", { name: fixture.productName }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Ajouter au panier" }).first()).toBeVisible();

  // L'input natif de quantité peut être masqué au profit d'un stepper custom :
  // on vérifie la valeur par défaut (1) sans exiger la visibilité, sans fill.
  await expect(page.locator('input[name="quantity"]').first()).toHaveValue("1");
  await page.getByRole("button", { name: "Ajouter au panier" }).first().click();

  // Attendre la confirmation effective de l'ajout avant de quitter la page.
  // Le toast fiche produit affiche « Ajouté au panier. » (cf.
  // product-page-cart-feedback-toast.tsx) ; les assertions sur
  // ?cart_status=added sont racées car le toast retire aussitôt ce paramètre.
  await expect(page.getByText("Ajouté au panier.").first()).toBeVisible({ timeout: 10_000 });

  await page.goto("/panier");
  await expect(page.getByRole("heading", { level: 1, name: "Votre panier" })).toBeVisible();
  await expect(page.getByText(fixture.productName).first()).toBeVisible();
}

async function saveGuestCheckoutDraft(page: Page, customerEmail: string): Promise<void> {
  await page.goto("/checkout");

  await expect(page.getByRole("heading", { name: "Finaliser la commande" })).toBeVisible();
  await page.locator('input[name="customerFirstName"]').fill("Jeanne");
  await page.locator('input[name="customerLastName"]').fill("Smoke");
  await page.locator('input[name="customerEmail"]').fill(customerEmail);
  await page.locator('input[name="customerPhone"]').fill("0601020304");
  await page.locator('input[name="shippingAddressLine1"]').fill("12 rue des Tanneurs");
  await page.locator('input[name="shippingPostalCode"]').fill("75001");
  await page.locator('input[name="shippingCity"]').fill("Paris");

  await page.getByRole("button", { name: "Enregistrer mes informations" }).click();

  await expect(page).toHaveURL(/\/checkout\?status=saved$/);
  await expect(page.getByText("Les informations de commande ont été enregistrées.")).toBeVisible();
}

async function selectShippingAndPayment(
  page: Page,
  fixture: Awaited<ReturnType<typeof ensureCommerceSmokeFixture>>
): Promise<void> {
  const shippingButton = getSelectableButton(page, fixture.shippingMethodName);
  await shippingButton.click();
  await expect(shippingButton.locator('[role="radio"][aria-checked="true"]')).toBeVisible();

  const paymentButton = getSelectableButton(page, "Virement bancaire");
  await paymentButton.click();
  await expect(paymentButton.locator('[role="radio"][aria-checked="true"]')).toBeVisible();
}

test("creates a guest order and exposes it in admin orders", async ({ page }) => {
  const fixture = await ensureCommerceSmokeFixture();
  const runId = Date.now().toString(36);
  const customerEmail = `commerce-smoke+${runId}@creatyss.test`;

  await addFixtureProductToCart(page, fixture);
  await saveGuestCheckoutDraft(page, customerEmail);
  await selectShippingAndPayment(page, fixture);

  await page.getByRole("button", { name: "Créer la commande" }).click();

  await expect(page).toHaveURL(/\/checkout\/confirmation\/CMD-[A-Z0-9]{10}$/);
  const reference = extractOrderReference(page);

  await expect(
    page.getByRole("heading", { level: 1, name: "Commande en attente de paiement" })
  ).toBeVisible();
  await expect(page.getByText(reference)).toBeVisible();
  await expect(page.getByText(customerEmail)).toBeVisible();
  await expect(page.getByText("Paiement en attente").first()).toBeVisible();
  await expect(page.getByText("Virement bancaire").first()).toBeVisible();

  await page.goto("/panier");
  await expect(
    page.getByRole("heading", {
      name: "Aucun article n'a encore été ajouté au panier",
    })
  ).toBeVisible();

  await loginAsSeedAdmin(page);
  await page.goto(`/admin/commerce/orders/overview?search=${encodeURIComponent(reference)}`);

  const orderRow = page.locator("[data-order-row]").filter({ hasText: reference }).first();
  await expect(orderRow).toBeVisible();
  await expect(orderRow).toContainText("Paiement en attente");

  await orderRow.click();

  // (?!overview) : l'URL de départ matche déjà /orders/overview, il faut
  // attendre la vraie navigation vers le détail. Timeout élargi : en dev,
  // Next compile la route détail à la première visite (souvent > 5 s).
  await page.waitForURL(/\/admin\/commerce\/orders\/(?!overview)[^/?]+(?:\?.*)?$/, {
    timeout: 15_000,
  });
  await expect(page.getByRole("heading", { name: `Commande ${reference}` })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText(customerEmail).first()).toBeVisible();
  await expect(page.getByText("Paiement en attente").first()).toBeVisible();
  await expect(page.getByText("Virement bancaire").first()).toBeVisible();
});
