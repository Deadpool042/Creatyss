"use client";

import { useCallback, useState, useTransition, type JSX } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { cropAdminMediaAction } from "@/features/admin/media/actions/crop-admin-media.action";

/**
 * Presets de ratio : 4:5 en premier — c'est la convention de la galerie produit
 * (image "hero-ready"), qui est aussi le principal cas d'usage du recadrage.
 */
const ASPECT_PRESETS = [
  { label: "4:5 · galerie produit", value: 4 / 5 },
  { label: "Carré 1:1", value: 1 },
  { label: "Paysage 3:2", value: 3 / 2 },
  { label: "Large 16:9", value: 16 / 9 },
] as const;

type MediaCropDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetId: string;
  imageUrl: string;
  imageLabel?: string;
  /** Appelé après un recadrage réussi (ex. rafraîchir un état local). */
  onCropped?: () => void;
}>;

export function MediaCropDialog({
  open,
  onOpenChange,
  assetId,
  imageUrl,
  imageLabel,
  onCropped,
}: MediaCropDialogProps): JSX.Element {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number>(ASPECT_PRESETS[0].value);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCropComplete = useCallback((area: Area) => {
    // `area` est exprimée en pourcentages de l'image source (0-100),
    // indépendamment du zoom d'affichage — exactement ce que le serveur attend.
    setCroppedArea(area);
  }, []);

  function resetView(): void {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  function handleApply(): void {
    if (croppedArea === null) {
      return;
    }

    const region = {
      x: Math.max(0, croppedArea.x / 100),
      y: Math.max(0, croppedArea.y / 100),
      width: Math.min(1, croppedArea.width / 100),
      height: Math.min(1, croppedArea.height / 100),
    };

    startTransition(async () => {
      const result = await cropAdminMediaAction({ assetId, region });

      if (result.status === "success") {
        toast.success(result.message);
        onOpenChange(false);
        onCropped?.();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-4">
        <DialogHeader>
          <DialogTitle>Recadrer l’image</DialogTitle>
          <DialogDescription>
            {imageLabel ? `${imageLabel} — ` : ""}
            Déplacez et zoomez l’image dans le cadre. Le recadrage remplace l’image partout où elle
            est utilisée.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[52vh] max-h-105 w-full overflow-hidden rounded-2xl bg-black/85">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            minZoom={1}
            maxZoom={4}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Ratio de recadrage">
            {ASPECT_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setAspect(preset.value);
                  resetView();
                }}
                className={cn(
                  "h-8 rounded-full px-3 text-xs",
                  aspect === preset.value &&
                    "border-control-border-strong bg-interactive-selected text-foreground"
                )}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Zoom
            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-1.5 w-28 accent-foreground"
              aria-label="Zoom"
            />
          </label>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button type="button" onClick={handleApply} disabled={isPending || croppedArea === null}>
            {isPending ? "Recadrage…" : "Recadrer et remplacer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
