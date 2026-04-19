"use client";

import { useActionState, type JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  productInventoryFormInitialState,
  type AdminProductVariantListItem,
  type ProductInventoryFormAction,
} from "@/features/admin/products/editor/public";

type ProductInventoryTabProps = {
  action: ProductInventoryFormAction;
  productId: string;
  variants: AdminProductVariantListItem[];
  isStandalone: boolean;
};

export function ProductInventoryTab({
  action,
  productId,
  variants,
  isStandalone,
}: ProductInventoryTabProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productInventoryFormInitialState);
  const hasVariants = variants.length > 0;

  const standaloneVariant = isStandalone ? variants[0] : null;

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
        <div className="w-full space-y-6 px-4 py-4 md:space-y-7 md:px-6 md:py-6 lg:mx-auto lg:max-w-4xl lg:px-5 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:py-3">
          <AdminFormMessage
            tone={state.status === "error" ? "error" : "success"}
            message={state.status !== "idle" ? state.message : null}
          />

          {isStandalone ? (
            <AdminFormSection
              title="Stock du produit"
              description="Gérez les quantités disponibles pour ce produit."
            >
              {standaloneVariant != null ? (
                <div
                  data-testid="product-stock-card"
                  className="space-y-4 rounded-xl border border-surface-border bg-card p-4"
                >
                  {standaloneVariant.sku && (
                    <p className="text-xs font-mono text-muted-foreground">
                      {standaloneVariant.sku}
                    </p>
                  )}

                  <div className="grid gap-3 md:grid-cols-2">
                    <AdminFormField label="Stock physique">
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        name={`inventoryOnHand:${standaloneVariant.id}`}
                        defaultValue={standaloneVariant.inventory.onHandQuantity.toString()}
                        className="text-sm"
                      />
                    </AdminFormField>

                    <AdminFormField label="Stock réservé">
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        name={`inventoryReserved:${standaloneVariant.id}`}
                        defaultValue={standaloneVariant.inventory.reservedQuantity.toString()}
                        className="text-sm"
                      />
                    </AdminFormField>
                  </div>

                  <div className="grid gap-3 rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-2 text-xs text-muted-foreground md:grid-cols-3">
                    <p>
                      Stock disponible:{" "}
                      <span className="font-medium text-foreground">
                        {standaloneVariant.inventory.availableQuantity}
                      </span>
                    </p>
                    <p>
                      Backorder:{" "}
                      <span className="font-medium text-foreground">
                        {standaloneVariant.availability.backorderAllowed ? "Autorisé" : "Interdit"}
                      </span>
                    </p>
                    <p>
                      État inventaire:{" "}
                      <span className="font-medium text-foreground">
                        {standaloneVariant.inventory.hasInventoryRecord ? "Enregistré" : "À créer"}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-muted-foreground">
                  Aucune donnée de stock disponible pour ce produit.
                </p>
              )}
            </AdminFormSection>
          ) : (
            <AdminFormSection
              title="Stock par variante"
              description="Gérez les quantités de stock sans modifier ici la vendabilité."
            >
              {hasVariants ? (
                <div className="space-y-4">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      data-testid="product-stock-card"
                      className="space-y-4 rounded-xl border border-surface-border bg-card p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {variant.name ?? "Variante sans nom"}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground">{variant.sku}</p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <AdminFormField label="Stock physique">
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            name={`inventoryOnHand:${variant.id}`}
                            defaultValue={variant.inventory.onHandQuantity.toString()}
                            className="text-sm"
                          />
                        </AdminFormField>

                        <AdminFormField label="Stock réservé">
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            name={`inventoryReserved:${variant.id}`}
                            defaultValue={variant.inventory.reservedQuantity.toString()}
                            className="text-sm"
                          />
                        </AdminFormField>
                      </div>

                      <div className="grid gap-3 rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-2 text-xs text-muted-foreground md:grid-cols-3">
                        <p>
                          Stock disponible:{" "}
                          <span className="font-medium text-foreground">
                            {variant.inventory.availableQuantity}
                          </span>
                        </p>
                        <p>
                          Backorder:{" "}
                          <span className="font-medium text-foreground">
                            {variant.availability.backorderAllowed ? "Autorisé" : "Interdit"}
                          </span>
                        </p>
                        <p>
                          État inventaire:{" "}
                          <span className="font-medium text-foreground">
                            {variant.inventory.hasInventoryRecord ? "Enregistré" : "À créer"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-muted-foreground">
                  Aucune variante disponible pour gérer le stock.
                </p>
              )}
            </AdminFormSection>
          )}
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
