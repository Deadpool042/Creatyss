"use client";

import { useActionState, type JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";
import {
  productInventoryFormInitialState,
  type AdminProductVariantListItem,
  type ProductInventoryFormAction,
} from "@/features/admin/products/editor/types";
import type { AdminInventoryForecastItem } from "@/features/admin/products/editor/queries";
import { PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME } from "@/features/admin/products/components/shared/product-module-page-shell";

type ProductInventorySectionIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

// ─── Internal components ──────────────────────────────────────────────────────

function InventoryFields({
  variantId,
  inventory,
  availability,
  showLowStockThreshold,
}: {
  variantId: string;
  inventory: AdminProductVariantListItem["inventory"];
  availability: AdminProductVariantListItem["availability"];
  showLowStockThreshold: boolean;
}): JSX.Element {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        <AdminFormField label="Stock physique">
          <Input
            type="number"
            min={0}
            step={1}
            name={`inventoryOnHand:${variantId}`}
            defaultValue={inventory.onHandQuantity.toString()}
            className="text-sm"
          />
        </AdminFormField>

        {showLowStockThreshold ? (
          <AdminFormField label="Seuil stock faible">
            <Input
              type="number"
              min={0}
              step={1}
              name={`inventoryLowStockThreshold:${variantId}`}
              defaultValue={inventory.lowStockThreshold?.toString() ?? ""}
              placeholder="2 (défaut)"
              className="text-sm"
            />
          </AdminFormField>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        Le stock réservé est géré automatiquement par le système. Le stock disponible est calculé en
        conséquence.
      </p>

      <div className="grid gap-3 rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-2 text-xs text-muted-foreground md:grid-cols-2">
        <p>
          Stock disponible:{" "}
          <span className="font-medium text-foreground">{inventory.availableQuantity}</span>
        </p>
        <p>
          Stock réservé :{" "}
          <span className="font-medium text-foreground">{inventory.reservedQuantity}</span>
        </p>
        <p>
          Rupture de stock :{" "}
          <span className="font-medium text-foreground">
            {availability.backorderAllowed ? "Autorisée" : "Non autorisée"}
          </span>
        </p>
        <p>
          État du stock :{" "}
          <span className="font-medium text-foreground">
            {inventory.hasInventoryRecord ? "Enregistré" : "Non enregistré"}
          </span>
        </p>
      </div>
    </>
  );
}

function formatCoverageDays(value: number | null): string {
  if (value === null) {
    return "Signal insuffisant";
  }

  if (value < 1) {
    return "Moins d'un jour";
  }

  return `${Math.round(value)} jours`;
}

function formatAverageDailyUnits(value: number): string {
  if (value <= 0) {
    return "0 / jour";
  }

  return `${value.toFixed(value < 1 ? 2 : 1)} / jour`;
}

function getForecastStatusLabel(forecast: AdminInventoryForecastItem | null): string {
  if (forecast === null || forecast.soldQuantityLast30Days <= 0) {
    return "Aucune vente récente";
  }

  if (forecast.estimatedCoverageDays === null) {
    return "Signal insuffisant";
  }

  if (forecast.estimatedCoverageDays <= 7) {
    return "Couverture courte";
  }

  if (forecast.estimatedCoverageDays <= 14) {
    return "À surveiller";
  }

  return "Couverture stable";
}

function ProductInventorySectionIntro({
  eyebrow,
  title,
  description,
}: ProductInventorySectionIntroProps): JSX.Element {
  return (
    <div className="grid gap-1.5">
      <ProductSectionEyebrow>{eyebrow}</ProductSectionEyebrow>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function VariantInventoryCard({
  variant,
  showLowStockThreshold,
  forecast,
  showInventoryForecasting,
}: {
  variant: AdminProductVariantListItem;
  showLowStockThreshold: boolean;
  forecast: AdminInventoryForecastItem | null;
  showInventoryForecasting: boolean;
}): JSX.Element {
  return (
    <div
      data-testid="product-stock-card"
      className="grid gap-4 border-t border-surface-border pt-4 first:border-t-0 first:pt-0"
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{variant.name ?? "Variante sans nom"}</p>
        <p className="text-xs font-mono text-muted-foreground">{variant.sku}</p>
      </div>

      <InventoryFields
        variantId={variant.id}
        inventory={variant.inventory}
        availability={variant.availability}
        showLowStockThreshold={showLowStockThreshold}
      />

      {showInventoryForecasting ? (
        <div className="grid gap-3 rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-xs text-muted-foreground md:grid-cols-2">
          <p>
            Ventes 30 jours :{" "}
            <span className="font-medium text-foreground">
              {forecast?.soldQuantityLast30Days ?? 0}
            </span>
          </p>
          <p>
            Débit moyen :{" "}
            <span className="font-medium text-foreground">
              {formatAverageDailyUnits(forecast?.averageDailyUnits ?? 0)}
            </span>
          </p>
          <p>
            Couverture estimée :{" "}
            <span className="font-medium text-foreground">
              {formatCoverageDays(forecast?.estimatedCoverageDays ?? null)}
            </span>
          </p>
          <p>
            Lecture :{" "}
            <span className="font-medium text-foreground">
              {getForecastStatusLabel(forecast)}
            </span>
          </p>
        </div>
      ) : null}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type ProductInventoryTabProps = {
  action: ProductInventoryFormAction;
  productId: string;
  variants: AdminProductVariantListItem[];
  isStandalone: boolean;
  showLowStockThreshold: boolean;
  showInventoryForecasting: boolean;
  inventoryForecast: Map<string, AdminInventoryForecastItem>;
};

export function ProductInventoryTab({
  action,
  productId,
  variants,
  isStandalone,
  showLowStockThreshold,
  showInventoryForecasting,
  inventoryForecast,
}: ProductInventoryTabProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productInventoryFormInitialState);
  const hasVariants = variants.length > 0;

  const standaloneVariant = isStandalone
    ? (variants.find((variant) => variant.isDefault) ?? variants[0] ?? null)
    : null;
  const forecastItems = variants
    .map((variant) => inventoryForecast.get(variant.id) ?? null)
    .filter((item): item is AdminInventoryForecastItem => item !== null);
  const variantsAtRiskCount = forecastItems.filter(
    (item) => item.estimatedCoverageDays !== null && item.estimatedCoverageDays <= 14
  ).length;
  const totalSoldLast30Days = forecastItems.reduce(
    (sum, item) => sum + item.soldQuantityLast30Days,
    0
  );

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <input type="hidden" name="productId" value={productId} />

      {variants.map((variant) => (
        <input
          key={`inventory-variant-id:${variant.id}`}
          type="hidden"
          name="inventoryVariantIds"
          value={variant.id}
        />
      ))}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <div className={PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME}>
          <div className="min-w-0 space-y-5 md:space-y-6">
            <AdminFormMessage
              tone={state.status === "error" ? "error" : "success"}
              message={state.status !== "idle" ? state.message : null}
            />

            <div className="divide-y divide-surface-border/40">
              {isStandalone ? (
                <section className="grid gap-6 py-6 first:pt-0">
                  <ProductInventorySectionIntro
                    eyebrow="Stock physique"
                    title="Stock du produit"
                    description="Gérez les quantités disponibles sans mélanger ici la vendabilité commerciale."
                  />

                  {standaloneVariant != null ? (
                    <>
                      {standaloneVariant.sku && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Référence interne :</span>{" "}
                          <span className="font-mono">{standaloneVariant.sku}</span>
                        </p>
                      )}

                      <InventoryFields
                        variantId={standaloneVariant.id}
                        inventory={standaloneVariant.inventory}
                        availability={standaloneVariant.availability}
                        showLowStockThreshold={showLowStockThreshold}
                      />

                      {showInventoryForecasting ? (
                        <div className="grid gap-3 rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-3 text-xs text-muted-foreground md:grid-cols-2">
                          <p>
                            Ventes 30 jours :{" "}
                            <span className="font-medium text-foreground">
                              {inventoryForecast.get(standaloneVariant.id)?.soldQuantityLast30Days ?? 0}
                            </span>
                          </p>
                          <p>
                            Débit moyen :{" "}
                            <span className="font-medium text-foreground">
                              {formatAverageDailyUnits(
                                inventoryForecast.get(standaloneVariant.id)?.averageDailyUnits ?? 0
                              )}
                            </span>
                          </p>
                          <p>
                            Couverture estimée :{" "}
                            <span className="font-medium text-foreground">
                              {formatCoverageDays(
                                inventoryForecast.get(standaloneVariant.id)?.estimatedCoverageDays ??
                                  null
                              )}
                            </span>
                          </p>
                          <p>
                            Lecture :{" "}
                            <span className="font-medium text-foreground">
                              {getForecastStatusLabel(
                                inventoryForecast.get(standaloneVariant.id) ?? null
                              )}
                            </span>
                          </p>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <p className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-muted-foreground">
                      Aucune donnée de stock disponible pour ce produit.
                    </p>
                  )}
                </section>
              ) : (
                <section className="grid gap-6 py-6 first:pt-0">
                  <ProductInventorySectionIntro
                    eyebrow="Déclinaisons"
                    title="Stock par variante"
                    description="Gérez les quantités physiques par déclinaison sans modifier ici la vendabilité."
                  />

                  {hasVariants ? (
                    <div className="grid gap-4">
                      {variants.map((variant) => (
                        <VariantInventoryCard
                          key={variant.id}
                          variant={variant}
                          showLowStockThreshold={showLowStockThreshold}
                          forecast={inventoryForecast.get(variant.id) ?? null}
                          showInventoryForecasting={showInventoryForecasting}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-muted-foreground">
                      Aucune variante disponible pour gérer le stock.
                    </p>
                  )}
                </section>
              )}
            </div>
          </div>

          <aside className="min-w-0 xl:sticky xl:top-6">
            <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/80">
              <section className="grid gap-4 px-5 py-5">
                <ProductInventorySectionIntro
                  eyebrow="Repères"
                  title="Lecture stock"
                />

                <div className="divide-y divide-surface-border">
                  <div className="grid gap-1.5 py-3 first:pt-0">
                    <ProductSectionEyebrow className="tracking-[0.14em]">Périmètre</ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">
                      {isStandalone ? "Produit simple" : `${variants.length} variantes`}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Ce module suit les quantités physiques, pas l’état commercial de vente.
                    </p>
                  </div>

                  <div className="grid gap-1.5 py-3">
                    <ProductSectionEyebrow className="tracking-[0.14em]">Calcul</ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">Disponible = physique - réservé</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Le stock réservé est géré automatiquement par le système.
                    </p>
                  </div>

                  <div className="grid gap-1.5 py-3 last:pb-0">
                    <ProductSectionEyebrow className="tracking-[0.14em]">Rupture</ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">Backorders séparés</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      L’autorisation de vente en rupture reste pilotée depuis le module Disponibilité.
                    </p>
                  </div>

                  {showInventoryForecasting ? (
                    <div className="grid gap-1.5 py-3 last:pb-0">
                      <ProductSectionEyebrow className="tracking-[0.14em]">Prévision</ProductSectionEyebrow>
                      <p className="text-sm font-medium text-foreground">
                        {variantsAtRiskCount > 0
                          ? `${variantsAtRiskCount} variante(s) à surveiller`
                          : "Couverture sans alerte immédiate"}
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {totalSoldLast30Days} unité(s) vendue(s) sur 30 jours. Estimation simple :
                        stock disponible rapporté au débit observé récent.
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-end gap-2 sm:w-auto sm:justify-end"
        className={[
          "bottom-[calc(3.5rem+env(safe-area-inset-bottom))]",
          "[@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom))]",
          "lg:bottom-0",
        ].join(" ")}
        overlay
      >
        <Button
          type="submit"
          variant="outline"
          size="xs"
          className="h-8 w-fit rounded-full border-shell-border px-4 text-foreground shadow-none sm:flex-none lg:h-9"
          disabled={pending || !hasVariants}
        >
          {pending ? "Mise à jour…" : "Enregistrer"}
        </Button>
      </AdminFormFooter>
    </form>
  );
}
