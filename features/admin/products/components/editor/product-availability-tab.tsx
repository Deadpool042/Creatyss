"use client";

import { useActionState, type JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  productAvailabilityFormInitialState,
  type AdminProductVariantAvailability,
  type AdminProductVariantListItem,
  type ProductAvailabilityFormAction,
} from "@/features/admin/products/editor/public";

type ProductAvailabilityTabProps = {
  action: ProductAvailabilityFormAction;
  productId: string;
  variants: AdminProductVariantListItem[];
};

const availabilityStatusLabels: Record<AdminProductVariantAvailability["status"], string> = {
  available: "Disponible à la vente",
  unavailable: "Indisponible à la vente",
  preorder: "Précommande ouverte",
  backorder: "Commande en rupture",
  discontinued: "Arrêt commercial",
  archived: "Archivé",
};

function toDateTimeLocalValue(value: string | null): string {
  if (value === null) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function ProductAvailabilityTab({
  action,
  productId,
  variants,
}: ProductAvailabilityTabProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productAvailabilityFormInitialState);
  const hasVariants = variants.length > 0;

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <input type="hidden" name="productId" value={productId} />

      {variants.map((variant) => (
        <input
          key={`availability-variant-id:${variant.id}`}
          type="hidden"
          name="availabilityVariantIds"
          value={variant.id}
        />
      ))}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <div className="w-full space-y-6 px-4 py-4 md:space-y-7 md:px-6 md:py-6 lg:mx-auto lg:max-w-4xl lg:px-5 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:py-3">
          <AdminFormMessage
            tone={state.status === "error" ? "error" : "success"}
            message={state.status !== "idle" ? state.message : null}
          />

          <AdminFormSection
            title="Disponibilité par variante"
            description="Définissez la vendabilité de chaque déclinaison sans gérer ici les quantités de stock."
          >
            {hasVariants ? (
              <div className="space-y-4">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    data-testid="product-availability-card"
                    className="space-y-4 rounded-xl border border-surface-border bg-card p-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {variant.name ?? "Variante sans nom"}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">{variant.sku}</p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <AdminFormField label="Statut de disponibilité">
                        <Select
                          name={`availabilityStatus:${variant.id}`}
                          defaultValue={variant.availability.status}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(availabilityStatusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </AdminFormField>

                      <AdminFormField label="Vente en ligne">
                        <Select
                          name={`availabilityIsSellable:${variant.id}`}
                          defaultValue={variant.availability.isSellable ? "true" : "false"}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Vendable</SelectItem>
                            <SelectItem value="false">Non vendable</SelectItem>
                          </SelectContent>
                        </Select>
                      </AdminFormField>

                      <AdminFormField label="Commande en rupture">
                        <Select
                          name={`availabilityBackorderAllowed:${variant.id}`}
                          defaultValue={variant.availability.backorderAllowed ? "true" : "false"}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">Interdite</SelectItem>
                            <SelectItem value="true">Autorisée</SelectItem>
                          </SelectContent>
                        </Select>
                      </AdminFormField>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <AdminFormField label="Début de vente">
                        <Input
                          type="datetime-local"
                          name={`availabilitySellableFrom:${variant.id}`}
                          defaultValue={toDateTimeLocalValue(variant.availability.sellableFrom)}
                          className="text-sm"
                        />
                      </AdminFormField>
                      <AdminFormField label="Fin de vente">
                        <Input
                          type="datetime-local"
                          name={`availabilitySellableUntil:${variant.id}`}
                          defaultValue={toDateTimeLocalValue(variant.availability.sellableUntil)}
                          className="text-sm"
                        />
                      </AdminFormField>
                      <AdminFormField label="Début de précommande">
                        <Input
                          type="datetime-local"
                          name={`availabilityPreorderStartsAt:${variant.id}`}
                          defaultValue={toDateTimeLocalValue(variant.availability.preorderStartsAt)}
                          className="text-sm"
                        />
                      </AdminFormField>
                      <AdminFormField label="Fin de précommande">
                        <Input
                          type="datetime-local"
                          name={`availabilityPreorderEndsAt:${variant.id}`}
                          defaultValue={toDateTimeLocalValue(variant.availability.preorderEndsAt)}
                          className="text-sm"
                        />
                      </AdminFormField>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-muted-foreground">
                Aucune variante disponible pour gérer la vendabilité.
              </p>
            )}
          </AdminFormSection>
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
