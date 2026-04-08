"use client";

import { useEffect, useMemo, useState, type JSX } from "react";
import Image from "next/image";
import { BadgeCheck, CheckCircle2, ImageIcon } from "lucide-react";

import type { AdminProductImageItem } from "@/features/admin/products/editor/types";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ProductVariantImagePickerProps = {
  name: string;
  images: AdminProductImageItem[];
  selectedAssetId: string;
  label?: string;
  description?: string;
};

type ProductVariantImageCardProps = {
  image: AdminProductImageItem;
  checked: boolean;
  onSelect: (assetId: string) => void;
};

function ProductVariantImageCard({
  image,
  checked,
  onSelect,
}: ProductVariantImageCardProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onSelect(image.assetId)}
      className="block h-full w-full text-left"
      aria-pressed={checked}
    >
      <Card
        className={cn(
          "h-full overflow-hidden rounded-2xl border bg-card p-0 transition-all duration-200",
          "hover:-translate-y-0.5 hover:shadow-lg",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked
            ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
            : "border-border/70 hover:border-primary/40"
        )}
      >
        <div className="group">
          <div className="relative aspect-4/3 overflow-hidden bg-muted">
            <Image
              src={image.publicUrl}
              alt={image.altText ?? "Image produit"}
              width={640}
              height={480}
              className={cn(
                "h-full w-full object-cover transition duration-300",
                checked ? "scale-[1.02]" : "group-hover:scale-[1.03]"
              )}
            />

            <div
              className={cn(
                "pointer-events-none absolute inset-0 transition",
                checked
                  ? "bg-primary/12"
                  : "bg-linear-to-t from-black/15 via-transparent to-transparent group-hover:from-black/20"
              )}
            />

            <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
              {checked ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Couverture variante
                </span>
              ) : null}

              {image.isPrimary ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Principale du produit
                </span>
              ) : null}
            </div>
          </div>

          <CardContent className="space-y-3 p-4">
            <div className="space-y-1">
              <p
                className={cn(
                  "line-clamp-2 text-sm font-medium",
                  checked ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {image.altText ?? "Aucun texte alternatif"}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex rounded-full border border-border/60 px-2 py-0.5">
                  {image.role === "primary" ? "Référence primaire" : "Galerie"}
                </span>

                <span className="inline-flex rounded-full border border-border/60 px-2 py-0.5">
                  Ordre {image.sortOrder}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
                checked
                  ? "border-primary/30 bg-primary/10 text-foreground"
                  : "border-border/60 bg-muted/20 text-muted-foreground hover:border-primary/20 hover:bg-muted/40"
              )}
            >
              {checked ? (
                <>
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium">Utilisée comme couverture de la variante</span>
                </>
              ) : (
                <span>Choisir comme couverture de la variante</span>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </button>
  );
}

export function ProductVariantImagePicker({
  name,
  images,
  selectedAssetId,
  label = "Image de couverture de la variante",
  description = "Choisis l’image utilisée comme visuel principal lorsque cette variante est sélectionnée sur la boutique.",
}: ProductVariantImagePickerProps): JSX.Element {
  const [currentSelectedAssetId, setCurrentSelectedAssetId] = useState(selectedAssetId);

  useEffect(() => {
    setCurrentSelectedAssetId(selectedAssetId);
  }, [selectedAssetId]);

  const currentImage = useMemo(
    () => images.find((image) => image.assetId === currentSelectedAssetId) ?? null,
    [images, currentSelectedAssetId]
  );

  if (images.length === 0) {
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <input type="hidden" name={name} value="" />

        <Card className="rounded-2xl border-dashed">
          <CardContent className="px-4 py-6 text-sm text-muted-foreground">
            Aucune image produit disponible pour cette variante.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <fieldset className="space-y-4">
      <input type="hidden" name={name} value={currentSelectedAssetId} />

      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {currentImage ? (
        <Card className="overflow-hidden rounded-2xl border-primary/25 bg-primary/5">
          <CardContent className="grid gap-4 p-4 sm:grid-cols-[112px_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-xl border border-border/60 bg-muted">
              <div className="relative aspect-square">
                <Image
                  src={currentImage.publicUrl}
                  alt={currentImage.altText ?? "Image sélectionnée"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Couverture actuelle de la variante
                </span>

                {currentImage.isPrimary ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] font-medium text-foreground">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Aussi principale du produit
                  </span>
                ) : null}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {currentImage.altText ?? "Aucun texte alternatif"}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex rounded-full border border-border/60 px-2 py-0.5">
                    {currentImage.role === "primary" ? "Référence primaire" : "Galerie"}
                  </span>

                  <span className="inline-flex rounded-full border border-border/60 px-2 py-0.5">
                    Ordre {currentImage.sortOrder}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Cette image sera utilisée comme visuel de couverture pour la variante, sans changer
                sa position dans la galerie produit.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="rounded-2xl border border-border/60 bg-muted/10 px-3 py-3">
        <p className="text-xs text-muted-foreground">
          La sélection définit uniquement la couverture de la variante. L’ordre d’affichage dans la
          galerie produit reste inchangé.
        </p>
      </div>

      <div className="md:hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-1">
            {images.map((image) => (
              <div key={image.referenceId} className="w-70 shrink-0">
                <ProductVariantImageCard
                  image={image}
                  checked={currentSelectedAssetId === image.assetId}
                  onSelect={setCurrentSelectedAssetId}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-2">
        {images.map((image) => (
          <ProductVariantImageCard
            key={image.referenceId}
            image={image}
            checked={currentSelectedAssetId === image.assetId}
            onSelect={setCurrentSelectedAssetId}
          />
        ))}
      </div>
    </fieldset>
  );
}
