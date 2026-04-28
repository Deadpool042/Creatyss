"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import type { HeroImage } from "./product-hero-thumbnail-button";

type ProductHeroLightboxProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: HeroImage[];
  activeImageIndex: number;
  onSelectImageIndex: (index: number) => void;
  productName: string;
  imageFit: "contain" | "cover";
};

export function ProductHeroLightbox({
  open,
  onOpenChange,
  images,
  activeImageIndex,
  onSelectImageIndex,
  productName,
  imageFit,
}: ProductHeroLightboxProps) {
  const safeActiveIndex =
    activeImageIndex >= 0 && activeImageIndex < images.length ? activeImageIndex : 0;
  const selectedImage = images[safeActiveIndex];
  const hasNavigation = images.length > 1;

  function goPrev(): void {
    if (!hasNavigation) return;
    const nextIndex = safeActiveIndex === 0 ? images.length - 1 : safeActiveIndex - 1;
    onSelectImageIndex(nextIndex);
  }

  function goNext(): void {
    if (!hasNavigation) return;
    const nextIndex = safeActiveIndex === images.length - 1 ? 0 : safeActiveIndex + 1;
    onSelectImageIndex(nextIndex);
  }

  useEffect(() => {
    if (!open || !hasNavigation) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const nextIndex = safeActiveIndex === 0 ? images.length - 1 : safeActiveIndex - 1;
        onSelectImageIndex(nextIndex);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = safeActiveIndex === images.length - 1 ? 0 : safeActiveIndex + 1;
        onSelectImageIndex(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, hasNavigation, safeActiveIndex, images.length, onSelectImageIndex]);

  if (images.length === 0) {
    return null;
  }

  if (!selectedImage) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100vw-1.5rem)] border-shell-border/80 bg-background/95 p-2 shadow-floating sm:max-w-[min(100vw-2.5rem,74rem)] sm:p-3"
        aria-label="Galerie produit"
      >
        <div className="relative">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 z-20 bg-background/70 text-foreground hover:bg-background/90"
              aria-label="Fermer la galerie"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>

          <div className="relative aspect-[4/5] max-h-[85vh] w-full overflow-hidden rounded-lg border border-shell-border/80 bg-surface-subtle/50 sm:rounded-xl">
            <Image
              key={selectedImage.src}
              src={selectedImage.src}
              alt={selectedImage.alt ?? productName}
              fill
              sizes="100vw"
              className={imageFit === "cover" ? "object-cover" : "object-contain"}
            />
          </div>

          {hasNavigation ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goPrev}
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-background/70 hover:bg-background/90"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goNext}
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-background/70 hover:bg-background/90"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          ) : null}

          {hasNavigation ? (
            <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/70 px-2 py-0.5 text-[11px] tabular-nums text-foreground">
              {safeActiveIndex + 1} / {images.length}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
