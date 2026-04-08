"use client";

import { useState, type JSX, type ReactNode } from "react";
import Image from "next/image";
import { BadgeCheck, MoreHorizontal, Pencil, Star, Tag, Trash2 } from "lucide-react";

import { hasRealImage } from "@/core/media";
import { ConfirmDestructiveDialog, PlaceholderImage } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductStatusBadge } from "@/features/admin/products/components/shared";
import type { AdminProductVariantListItem } from "@/features/admin/products/editor/types/product-variants.types";

type ProductVariantItemProps = {
  variant: AdminProductVariantListItem;
  variantCount: number;
  onEdit?: (variantId: string) => void;
  onSetDefault?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
  onDelete?: (variantId: string) => Promise<{ status: "success" | "error"; message: string }>;
};

function formatPrice(amount: string | null): string {
  if (!amount) {
    return "—";
  }

  const parsed = Number.parseFloat(amount);

  if (!Number.isFinite(parsed)) {
    return amount;
  }

  return `${parsed.toFixed(2)} €`;
}

function InfoTile({ label, children }: { label: string; children: ReactNode }): JSX.Element {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <div className="mt-1.5 min-h-8 text-sm">{children}</div>
    </div>
  );
}

export function ProductVariantItem({
  variant,
  variantCount,
  onEdit,
  onSetDefault,
  onDelete,
}: ProductVariantItemProps): JSX.Element {
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const imageAlt = (variant.primaryImageAlt ?? variant.name) || variant.sku;
  const displayName = variant.name.trim().length > 0 ? variant.name : "Variante sans nom";
  const canDelete = variantCount > 1;
  const canSetDefault = !variant.isDefault;

  async function handleSetDefault(): Promise<void> {
    if (!onSetDefault || !canSetDefault) {
      return;
    }

    setIsSettingDefault(true);
    await onSetDefault(variant.id);
    setIsSettingDefault(false);
  }

  async function handleDelete(): Promise<boolean> {
    if (!onDelete || !canDelete) {
      return false;
    }

    setIsDeleting(true);
    const result = await onDelete(variant.id);
    setIsDeleting(false);

    return result.status === "success";
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-surface-border bg-card shadow-card">
      <CardContent className="flex h-full flex-col space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl lg:text-xl xl:text-2xl">
              {displayName}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {variant.isDefault ? (
              <div className="rounded-full border border-surface-border bg-surface-panel-soft p-0.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full text-primary">
                  <BadgeCheck className="h-4 w-4" />
                </span>
              </div>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full border border-surface-border bg-surface-panel-soft text-muted-foreground"
                  aria-label={`Actions pour ${displayName}`}
                  disabled={isSettingDefault || isDeleting}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8} className="w-48 rounded-xl">
                <DropdownMenuItem
                  onSelect={() => {
                    onEdit?.(variant.id);
                  }}
                  disabled={!onEdit || isSettingDefault || isDeleting}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => {
                    void handleSetDefault();
                  }}
                  disabled={!onSetDefault || !canSetDefault || isSettingDefault || isDeleting}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {variant.isDefault ? "Par défaut" : isSettingDefault ? "Application…" : "Définir"}
                </DropdownMenuItem>

                <ConfirmDestructiveDialog
                  trigger={
                    <button
                      type="button"
                      className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
                      disabled={!onDelete || !canDelete || isSettingDefault || isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting ? "Suppression…" : "Supprimer"}
                    </button>
                  }
                  title="Supprimer cette variante ?"
                  description={`La variante "${displayName}" va être supprimée définitivement. Cette action est irréversible.`}
                  pending={isDeleting}
                  onConfirm={handleDelete}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg border border-surface-border bg-muted">
            {variant.primaryImageUrl && hasRealImage(variant.primaryImageUrl) ? (
              <Image
                src={variant.primaryImageUrl}
                alt={imageAlt}
                fill
                sizes="72px"
                className="object-cover"
              />
            ) : (
              <PlaceholderImage alt={imageAlt} className="bg-muted" imageClassName="opacity-15" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <ProductStatusBadge status={variant.status} />

              {variant.isDefault ? (
                <span className="inline-flex h-6 items-center gap-1 rounded-full border border-surface-border bg-surface-panel-soft px-2.5 text-xs font-medium leading-none text-muted-foreground">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Par défaut
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                SKU : {variant.sku}
              </span>

              {variant.slug ? <span>Slug : {variant.slug}</span> : null}
              <span>Ordre : {variant.sortOrder}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <InfoTile label="Prix">
            <p className="font-medium tabular-nums text-foreground">
              {formatPrice(variant.amount)}
            </p>
          </InfoTile>

          <InfoTile label="Prix avant réduction">
            <p className="font-medium tabular-nums text-foreground">
              {formatPrice(variant.compareAtAmount)}
            </p>
          </InfoTile>
        </div>

        {!canDelete ? (
          <p className="text-xs text-muted-foreground">
            Le produit doit conserver au moins une variante.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
