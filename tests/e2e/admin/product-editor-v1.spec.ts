import { expect, test, type Page } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import {
  openAdminProduct,
  setupAdminEditorScenario,
  type SeededAdminEditorScenario,
} from "./product-test-helpers";

const E2E_VARIANT_NAME = "Variante test E2E";

async function clickEditorTab(page: Page, tabName: string): Promise<void> {
  const tab = page.getByRole("tab", { name: tabName, exact: true }).first();
  const tabPanel = page.getByRole("tabpanel", { name: tabName });

  await expect(tab).toBeVisible();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await tab.scrollIntoViewIfNeeded();
    await tab.click();

    try {
      await expect(tabPanel).toBeVisible({ timeout: 3_000 });
      await expect(tab).toHaveAttribute("aria-selected", "true");
      return;
    } catch {
      await page.waitForTimeout(300);
    }
  }

  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(tabPanel).toBeVisible();
}

function requireScenario(
  scenario: SeededAdminEditorScenario | null
): SeededAdminEditorScenario {
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
      "Produits liés",
      "SEO",
    ] as const;

    for (const tabName of tabs) {
      await clickEditorTab(page, tabName);
    }

    await clickEditorTab(page, "Produits liés");
    await expect(page.getByText("Aucune relation enregistrée pour ce produit.")).toBeVisible();

    await clickEditorTab(page, "Médias");
    await expect(page.getByText("Aucune image principale du produit n'est définie.")).toBeVisible();

    await page.getByRole("button", { name: "Ouvrir les actions des images" }).click();
    await page.getByRole("menuitem", { name: "Associer depuis la bibliothèque" }).click();
    await expect(page.getByRole("heading", { name: "Médiathèque" })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(1);
    await page.getByRole("button", { name: "Annuler" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);

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
    const skuRootField = generalForm.getByLabel("SKU racine");
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
      new RegExp(`/admin/products/${currentScenario.editorProduct.slug}/edit(?:\\?.*)?$`)
    );
    await expect(page.getByRole("tabpanel", { name: "Général" })).toBeVisible();
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
    await createDialog.getByLabel("SKU").fill(initialSku);
    await createDialog.getByRole("button", { name: "Créer" }).click();

    await expect(page.getByRole("dialog")).toHaveCount(0);

    const variantsPanel = page.getByRole("tabpanel", { name: "Variantes" });
    const createdVariantCard = variantsPanel
      .getByTestId("product-variant-card")
      .filter({
        hasText: `SKU ${initialSku}`,
        has: page.getByRole("button", { name: "Modifier" }),
      })
      .first();
    await expect(createdVariantCard).toBeVisible();

    await createdVariantCard.getByRole("button", { name: "Modifier" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(1);

    const editDialog = page.getByRole("dialog").first();
    await editDialog.getByLabel("SKU").fill(updatedSku);
    await editDialog.getByRole("button", { name: "Enregistrer" }).click();

    await expect(page.getByRole("dialog")).toHaveCount(0);

    const updatedVariantCard = variantsPanel
      .getByTestId("product-variant-card")
      .filter({
        hasText: `SKU ${updatedSku}`,
        has: page.getByRole("button", { name: "Modifier" }),
      })
      .first();
    await expect(updatedVariantCard).toBeVisible();
    await expect(updatedVariantCard).toContainText(`SKU ${updatedSku}`);

    variantSku = updatedSku;
  });

  test("modifie la Tarification", async ({ page }) => {
    const currentScenario = requireScenario(scenario);
    const currentVariantSku = requireVariantSku(variantSku);
    const targetPrice = "129.90";

    await loginAsSeedAdmin(page);
    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Tarification");

    const pricingPanel = page.getByRole("tabpanel", { name: "Tarification" });
    await expect(pricingPanel.getByLabel("Prix de vente").first()).toBeVisible();

    const variantRow = pricingPanel
      .locator("tr")
      .filter({ hasText: currentVariantSku })
      .first();
    await expect(variantRow).toBeVisible();
    await expect(variantRow.getByText("—")).toBeVisible();

    const priceField = pricingPanel.getByLabel("Prix de vente").first();
    await priceField.fill(targetPrice);
    await expect(priceField).toHaveValue(targetPrice);
    await pricingPanel.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Tarification mise à jour.")).toBeVisible();
    await expect(pricingPanel).toBeVisible();
    await expect(pricingPanel.getByLabel("Prix de vente").first()).toBeVisible();
  });

  test("modifie Produits liés sans reload manuel", async ({ page }) => {
    const currentScenario = requireScenario(scenario);

    await loginAsSeedAdmin(page);
    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Produits liés");

    const relatedPanel = page.getByRole("tabpanel", { name: "Produits liés" });
    await expect(
      relatedPanel.getByText("Aucune relation enregistrée pour ce produit.")
    ).toBeVisible();

    const addSection = relatedPanel.getByTestId("product-related-add-section").first();
    const targetSelector = addSection.getByRole("combobox").first();
    const escapedTargetName = currentScenario.relatedTargetProduct.name.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    await targetSelector.click();
    await page
      .getByRole("option", {
        name: new RegExp(`^${escapedTargetName}(?:\\s*\\(.*\\))?$`),
      })
      .first()
      .click();
    await expect(targetSelector).toContainText(currentScenario.relatedTargetProduct.name);
    await addSection.getByRole("button", { name: "Ajouter" }).click();
    const relationsSection = relatedPanel
      .locator("section")
      .filter({ hasText: "Relations enregistrées" })
      .first();
    await expect(relationsSection).toContainText(currentScenario.relatedTargetProduct.name);
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
    const availabilityPanel = page.getByRole("tabpanel", { name: "Disponibilité" });
    const availabilityCard = availabilityPanel
      .getByTestId("product-availability-card")
      .filter({ hasText: E2E_VARIANT_NAME })
      .first();
    await expect(availabilityCard).toBeVisible();
    await availabilityCard.getByRole("combobox").first().click();
    await page
      .getByRole("option", { name: "Disponible à la vente", exact: true })
      .click();
    await availabilityPanel.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Disponibilité mise à jour.")).toBeVisible();

    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Disponibilité");
    const refreshedAvailabilityPanel = page.getByRole("tabpanel", { name: "Disponibilité" });
    const refreshedAvailabilityCard = refreshedAvailabilityPanel
      .getByTestId("product-availability-card")
      .filter({ hasText: E2E_VARIANT_NAME })
      .first();
    await expect(refreshedAvailabilityCard).toContainText("Disponible à la vente");

    await clickEditorTab(page, "Stock");
    const stockPanel = page.getByRole("tabpanel", { name: "Stock" });
    const stockCard = stockPanel
      .getByTestId("product-stock-card")
      .filter({ hasText: E2E_VARIANT_NAME })
      .first();

    await expect(stockCard).toBeVisible();
    await expect(stockCard.getByText("État inventaire:")).toBeVisible();
    await expect(stockCard.getByText("À créer")).toBeVisible();

    await stockCard.getByRole("spinbutton").first().fill("7");
    await stockCard.getByRole("spinbutton").nth(1).fill("2");
    await stockPanel.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Stock mis à jour.")).toBeVisible();

    await openAdminProduct(page, currentScenario.editorProduct.detailUrl);
    await clickEditorTab(page, "Stock");
    const refreshedStockPanel = page.getByRole("tabpanel", { name: "Stock" });
    const refreshedStockCard = refreshedStockPanel
      .getByTestId("product-stock-card")
      .filter({ hasText: E2E_VARIANT_NAME })
      .first();
    await expect(refreshedStockCard).toContainText("Enregistré");
    await expect(refreshedStockCard).toContainText("Stock disponible:");
    await expect(refreshedStockCard).toContainText("5");
  });
});
