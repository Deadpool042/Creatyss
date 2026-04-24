"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, type JSX } from "react";

import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  productPricingFormInitialState,
  type AdminProductPricingData,
  type AdminPriceListOption,
  type ProductPricingFormAction,
} from "@/features/admin/products/editor/types";

type ProductPricingTabProps = {
  action: ProductPricingFormAction;
  priceLists: readonly AdminPriceListOption[];
  pricingData: AdminProductPricingData;
  isStandalone: boolean;
};

type ProductPricingTabInnerProps = ProductPricingTabProps & {
  onReset: () => void;
};

function findProductPrice(pricingData: AdminProductPricingData, priceListId: string) {
  return pricingData.productPrices.find((p) => p.priceListId === priceListId) ?? null;
}

function findVariantPrice(
  pricingData: AdminProductPricingData,
  variantId: string,
  priceListId: string
) {
  const variantEntry = pricingData.variantPrices.find((v) => v.variantId === variantId);
  return variantEntry?.prices.find((p) => p.priceListId === priceListId) ?? null;
}

type PromotionStatus = "active" | "planned" | "expired" | "none";

function getPromotionStatus(startsAt: string | null, endsAt: string | null): PromotionStatus {
  if (!startsAt && !endsAt) return "none";
  const now = new Date();
  const start = startsAt ? new Date(startsAt) : null;
  const end = endsAt ? new Date(endsAt) : null;
  if (end && end < now) return "expired";
  if (start && start > now) return "planned";
  if ((!start || start <= now) && (!end || end >= now)) return "active";
  return "none";
}

function PromotionBadge({
  startsAt,
  endsAt,
}: {
  startsAt: string | null;
  endsAt: string | null;
}): JSX.Element | null {
  const status = getPromotionStatus(startsAt, endsAt);
  if (status === "none") return null;
  if (status === "expired") {
    return <Badge variant="secondary">Expirée</Badge>;
  }
  if (status === "planned") {
    return <Badge variant="outline">Planifiée</Badge>;
  }
  return <Badge variant="default">Active</Badge>;
}

function ProductPricingTabInner({
  action,
  priceLists,
  pricingData,
  isStandalone,
  onReset,
}: ProductPricingTabInnerProps): JSX.Element {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, productPricingFormInitialState);
  const defaultPriceList = priceLists.find((priceList) => priceList.isDefault) ?? null;
  const advancedPriceLists = priceLists.filter((priceList) => !priceList.isDefault);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router]);

  const storefrontPricingHint =
    "La boutique affiche actuellement un prix simple. Les listes de prix et la planification de promotion ne pilotent pas encore l'affichage storefront (V1).";

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <input type="hidden" name="productId" value={pricingData.productId} />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <div className="w-full space-y-6 px-4 py-4 md:space-y-7 md:px-6 md:py-6 lg:mx-auto lg:max-w-4xl lg:px-5 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:py-3">
          <AdminFormMessage
            tone={state.status === "success" ? "success" : "error"}
            message={state.status !== "idle" ? state.message : null}
          />

          <AdminFormSection
            title="Prix boutique (principal)"
            description="Définissez le prix affiché sur la boutique. Laisser vide désactive ce tarif."
          >
            <p className="text-xs leading-5 text-muted-foreground">{storefrontPricingHint}</p>

            {priceLists.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune liste de prix disponible.</p>
            ) : defaultPriceList ? (
              <div className="rounded-2xl border border-surface-border bg-card p-4 shadow-card space-y-3 md:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {defaultPriceList.name}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {defaultPriceList.currencyCode}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Boutique
                  </span>
                </div>

                {(() => {
                  const existing = findProductPrice(pricingData, defaultPriceList.id);
                  const startsAt = existing?.startsAt ?? null;
                  const endsAt = existing?.endsAt ?? null;

                  return (
                    <>
                      {/* costAmount est masqué de l'UI mais transporté en hidden pour ne pas écraser la valeur en base */}
                      <input
                        type="hidden"
                        name={`costAmount:${defaultPriceList.id}`}
                        value={existing?.costAmount ?? ""}
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <AdminFormField
                          label="Prix"
                          htmlFor={`amount-${defaultPriceList.id}`}
                          error={state.fieldErrors[`amount:${defaultPriceList.id}`]}
                          hint="Montant affiché sur la fiche produit."
                        >
                          <Input
                            id={`amount-${defaultPriceList.id}`}
                            name={`amount:${defaultPriceList.id}`}
                            defaultValue={existing?.amount ?? ""}
                            placeholder="0.00"
                            className="text-sm font-mono"
                          />
                        </AdminFormField>

                        <AdminFormField
                          label="Prix barré (optionnel)"
                          htmlFor={`compareAtAmount-${defaultPriceList.id}`}
                          error={state.fieldErrors[`compareAtAmount:${defaultPriceList.id}`]}
                          hint="Affiché barré pour indiquer une promotion."
                        >
                          <Input
                            id={`compareAtAmount-${defaultPriceList.id}`}
                            name={`compareAtAmount:${defaultPriceList.id}`}
                            defaultValue={existing?.compareAtAmount ?? ""}
                            placeholder="—"
                            className="text-sm font-mono"
                          />
                        </AdminFormField>
                      </div>

                      <details className="rounded-xl border border-border bg-background/50 px-4 py-3">
                        <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
                          Options avancées (promotion)
                        </summary>
                        <div className="mt-3 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              Période de promotion
                            </span>
                            <PromotionBadge startsAt={startsAt} endsAt={endsAt} />
                          </div>
                          <p className="text-xs leading-5 text-muted-foreground">
                            Ces dates sont enregistrées mais ne pilotent pas encore l&apos;affichage
                            storefront en V1.
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <AdminFormField
                              label="Début"
                              htmlFor={`startsAt-${defaultPriceList.id}`}
                              error={state.fieldErrors[`startsAt:${defaultPriceList.id}`]}
                            >
                              <Input
                                id={`startsAt-${defaultPriceList.id}`}
                                name={`startsAt:${defaultPriceList.id}`}
                                type="date"
                                defaultValue={startsAt ?? ""}
                                className="text-sm font-mono"
                              />
                            </AdminFormField>

                            <AdminFormField
                              label="Fin"
                              htmlFor={`endsAt-${defaultPriceList.id}`}
                              error={state.fieldErrors[`endsAt:${defaultPriceList.id}`]}
                            >
                              <Input
                                id={`endsAt-${defaultPriceList.id}`}
                                name={`endsAt:${defaultPriceList.id}`}
                                type="date"
                                defaultValue={endsAt ?? ""}
                                className="text-sm font-mono"
                              />
                            </AdminFormField>
                          </div>
                        </div>
                      </details>
                    </>
                  );
                })()}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune liste de prix n&apos;est marquée comme “par défaut”.
              </p>
            )}
          </AdminFormSection>

          {advancedPriceLists.length > 0 ? (
            <AdminFormSection
              title="Listes de prix (avancé)"
              description="Pour des besoins spécifiques. La boutique V1 ne choisit pas encore une liste de prix."
            >
              <details className="rounded-2xl border border-surface-border bg-card p-4 shadow-card md:p-5">
                <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
                  Afficher les autres listes de prix ({advancedPriceLists.length})
                </summary>
                <div className="mt-4 space-y-4">
                  {advancedPriceLists.map((priceList) => {
                    const existing = findProductPrice(pricingData, priceList.id);
                    const startsAt = existing?.startsAt ?? null;
                    const endsAt = existing?.endsAt ?? null;

                    return (
                      <div
                        key={priceList.id}
                        className="rounded-xl border border-border bg-background p-4 space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{priceList.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {priceList.currencyCode}
                          </span>
                        </div>

                        {/* costAmount est masqué de l'UI mais transporté en hidden pour ne pas écraser la valeur en base */}
                        <input
                          type="hidden"
                          name={`costAmount:${priceList.id}`}
                          value={existing?.costAmount ?? ""}
                        />

                        <div className="grid gap-3 sm:grid-cols-2">
                          <AdminFormField
                            label="Prix"
                            htmlFor={`amount-${priceList.id}`}
                            error={state.fieldErrors[`amount:${priceList.id}`]}
                          >
                            <Input
                              id={`amount-${priceList.id}`}
                              name={`amount:${priceList.id}`}
                              defaultValue={existing?.amount ?? ""}
                              placeholder="0.00"
                              className="text-sm font-mono"
                            />
                          </AdminFormField>

                          <AdminFormField
                            label="Prix barré"
                            htmlFor={`compareAtAmount-${priceList.id}`}
                            error={state.fieldErrors[`compareAtAmount:${priceList.id}`]}
                          >
                            <Input
                              id={`compareAtAmount-${priceList.id}`}
                              name={`compareAtAmount:${priceList.id}`}
                              defaultValue={existing?.compareAtAmount ?? ""}
                              placeholder="—"
                              className="text-sm font-mono"
                            />
                          </AdminFormField>
                        </div>

                        <details className="rounded-lg border border-border bg-background/40 px-3 py-2.5">
                          <summary className="cursor-pointer list-none text-xs font-medium text-muted-foreground">
                            Promotion (avancé)
                            <span className="ml-2 align-middle">
                              <PromotionBadge startsAt={startsAt} endsAt={endsAt} />
                            </span>
                          </summary>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <AdminFormField
                              label="Début"
                              htmlFor={`startsAt-${priceList.id}`}
                              error={state.fieldErrors[`startsAt:${priceList.id}`]}
                            >
                              <Input
                                id={`startsAt-${priceList.id}`}
                                name={`startsAt:${priceList.id}`}
                                type="date"
                                defaultValue={startsAt ?? ""}
                                className="text-sm font-mono"
                              />
                            </AdminFormField>

                            <AdminFormField
                              label="Fin"
                              htmlFor={`endsAt-${priceList.id}`}
                              error={state.fieldErrors[`endsAt:${priceList.id}`]}
                            >
                              <Input
                                id={`endsAt-${priceList.id}`}
                                name={`endsAt:${priceList.id}`}
                                type="date"
                                defaultValue={endsAt ?? ""}
                                className="text-sm font-mono"
                              />
                            </AdminFormField>
                          </div>
                          <p className="mt-3 text-xs leading-5 text-muted-foreground">
                            Stockage uniquement. Non consommé storefront V1.
                          </p>
                        </details>
                      </div>
                    );
                  })}
                </div>
              </details>
            </AdminFormSection>
          ) : null}

          {pricingData.variantPrices.length > 0 && !isStandalone && (
            <AdminFormSection
              title="Prix variantes"
              description="Chaque variante peut avoir son propre prix. Si aucun prix n'est renseigné, le prix du produit est utilisé."
            >
              <p className="text-xs text-muted-foreground leading-5">
                Lecture seule (V1). L&apos;édition des prix par variante n&apos;est pas encore
                disponible dans l&apos;admin. La boutique applique: prix variante si présent, sinon
                prix produit.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        Variante
                      </th>
                      {priceLists.map((pl) => (
                        <th
                          key={pl.id}
                          className="px-3 py-2 text-right text-xs font-medium text-muted-foreground"
                        >
                          {pl.name}
                          <span className="ml-1 font-mono font-normal opacity-60">
                            {pl.currencyCode}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pricingData.variantPrices.map((variant, index) => {
                      const isLast = index === pricingData.variantPrices.length - 1;
                      return (
                        <tr
                          key={variant.variantId}
                          className={isLast ? "" : "border-b border-border"}
                        >
                          <td className="px-3 py-2.5">
                            <div className="font-medium text-foreground">
                              {variant.variantName ?? "—"}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {variant.variantSku}
                            </div>
                          </td>
                          {priceLists.map((pl) => {
                            const variantPrice = findVariantPrice(
                              pricingData,
                              variant.variantId,
                              pl.id
                            );
                            const productPrice = findProductPrice(pricingData, pl.id);

                            if (
                              variantPrice?.amount !== null &&
                              variantPrice?.amount !== undefined
                            ) {
                              return (
                                <td key={pl.id} className="px-3 py-2.5 text-right">
                                  <div className="font-mono text-foreground">
                                    {variantPrice.amount}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">
                                    Prix appliqué · Prix spécifique
                                  </div>
                                </td>
                              );
                            }

                            if (
                              productPrice?.amount !== null &&
                              productPrice?.amount !== undefined
                            ) {
                              return (
                                <td key={pl.id} className="px-3 py-2.5 text-right">
                                  <div className="font-mono text-foreground">
                                    {productPrice.amount}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">
                                    Prix appliqué · Prix du produit
                                  </div>
                                </td>
                              );
                            }

                            return (
                              <td
                                key={pl.id}
                                className="px-3 py-2.5 text-right text-muted-foreground"
                              >
                                —
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </AdminFormSection>
          )}
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end"
        className={[
          "bottom-[calc(3.5rem+env(safe-area-inset-bottom))]",
          "[@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom))]",
          "lg:bottom-0",
        ].join(" ")}
        overlay
      >
        <Button
          variant="ghost"
          type="button"
          size="xs"
          className="h-8 rounded-full px-4 text-muted-foreground hover:text-foreground lg:h-9"
          onClick={onReset}
        >
          Réinitialiser
        </Button>

        <Button
          type="submit"
          variant="outline"
          size="xs"
          className="h-8 w-fit rounded-full border-border px-4 text-foreground shadow-none sm:flex-none lg:h-9"
          disabled={pending}
        >
          {pending ? "Mise à jour…" : "Enregistrer"}
        </Button>
      </AdminFormFooter>
    </form>
  );
}

export function ProductPricingTab(props: ProductPricingTabProps): JSX.Element {
  const [manualResetKey, setManualResetKey] = useState(0);

  // Derive a stable key from the content of productPrices. When router.refresh()
  // completes after a successful save, the Server Component sends new pricingData;
  // the key changes, causing ProductPricingTabInner to remount and reinitialize
  // its uncontrolled <Input defaultValue> fields from the fresh server values.
  const serverDataKey = JSON.stringify(props.pricingData.productPrices);

  return (
    <ProductPricingTabInner
      key={`${manualResetKey}-${serverDataKey}`}
      {...props}
      onReset={() => setManualResetKey((current) => current + 1)}
    />
  );
}
