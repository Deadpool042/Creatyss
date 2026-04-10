"use client";

import Image from "next/image";
import { useState, useTransition, type JSX } from "react";
import { ArrowDown, ArrowUp, Check, MoreHorizontal, Pencil, Star, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  AdminProductImageItem,
  ReorderProductImageResult,
} from "@/features/admin/products/editor/types";
import { PlaceholderImage } from "@/components/shared";

function hasRealImage(url: string | null): boolean {
  return typeof url === "string" && url.trim().length > 0;
}

type ProductImageItemProps = {
  productId: string;
  image: AdminProductImageItem;
  canMoveUp: boolean;
  canMoveDown: boolean;
  previousSortOrder: number | null;
  nextSortOrder: number | null;
  onSetPrimary?: (mediaAssetId: string) => Promise<ReorderProductImageResult>;
  onDelete?: (imageId: string) => Promise<ReorderProductImageResult>;
  onUpdateAltText?: (imageId: string, altText: string) => Promise<ReorderProductImageResult>;
  onReorder?: (imageId: string, sortOrder: number) => Promise<ReorderProductImageResult>;
};

export function ProductImageItem({
  productId: _productId,
  image,
  canMoveUp,
  canMoveDown,
  previousSortOrder,
  nextSortOrder,
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
      const result = await onSetPrimary(image.mediaAssetId);
      setMessage(result.message);
    });
  }

  async function handleDelete(): Promise<boolean> {
    if (!onDelete) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        const result = await onDelete(image.id);
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
      const result = await onUpdateAltText(image.id, altText);
      setMessage(result.message);

      if (result.status === "success") {
        setIsEditingAltText(false);
      }
    });
  }

  async function handleMoveUp(): Promise<void> {
    if (!onReorder || previousSortOrder === null) {
      return;
    }

    startTransition(async () => {
      const result = await onReorder(image.id, previousSortOrder);
      setMessage(result.message);
    });
  }

  async function handleMoveDown(): Promise<void> {
    if (!onReorder || nextSortOrder === null) {
      return;
    }

    startTransition(async () => {
      const result = await onReorder(image.id, nextSortOrder);
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

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex flex-wrap gap-2">
            {image.isPrimary ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
                <Star className="h-3.5 w-3.5" />
                Principale
              </span>
            ) : null}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isPending}
                className="h-8 w-8 rounded-full border border-white/15 bg-background/80 text-foreground shadow-sm backdrop-blur"
                aria-label="Actions image"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-52 rounded-xl">
              <DropdownMenuItem
                onSelect={() => {
                  void handleMoveUp();
                }}
                disabled={!onReorder || !canMoveUp || isPending}
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Monter
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  void handleMoveDown();
                }}
                disabled={!onReorder || !canMoveDown || isPending}
              >
                <ArrowDown className="mr-2 h-4 w-4" />
                Descendre
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  setIsEditingAltText(true);
                  setMessage(null);
                }}
                disabled={isEditingAltText || isPending}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Modifier le texte alt
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  void handleSetPrimary();
                }}
                disabled={!onSetPrimary || image.isPrimary || isPending}
              >
                <Star className="mr-2 h-4 w-4" />
                Définir comme principale
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  void handleDelete();
                }}
                disabled={!onDelete || isPending}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-3 p-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Ordre : {image.sortOrder}</p>

          {!isEditingAltText ? (
            <>
              <p className="text-sm font-medium text-foreground">Texte alternatif</p>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {image.altText && image.altText.trim().length > 0
                  ? image.altText
                  : "Aucun texte alternatif"}
              </p>
            </>
          ) : null}

          {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
        </div>

        {isEditingAltText ? (
          <div className="space-y-2">
            <Input
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Texte alternatif"
              disabled={isPending}
            />

            <div className="flex flex-wrap gap-2">
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
        ) : null}
      </div>
    </div>
  );
}
