"use client";

import { useState, type JSX } from "react";
import { Crop } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      <Button
        type="button"
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
      >
        <Crop className="h-3.5 w-3.5" />
        Recadrer
      </Button>

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
