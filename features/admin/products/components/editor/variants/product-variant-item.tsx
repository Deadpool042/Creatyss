"use client";

import Image from "next/image";
import { Pencil, Star, Trash2 } from "lucide-react";
import { useState, useTransition, type JSX } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminProductVariantListItem } from "@/features/admin/products/editor/types";

type ProductVariantItemProps = {
  variant: AdminProductVariantListItem;
  hasOtherVariants: boolean;
  onEdit: (variantId: string) => void;
  onSetDefault?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
  onDelete?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
};

function getStatusLabel(status: AdminProductVariantListItem["status"]): string {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "active":
      return "Actif";
    case "inactive":
      return "Inactif";
    case "archived":
      return "Archivé";
  }
}

function getStatusVariant(status: AdminProductVariantListItem["status"]) {
  switch (status) {
    case "active":
      return "secondary" as const;
    case "draft":
      return "outline" as const;
    case "inactive":
      return "outline" as const;
    case "archived":
      return "outline" as const;
  }
}

function SectionLabel({ children }: { children: string }): JSX.Element {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  );
}

export function ProductVariantItem({
  variant,
  hasOtherVariants,
  onEdit,
  onSetDefault,
  onDelete,
}: ProductVariantItemProps): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const displayName =
    variant.name && variant.name.trim().length > 0 ? variant.name : "Variante sans nom";
  const slugLabel = variant.slug ? `/${variant.slug}` : "Aucun slug défini";
  const hasDimensions = [variant.widthMm, variant.heightMm, variant.depthMm].some(
    (value) => value && value.trim().length > 0
  );
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
    <Card
      data-testid="product-variant-card"
      className="rounded-[1.35rem] border border-surface-border bg-card shadow-card py-0"
    >
      <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-muted/20 px-4 py-3.5 md:px-5 md:py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="truncate text-base">{displayName}</CardTitle>
              {variant.isDefault ? <Badge variant="secondary">Par défaut</Badge> : null}
              <Badge variant={getStatusVariant(variant.status)}>
                {getStatusLabel(variant.status)}
              </Badge>
              <Badge variant="outline" className="border-surface-border bg-transparent">
                Ordre {variant.sortOrder}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>SKU {variant.sku}</span>
              <span className="font-mono">{slugLabel}</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
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
                <Star className="mr-2 h-4 w-4" />
                Définir par défaut
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
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-3.5 px-4 py-3.5 md:gap-4 md:px-5 md:py-5">
        <div className="grid gap-3.5 md:gap-4 lg:grid-cols-[11rem_minmax(0,1fr)]">
          <div className="rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-4 shadow-sm">
            <SectionLabel>Image</SectionLabel>
            <div className="mt-3 overflow-hidden rounded-xl border border-surface-border bg-muted">
              <div className="relative aspect-square">
                {variant.primaryImageUrl ? (
                  <Image
                    src={variant.primaryImageUrl}
                    alt={variant.primaryImageAltText ?? displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
                    Aucune image définie
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {variant.primaryImageUrl
                ? "Image principale utilisée pour cette variante."
                : "Sélectionnez une image existante depuis la galerie du produit."}
            </p>
          </div>

          <div className="grid gap-3.5 md:gap-4">
            <div className="rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-4 shadow-sm">
              <SectionLabel>Attributs</SectionLabel>
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
            </div>

            <div className="rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-4 shadow-sm">
              <SectionLabel>Repères techniques</SectionLabel>
              <div className="mt-3 grid gap-x-5 gap-y-3 sm:grid-cols-2">
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
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Poids</p>
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
            </div>
          </div>
        </div>
      </CardContent>

      {shouldShowFooterMessage ? (
        <CardFooter className="flex flex-col items-start gap-1 border-t border-surface-border bg-muted/10 px-4 py-2.5 text-sm text-muted-foreground md:px-5 md:py-3">
          {variant.isDefault && hasOtherVariants && onDelete ? (
            <p>Choisissez une autre variante par défaut avant de supprimer celle-ci.</p>
          ) : null}
          {message ? <p>{message}</p> : null}
        </CardFooter>
      ) : null}
    </Card>
  );
}
