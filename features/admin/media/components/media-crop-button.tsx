"use client";

import { useState, type JSX } from "react";
import { Crop } from "lucide-react";

import { MediaCropDialog } from "./media-crop-dialog";

type MediaCropButtonProps = Readonly<{
  assetId: string;
  imageUrl: string;
  imageLabel?: string;
}>;

/** Bouton "Recadrer" autonome pour la médiathèque globale (carte asset). */
export function MediaCropButton({
  assetId,
  imageUrl,
  imageLabel,
}: MediaCropButtonProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-panel/90 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:border-surface-border-strong hover:text-foreground"
      >
        <Crop className="h-3.5 w-3.5" />
        Recadrer
      </button>

      <MediaCropDialog
        open={open}
        onOpenChange={setOpen}
        assetId={assetId}
        imageUrl={imageUrl}
        {...(imageLabel ? { imageLabel } : {})}
      />
    </>
  );
}
