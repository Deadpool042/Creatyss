"use client";

import Image from "next/image";
import { Pencil, Star, Trash2 } from "lucide-react";
import { useState, useTransition, type JSX } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminProductVariantListItem } from "@/features/admin/products/editor/types";

type ProductVariantItemProps = {
  productId: string;
  productSlug: string;
  variant: AdminProductVariantListItem;
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

export function ProductVariantItem({
  productId: _productId,
  productSlug: _productSlug,
  variant,
  onEdit,
  onSetDefault,
  onDelete,
}: ProductVariantItemProps): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid gap-4 p-4 md:grid-cols-[8rem_minmax(0,1fr)] md:p-5">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
          {variant.primaryImageUrl ? (
            <Image
              src={variant.primaryImageUrl}
              alt={variant.primaryImageAltText ?? variant.name ?? variant.sku}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Aucune image
            </div>
          )}
        </div>

        <div className="grid gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold text-foreground">
                  {variant.name && variant.name.trim().length > 0 ? variant.name : "Variante sans nom"}
                </h3>

                {variant.isDefault ? (
                  <Badge variant="secondary">Par défaut</Badge>
                ) : null}

                <Badge variant={getStatusVariant(variant.status)}>
                  {getStatusLabel(variant.status)}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>SKU : {variant.sku}</span>
                <span>Ordre : {variant.sortOrder}</span>
                {variant.slug ? <span>Slug : {variant.slug}</span> : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => onEdit(variant.id)}>
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
                  variant="outline"
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

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border bg-muted/30 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Code-barres</p>
              <p className="mt-1 text-sm text-foreground">
                {variant.barcode && variant.barcode.trim().length > 0 ? variant.barcode : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Réf. externe</p>
              <p className="mt-1 text-sm text-foreground">
                {variant.externalReference && variant.externalReference.trim().length > 0
                  ? variant.externalReference
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Poids</p>
              <p className="mt-1 text-sm text-foreground">
                {variant.weightGrams && variant.weightGrams.trim().length > 0
                  ? `${variant.weightGrams} g`
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Dimensions</p>
              <p className="mt-1 text-sm text-foreground">
                {[variant.widthMm, variant.heightMm, variant.depthMm].some(
                  (value) => value && value.trim().length > 0
                )
                  ? `${variant.widthMm ?? "—"} × ${variant.heightMm ?? "—"} × ${variant.depthMm ?? "—"} mm`
                  : "—"}
              </p>
            </div>
          </div>

          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
