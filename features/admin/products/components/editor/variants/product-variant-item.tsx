"use client";

import Image from "next/image";
import { ChevronDown, ChevronUp, Pencil, Star, Trash2 } from "lucide-react";
import { useState, useTransition, type JSX } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminProductVariantListItem } from "@/features/admin/products/editor/types";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";
import {
  getAvailabilityBadge,
  getStatusLabel,
  getStatusVariant,
  getStockBadge,
} from "./product-variant-item.utils";

type ProductVariantItemProps = {
  variant: AdminProductVariantListItem;
  position: number;
  total: number;
  hasOtherVariants: boolean;
  onEdit: (variantId: string) => void;
  onSetDefault?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
  onDelete?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
};

export function ProductVariantItem({
  variant,
  position,
  total,
  hasOtherVariants,
  onEdit,
  onSetDefault,
  onDelete,
}: ProductVariantItemProps): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const displayName =
    variant.name && variant.name.trim().length > 0 ? variant.name : "Variante sans nom";
  const optionValueSummary =
    variant.optionValues.length > 0
      ? variant.optionValues.map((item) => item.value).join(" · ")
      : "Aucun attribut";
  const hasDimensions = [variant.widthMm, variant.heightMm, variant.depthMm].some(
    (value) => value && value.trim().length > 0
  );
  const availabilityBadge = getAvailabilityBadge(variant.availability);
  const stockBadge = getStockBadge(variant.inventory);
  const [isTechnicalDetailsOpen, setIsTechnicalDetailsOpen] = useState(false);
  const shouldShowFooterMessage =
    Boolean(message) || (variant.isDefault && hasOtherVariants && onDelete);

  function handleSetDefault(): void {
    if (!onSetDefault || variant.isDefault) {
      return;
    }

    startTransition(async () => {
      const result = await onSetDefault(variant.id);
      setMessage(result.message);
    });
  }

  function handleDelete(): void {
    if (!onDelete) {
      return;
    }

    startTransition(async () => {
      const result = await onDelete(variant.id);
      setMessage(result.message);
    });
  }

  return (
    <article
      data-testid="product-variant-card"
      className="overflow-hidden rounded-[1.5rem] border border-surface-border bg-surface-panel shadow-card"
    >
      <div className="border-b border-surface-border bg-surface-subtle/10 px-4 py-4 md:px-5 md:py-4.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
                {displayName}
              </h3>
              {variant.isDefault ? <Badge variant="secondary">Par défaut</Badge> : null}
              <Badge variant={getStatusVariant(variant.status)}>
                {getStatusLabel(variant.status)}
              </Badge>
              <Badge variant={availabilityBadge.variant}>{availabilityBadge.label}</Badge>
              <Badge variant={stockBadge.variant}>{stockBadge.label}</Badge>
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{optionValueSummary}</span>
              <span className="font-mono">Réf. interne {variant.sku}</span>
              <span>
                Position {position}/{total}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:gap-2">
            <Button type="button" size="sm" onClick={() => onEdit(variant.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>

            {!variant.isDefault && onSetDefault ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={handleSetDefault}
              >
                <Star className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Définir par défaut</span>
              </Button>
            ) : null}

            {onDelete ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Supprimer</span>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-4 py-4 md:px-5 md:py-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_8.5rem] lg:grid-cols-[minmax(0,1fr)_10rem]">
          <div className="grid gap-3.5 md:gap-4">
            <section className="rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-4">
              <ProductSectionEyebrow className="tracking-[0.14em]">Attributs</ProductSectionEyebrow>
              {variant.optionValues.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {variant.optionValues.map((optionValue) => (
                    <Badge
                      key={`${variant.id}-${optionValue.optionName}-${optionValue.value}`}
                      variant="outline"
                      className="border-surface-border bg-background/80"
                    >
                      {optionValue.optionName} : {optionValue.value}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Aucun attribut défini.</p>
              )}
            </section>

            <section className="rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <ProductSectionEyebrow className="tracking-[0.14em]">
                  Repères techniques
                </ProductSectionEyebrow>

                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-7 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setIsTechnicalDetailsOpen((current) => !current)}
                >
                  {isTechnicalDetailsOpen ? (
                    <>
                      <ChevronUp className="mr-1 h-3.5 w-3.5" />
                      Masquer
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-1 h-3.5 w-3.5" />
                      Afficher
                    </>
                  )}
                </Button>
              </div>

              {isTechnicalDetailsOpen ? (
                <div className="mt-3 grid gap-x-5 gap-y-3 border-t border-surface-border pt-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Adresse
                    </p>
                    <p className="text-sm text-foreground">
                      {variant.slug && variant.slug.trim().length > 0 ? `/${variant.slug}` : "—"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Ordre interne
                    </p>
                    <p className="text-sm text-foreground">{variant.sortOrder}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Code-barres
                    </p>
                    <p className="text-sm text-foreground">
                      {variant.barcode && variant.barcode.trim().length > 0 ? variant.barcode : "—"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Réf. externe
                    </p>
                    <p className="text-sm text-foreground">
                      {variant.externalReference && variant.externalReference.trim().length > 0
                        ? variant.externalReference
                        : "—"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Poids
                    </p>
                    <p className="text-sm text-foreground">
                      {variant.weightGrams && variant.weightGrams.trim().length > 0
                        ? `${variant.weightGrams} g`
                        : "—"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Dimensions
                    </p>
                    <p className="text-sm text-foreground">
                      {hasDimensions
                        ? `${variant.widthMm ?? "—"} × ${variant.heightMm ?? "—"} × ${variant.depthMm ?? "—"} mm`
                        : "—"}
                    </p>
                  </div>
                </div>
              ) : null}
            </section>
          </div>

          <aside className="rounded-2xl border border-surface-border bg-surface-panel-soft px-3 py-3">
            <ProductSectionEyebrow className="tracking-[0.14em]">Image</ProductSectionEyebrow>
            <div className="mt-2.5 flex items-start gap-3 md:flex-col md:items-center md:gap-2.5">
              <div className="overflow-hidden rounded-lg border border-surface-border bg-surface-subtle">
                <div className="relative h-20 w-20 md:h-24 md:w-24">
                  {variant.primaryImageUrl ? (
                    <Image
                      src={variant.primaryImageUrl}
                      alt={variant.primaryImageAltText ?? displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-muted-foreground">
                      Aucune image
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground md:text-center">
                {variant.primaryImageUrl ? "Image principale." : "À choisir dans la galerie."}
              </p>
            </div>
          </aside>
        </div>
      </div>

      {shouldShowFooterMessage ? (
        <div className="flex flex-col items-start gap-1 border-t border-surface-border bg-surface-subtle/10 px-4 py-2.5 text-sm text-muted-foreground md:px-5 md:py-3">
          {variant.isDefault && hasOtherVariants && onDelete ? (
            <p>Choisissez une autre variante par défaut avant de supprimer celle-ci.</p>
          ) : null}
          {message ? <p>{message}</p> : null}
        </div>
      ) : null}
    </article>
  );
}
