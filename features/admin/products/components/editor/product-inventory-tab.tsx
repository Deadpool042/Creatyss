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

// ─── Internal components ──────────────────────────────────────────────────────

function InventoryFields({
  variantId,
  inventory,
  availability,
}: {
  variantId: string;
  inventory: AdminProductVariantListItem["inventory"];
  availability: AdminProductVariantListItem["availability"];
}): JSX.Element {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-1">
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

function VariantInventoryCard({ variant }: { variant: AdminProductVariantListItem }): JSX.Element {
  return (
    <div
      data-testid="product-stock-card"
      className="space-y-4 rounded-xl border border-surface-border bg-card p-4"
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{variant.name ?? "Variante sans nom"}</p>
        <p className="text-xs font-mono text-muted-foreground">{variant.sku}</p>
      </div>

      <InventoryFields
        variantId={variant.id}
        inventory={variant.inventory}
        availability={variant.availability}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

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

  const standaloneVariant = isStandalone
    ? (variants.find((variant) => variant.isDefault) ?? variants[0] ?? null)
    : null;

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
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">SKU :</span>{" "}
                      <span className="font-mono">{standaloneVariant.sku}</span>
                    </p>
                  )}

                  <InventoryFields
                    variantId={standaloneVariant.id}
                    inventory={standaloneVariant.inventory}
                    availability={standaloneVariant.availability}
                  />
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
                    <VariantInventoryCard key={variant.id} variant={variant} />
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
