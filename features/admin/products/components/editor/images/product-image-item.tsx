"use client";

import { useState, useTransition, type JSX } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Check, Pencil, Star, Trash2, X } from "lucide-react";

import { hasRealImage } from "@/core/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminProductImageItem } from "@/features/admin/products/editor/types";
import type {
  ProductImageReorderDirection,
  ReorderProductImageResult,
} from "@/features/admin/products/editor/types/product-image-reorder.types";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { ConfirmDestructiveDialog } from "@/components/shared/confirm-desctructive-dialog";

type ProductImageItemProps = {
  productId: string;
  image: AdminProductImageItem;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSetPrimary?: (assetId: string) => Promise<ReorderProductImageResult>;
  onDelete?: (assetId: string) => Promise<ReorderProductImageResult>;
  onUpdateAltText?: (assetId: string, altText: string) => Promise<ReorderProductImageResult>;
  onReorder?: (
    assetId: string,
    direction: ProductImageReorderDirection
  ) => Promise<ReorderProductImageResult>;
};

export function ProductImageItem({
  productId: _productId,
  image,
  canMoveUp,
  canMoveDown,
  onSetPrimary,
  onDelete,
  onUpdateAltText,
  onReorder,
}: ProductImageItemProps): JSX.Element {
  const [isEditingAltText, setIsEditingAltText] = useState(false);
  const [altText, setAltText] = useState(image.altText ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSetPrimary(): Promise<void> {
    if (!onSetPrimary || image.isPrimary) {
      return;
    }

    startTransition(async () => {
      const result = await onSetPrimary(image.assetId);
      setMessage(result.message);
    });
  }

  async function handleDelete(): Promise<boolean> {
    if (!onDelete) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        const result = await onDelete(image.assetId);
        setMessage(result.message);
        resolve(result.status === "success");
      });
    });
  }

  async function handleSaveAltText(): Promise<void> {
    if (!onUpdateAltText) {
      return;
    }

    startTransition(async () => {
      const result = await onUpdateAltText(image.assetId, altText);
      setMessage(result.message);

      if (result.status === "success") {
        setIsEditingAltText(false);
      }
    });
  }

  async function handleReorder(direction: ProductImageReorderDirection): Promise<void> {
    if (!onReorder) {
      return;
    }

    startTransition(async () => {
      const result = await onReorder(image.assetId, direction);
      setMessage(result.message);
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {hasRealImage(image.publicUrl) ? (
          <Image
            src={image.publicUrl!}
            alt={image.altText ?? "Image produit"}
            fill
            className="object-cover"
          />
        ) : (
          <PlaceholderImage alt={image.altText ?? "Image produit"} />
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {image.isPrimary ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[11px] font-medium">
              <Star className="h-3.5 w-3.5" />
              Principale
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Ordre : {image.sortOrder}</p>

          {isEditingAltText ? (
            <div className="space-y-2">
              <Input
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                placeholder="Texte alternatif"
                disabled={isPending}
              />

              <div className="flex gap-2">
                <Button
                  size="sm"
                  type="button"
                  onClick={() => void handleSaveAltText()}
                  disabled={isPending}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setAltText(image.altText ?? "");
                    setIsEditingAltText(false);
                    setMessage(null);
                  }}
                  disabled={isPending}
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium">Texte alternatif</p>
              <p className="text-sm text-muted-foreground">
                {image.altText && image.altText.trim().length > 0
                  ? image.altText
                  : "Aucun texte alternatif"}
              </p>
            </div>
          )}

          {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => void handleReorder("up")}
            disabled={!onReorder || !canMoveUp || isPending}
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Monter
          </Button>

          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => void handleReorder("down")}
            disabled={!onReorder || !canMoveDown || isPending}
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Descendre
          </Button>

          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setIsEditingAltText(true)}
            disabled={isEditingAltText || isPending}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Alt
          </Button>

          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => void handleSetPrimary()}
            disabled={!onSetPrimary || image.isPrimary || isPending}
          >
            <Star className="mr-2 h-4 w-4" />
            Principale
          </Button>

          <ConfirmDestructiveDialog
            trigger={
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={!onDelete || isPending}
                className="col-span-2 text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isPending ? "Suppression…" : "Supprimer"}
              </Button>
            }
            title="Supprimer cette image ?"
            description="Cette image sera retirée de la galerie produit. Cette action est irréversible."
            pending={isPending}
            onConfirm={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
