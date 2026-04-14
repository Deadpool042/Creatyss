"use client";

import { useActionState, useState, type JSX } from "react";

import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
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

function ProductPricingTabInner({
  action,
  priceLists,
  pricingData,
  onReset,
}: ProductPricingTabInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productPricingFormInitialState);

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
            title="Prix produit"
            description="Définissez le prix de base du produit pour chaque liste de prix."
          >
            {priceLists.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune liste de prix disponible.</p>
            ) : (
              priceLists.map((priceList) => {
                const existing = findProductPrice(pricingData, priceList.id);
                return (
                  <div
                    key={priceList.id}
                    className="rounded-xl border border-border bg-background p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{priceList.name}</span>
                      {priceList.isDefault && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          Par défaut
                        </span>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <AdminFormField
                        label="Prix de vente"
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
                        label="Prix avant réduction"
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

                      <AdminFormField
                        label="Coût de revient"
                        htmlFor={`costAmount-${priceList.id}`}
                        error={state.fieldErrors[`costAmount:${priceList.id}`]}
                      >
                        <Input
                          id={`costAmount-${priceList.id}`}
                          name={`costAmount:${priceList.id}`}
                          defaultValue={existing?.costAmount ?? ""}
                          placeholder="—"
                          className="text-sm font-mono"
                        />
                      </AdminFormField>
                    </div>
                  </div>
                );
              })
            )}
          </AdminFormSection>

          {pricingData.variantPrices.length > 0 && (
            <AdminFormSection
              title="Prix variantes"
              description="Chaque variante peut avoir son propre prix. Si aucun prix n’est renseigné, le prix du produit est utilisé."
            >
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
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <ProductPricingTabInner
      key={formInstanceKey}
      {...props}
      onReset={() => setFormInstanceKey((current) => current + 1)}
    />
  );
}
