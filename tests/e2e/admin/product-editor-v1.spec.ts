import { expect, test, type Page } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import {
  openAdminProduct,
  setupAdminEditorScenario,
  type SeededAdminEditorScenario,
} from "./product-test-helpers";

const E2E_VARIANT_NAME = "Variante test E2E";

const NAV_LABEL_MAP: Record<string, { label: string; segment: string }> = {
  Général: { label: "Edition", segment: "edit" },
  Variantes: { label: "Variantes", segment: "variants" },
  Tarification: { label: "Prix", segment: "pricing" },
  Disponibilité: { label: "Disponibilite", segment: "availability" },
  Stock: { label: "Stock", segment: "inventory" },
  Médias: { label: "Medias", segment: "media" },
  Catégories: { label: "Categories", segment: "categories" },
  Caractéristiques: { label: "Caracteristiques", segment: "characteristics" },
  "Produits liés": { label: "Produits lies", segment: "related" },
  SEO: { label: "SEO", segment: "seo" },
};

async function clickEditorTab(page: Page, tabName: string): Promise<void> {
  const navEntry = NAV_LABEL_MAP[tabName];
  if (!navEntry) throw new Error(`Tab inconnu : ${tabName}`);

  const nav = page.locator('nav[aria-label="Navigation produit"]');
  const link = nav.getByRole("link", { name: navEntry.label, exact: true });

  await expect(link).toBeVisible();
  await link.click();
  await page.waitForURL(new RegExp(`/${navEntry.segment}(?:[?#]|$)`));
}

function requireScenario(scenario: SeededAdminEditorScenario | null): SeededAdminEditorScenario {
  if (scenario === null) {
    throw new Error("Scénario éditeur non initialisé.");
  }

  return scenario;
}

function requireVariantSku(variantSku: string | null): string {
  if (variantSku === null) {
    throw new Error("SKU variante non initialisée.");
  }

  return variantSku;
}

test.describe.serial("admin editor product v1 smoke", () => {
  test.describe.configure({ timeout: 180_000 });

  let scenario: SeededAdminEditorScenario | null = null;
  let variantSku: string | null = null;

  test("ouvre /edit, navigue tabs, vérifie responsive et états vides", async ({ page }) => {
    await loginAsSeedAdmin(page);
    scenario = await setupAdminEditorScenario(page);

    await openAdminProduct(page, scenario.editorProduct.detailUrl);

    const tabs = [
      "Général",
      "Variantes",
      "Tarification",
      "Disponibilité",
      "Stock",
      "Médias",
      "Catégories",
      "Caractéristiques",
      "Produits liés",
      "SEO",
    ] as const;

    for (const tabName of tabs) {
      await clickEditorTab(page, tabName);
    }

    await clickEditorTab(page, "Produits liés");
    await expect(page.getByText("Aucun produit lié pour le moment.")).toBeVisible();

    await clickEditorTab(page, "Médias");
    await expect(page.getByText("Aucune image principale du produit n'est définie.")).toBeVisible();

    await page.getByRole("button", { name: "Choisir depuis la médiathèque" }).click();
    await expect(page.getByRole("heading", { name: "Médiathèque" })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(1);
    await page.getByRole("button", { name: "Annuler" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await clickEditorTab(page, "Caractéristiques");
    await expect(page.getByText("Aucune caractéristique enregistrée.")).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await openAdminProduct(page, scenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Général");

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    });

    expect(hasHorizontalOverflow).toBeFalsy();
    await expect(page.getByRole("button", { name: "Enregistrer" }).first()).toBeVisible();
  });

  test("modifie Général puis sauvegarde sans reload manuel", async ({ page }) => {
    const currentScenario = requireScenario(scenario);

    await loginAsSeedAdmin(page);
    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Général");

    const generalForm = page
      .locator("form")
      .filter({ has: page.getByLabel("Nom du produit") })
      .first();
    const skuRootField = generalForm.getByLabel("Référence interne");
    const updatedSkuRoot = `ROOT-E2E-${Date.now()}`;

    let skuRootFilled = false;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      await skuRootField.fill(updatedSkuRoot);
      const currentValue = await skuRootField.inputValue();
      if (currentValue === updatedSkuRoot) {
        skuRootFilled = true;
        break;
      }
      await page.waitForTimeout(250);
    }
    expect(skuRootFilled).toBeTruthy();

    await generalForm.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page).toHaveURL(
      new RegExp(`/admin/catalog/products/${currentScenario.editorProduct.slug}/edit(?:\\?.*)?$`)
    );
    await expect(page.locator("main")).toBeVisible();
  });

  test("crée puis modifie une variante et constate le refresh UI", async ({ page }) => {
    const currentScenario = requireScenario(scenario);
    const initialSku = `SKU-E2E-${Date.now()}`;
    const updatedSku = `${initialSku}-UPD`;

    await loginAsSeedAdmin(page);
    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Variantes");

    await page.getByRole("button", { name: "Ajouter une variante" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(1);

    const createDialog = page.getByRole("dialog").first();
    await createDialog.getByLabel("Nom").fill(E2E_VARIANT_NAME);
    await createDialog.getByLabel("Référence interne").fill(initialSku);
    await createDialog.getByRole("button", { name: "Créer" }).click();

    await expect(page.getByRole("dialog")).toHaveCount(0);

    const variantsPanel = page.locator("main");
    const createdVariantCard = variantsPanel
      .getByTestId("product-variant-card")
      .filter({
        hasText: `Réf. interne ${initialSku}`,
        has: page.getByRole("button", { name: "Modifier" }),
      })
      .first();
    await expect(createdVariantCard).toBeVisible();

    await createdVariantCard.getByRole("button", { name: "Modifier" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(1);

    const editDialog = page.getByRole("dialog").first();
    await editDialog.getByLabel("Référence interne").fill(updatedSku);
    await editDialog.getByRole("button", { name: "Enregistrer" }).click();

    await expect(page.getByRole("dialog")).toHaveCount(0);

    const updatedVariantCard = variantsPanel
      .getByTestId("product-variant-card")
      .filter({
        hasText: `Réf. interne ${updatedSku}`,
        has: page.getByRole("button", { name: "Modifier" }),
      })
      .first();
    await expect(updatedVariantCard).toBeVisible();
    await expect(updatedVariantCard).toContainText(`Réf. interne ${updatedSku}`);

    variantSku = updatedSku;
  });

  test("modifie la Tarification", async ({ page }) => {
    const currentScenario = requireScenario(scenario);
    const currentVariantSku = requireVariantSku(variantSku);
    const targetPrice = "129.90";

    await loginAsSeedAdmin(page);
    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Tarification");

    const pricingPanel = page.locator("main");
    await expect(pricingPanel.getByLabel("Prix").first()).toBeVisible();

    const variantRow = pricingPanel.locator("tr").filter({ hasText: currentVariantSku }).first();
    await expect(variantRow).toBeVisible();
    await expect(variantRow.getByText("—")).toBeVisible();

    const priceField = pricingPanel.getByLabel("Prix").first();
    await priceField.fill(targetPrice);
    await expect(priceField).toHaveValue(targetPrice);
    await pricingPanel.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Tarification mise à jour.")).toBeVisible();
    await expect(pricingPanel).toBeVisible();
    await expect(pricingPanel.getByLabel("Prix").first()).toBeVisible();
  });

  test("modifie Produits liés sans reload manuel", async ({ page }) => {
    const currentScenario = requireScenario(scenario);

    await loginAsSeedAdmin(page);
    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Produits liés");

    const relatedPanel = page.locator("main");
    await expect(relatedPanel.getByText("Aucun produit lié pour le moment.")).toBeVisible();

    const addSection = relatedPanel.getByTestId("product-related-add-section").first();
    const targetSelector = addSection.getByRole("combobox").first();
    const escapedTargetName = currentScenario.relatedTargetProduct.name.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    await targetSelector.click();
    await page
      .getByRole("option", {
        name: new RegExp(escapedTargetName),
      })
      .first()
      .click();
    await expect(targetSelector).toContainText(currentScenario.relatedTargetProduct.name);
    await addSection.getByRole("button", { name: "Ajouter" }).click();
    await expect(relatedPanel).toContainText(currentScenario.relatedTargetProduct.name);
    await relatedPanel.getByRole("button", { name: "Enregistrer" }).click();
    await expect(relatedPanel).toBeVisible();
  });

  test("modifie Disponibilité + Stock pour une variante sans records initiaux", async ({
    page,
  }) => {
    const currentScenario = requireScenario(scenario);
    requireVariantSku(variantSku);

    await loginAsSeedAdmin(page);
    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);

    await clickEditorTab(page, "Disponibilité");
    const availabilityPanel = page.locator("main");
    const availabilityCard = availabilityPanel
      .getByTestId("product-availability-card")
      .filter({ hasText: E2E_VARIANT_NAME })
      .first();
    await expect(availabilityCard).toBeVisible();
    await availabilityCard.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Disponible à la vente", exact: true }).click();
    await availabilityPanel.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Disponibilité mise à jour.")).toBeVisible();

    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Disponibilité");
    const refreshedAvailabilityPanel = page.locator("main");
    const refreshedAvailabilityCard = refreshedAvailabilityPanel
      .getByTestId("product-availability-card")
      .filter({ hasText: E2E_VARIANT_NAME })
      .first();
    await expect(refreshedAvailabilityCard).toContainText("Disponible à la vente");

    await clickEditorTab(page, "Stock");
    const stockPanel = page.locator("main");
    const stockCard = stockPanel
      .getByTestId("product-stock-card")
      .filter({ hasText: E2E_VARIANT_NAME })
      .first();

    await expect(stockCard).toBeVisible();
    await expect(stockCard.getByText("État du stock :")).toBeVisible();
    await expect(stockCard.getByText("Non enregistré")).toBeVisible();

    await stockCard.getByRole("spinbutton").first().fill("7");
    await stockPanel.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Stock mis à jour.")).toBeVisible();

    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Stock");
    const refreshedStockPanel = page.locator("main");
    const refreshedStockCard = refreshedStockPanel
      .getByTestId("product-stock-card")
      .filter({ hasText: E2E_VARIANT_NAME })
      .first();
    await expect(refreshedStockCard).toContainText("Enregistré");
    await expect(refreshedStockCard).toContainText("Stock disponible:");
    await expect(refreshedStockCard).toContainText("7");
  });
});
