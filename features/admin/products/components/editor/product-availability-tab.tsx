"use client";

import { useActionState, useState, type JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";
import {
  productAvailabilityFormInitialState,
  type AdminProductVariantAvailability,
  type AdminProductVariantListItem,
  type ProductAvailabilityFormAction,
} from "@/features/admin/products/editor/types";
import { PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME } from "@/features/admin/products/components/shared/product-module-page-shell";

type ProductAvailabilityTabProps = {
  action: ProductAvailabilityFormAction;
  productId: string;
  variants: AdminProductVariantListItem[];
  isStandalone: boolean;
  allowScheduledAvailability: boolean;
  allowPreorderAvailability: boolean;
};

type ProductAvailabilitySectionIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
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

function ProductAvailabilitySectionIntro({
  eyebrow,
  title,
  description,
}: ProductAvailabilitySectionIntroProps): JSX.Element {
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

type AvailabilityFieldsProps = {
  variantId: string;
  availability: AdminProductVariantAvailability;
  allowScheduledAvailability: boolean;
  allowPreorderAvailability: boolean;
};

function AvailabilityFields({
  variantId,
  availability,
  allowScheduledAvailability,
  allowPreorderAvailability,
}: AvailabilityFieldsProps): JSX.Element {
  const [selectedStatus, setSelectedStatus] = useState<AdminProductVariantAvailability["status"]>(
    availability.status
  );
  const statusEntries = Object.entries(availabilityStatusLabels).filter(([value]) => {
    if (value === "preorder" && !allowPreorderAvailability) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <AdminFormField label="Statut de disponibilité">
          <Select
            name={`availabilityStatus:${variantId}`}
            defaultValue={availability.status}
            onValueChange={(v) => setSelectedStatus(v as AdminProductVariantAvailability["status"])}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusEntries.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AdminFormField>

        <AdminFormField label="Vente en ligne">
          <Select
            name={`availabilityIsSellable:${variantId}`}
            defaultValue={availability.isSellable ? "true" : "false"}
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

        <AdminFormField label="Commandes en rupture de stock">
          <Select
            name={`availabilityBackorderAllowed:${variantId}`}
            defaultValue={availability.backorderAllowed ? "true" : "false"}
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

      <p className="text-xs text-muted-foreground">
        Le statut indique l&apos;état commercial du produit. La vendabilité contrôle si l&apos;ajout
        au panier est autorisé.
      </p>

      {allowScheduledAvailability ? (
        <div className="grid gap-3 md:grid-cols-2">
          <AdminFormField label="Début de vente">
            <Input
              type="datetime-local"
              name={`availabilitySellableFrom:${variantId}`}
              defaultValue={toDateTimeLocalValue(availability.sellableFrom)}
              className="text-sm"
            />
          </AdminFormField>
          <AdminFormField label="Fin de vente">
            <Input
              type="datetime-local"
              name={`availabilitySellableUntil:${variantId}`}
              defaultValue={toDateTimeLocalValue(availability.sellableUntil)}
              className="text-sm"
            />
          </AdminFormField>
          {allowPreorderAvailability && selectedStatus === "preorder" ? (
            <>
              <AdminFormField label="Début de précommande">
                <Input
                  type="datetime-local"
                  name={`availabilityPreorderStartsAt:${variantId}`}
                  defaultValue={toDateTimeLocalValue(availability.preorderStartsAt)}
                  className="text-sm"
                />
              </AdminFormField>
              <AdminFormField label="Fin de précommande">
                <Input
                  type="datetime-local"
                  name={`availabilityPreorderEndsAt:${variantId}`}
                  defaultValue={toDateTimeLocalValue(availability.preorderEndsAt)}
                  className="text-sm"
                />
              </AdminFormField>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function VariantAvailabilityCard({
  variant,
  allowScheduledAvailability,
  allowPreorderAvailability,
}: {
  variant: AdminProductVariantListItem;
  allowScheduledAvailability: boolean;
  allowPreorderAvailability: boolean;
}): JSX.Element {
  return (
    <div
      data-testid="product-availability-card"
      className="grid gap-4 border-t border-surface-border pt-4 first:border-t-0 first:pt-0"
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{variant.name ?? "Variante sans nom"}</p>
        <p className="text-xs font-mono text-muted-foreground">{variant.sku}</p>
      </div>

      <AvailabilityFields
        variantId={variant.id}
        availability={variant.availability}
        allowScheduledAvailability={allowScheduledAvailability}
        allowPreorderAvailability={allowPreorderAvailability}
      />
    </div>
  );
}

export function ProductAvailabilityTab({
  action,
  productId,
  variants,
  isStandalone,
  allowScheduledAvailability,
  allowPreorderAvailability,
}: ProductAvailabilityTabProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productAvailabilityFormInitialState);
  const hasVariants = variants.length > 0;
  const standaloneVariant = isStandalone
    ? (variants.find((variant) => variant.isDefault) ?? variants[0] ?? null)
    : null;

  return (
    <form action={formAction} className="relative">
      <input type="hidden" name="productId" value={productId} />

      {variants.map((variant) => (
        <input
          key={`availability-variant-id:${variant.id}`}
          type="hidden"
          name="availabilityVariantIds"
          value={variant.id}
        />
      ))}

      <div className="pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <div className={PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME}>
          <div className="min-w-0 space-y-5 md:space-y-6">
            <AdminFormMessage
              tone={state.status === "error" ? "error" : "success"}
              message={state.status !== "idle" ? state.message : null}
            />

            <div className="divide-y divide-surface-border/40">
              {isStandalone ? (
                <section className="grid gap-6 py-6 first:pt-0">
                  <ProductAvailabilitySectionIntro
                    eyebrow="Vendabilité"
                    title="Disponibilité"
                    description="Définissez si ce produit peut être vendu en ligne, sur quelle période et dans quel mode commercial."
                  />

                  {standaloneVariant === null ? (
                    <p className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-muted-foreground">
                      Aucune donnée de disponibilité disponible pour ce produit.
                    </p>
                  ) : (
                    <>
                      {standaloneVariant.sku !== null && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Référence interne :</span>{" "}
                          <span className="font-mono">{standaloneVariant.sku}</span>
                        </p>
                      )}
                      <AvailabilityFields
                        variantId={standaloneVariant.id}
                        availability={standaloneVariant.availability}
                        allowScheduledAvailability={allowScheduledAvailability}
                        allowPreorderAvailability={allowPreorderAvailability}
                      />
                    </>
                  )}
                </section>
              ) : (
                <section className="grid gap-6 py-6 first:pt-0">
                  <ProductAvailabilitySectionIntro
                    eyebrow="Déclinaisons"
                    title="Disponibilité par variante"
                    description="Définissez la vendabilité de chaque déclinaison sans mélanger cette logique avec le stock physique."
                  />

                  {hasVariants ? (
                    <div className="grid gap-4">
                      {variants.map((variant) => (
                        <VariantAvailabilityCard
                          key={variant.id}
                          variant={variant}
                          allowScheduledAvailability={allowScheduledAvailability}
                          allowPreorderAvailability={allowPreorderAvailability}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-muted-foreground">
                      Aucune variante disponible pour gérer la vendabilité.
                    </p>
                  )}
                </section>
              )}
            </div>
          </div>

          <aside className="min-w-0 xl:sticky xl:top-6">
            <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/80">
              <section className="grid gap-4 px-5 py-5">
                <ProductAvailabilitySectionIntro
                  eyebrow="Repères"
                  title="Lecture rapide"
                />

                <div className="divide-y divide-surface-border">
                  <div className="grid gap-1.5 py-3 first:pt-0">
                    <ProductSectionEyebrow className="tracking-[0.14em]">Périmètre</ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">
                      {isStandalone ? "Produit simple" : `${variants.length} variantes`}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Ce module pilote la vendabilité, pas les quantités de stock.
                    </p>
                  </div>

                  <div className="grid gap-1.5 py-3">
                    <ProductSectionEyebrow className="tracking-[0.14em]">Statuts</ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">Disponible, précommande, rupture…</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Choisissez le statut commercial puis ajustez la période ou la précommande si nécessaire.
                    </p>
                  </div>

                  <div className="grid gap-1.5 py-3 last:pb-0">
                    <ProductSectionEyebrow className="tracking-[0.14em]">Périodes</ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">Fenêtres optionnelles</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Utilisez les dates seulement quand la vente doit être bornée dans le temps.
                    </p>
                  </div>
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
