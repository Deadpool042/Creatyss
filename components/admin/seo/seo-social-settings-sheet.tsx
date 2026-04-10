"use client";

import { useSyncExternalStore, type JSX } from "react";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SeoDefaultValues } from "./seo-default-values";
import { SeoSocialFields } from "./seo-social-fields";
import { SeoSocialImageField } from "./seo-social-image-field";

const LG_QUERY = "(min-width: 1024px)";

function subscribeLg(callback: () => void): () => void {
  const mql = window.matchMedia(LG_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshotLg(): boolean {
  return window.matchMedia(LG_QUERY).matches;
}

function getServerSnapshotLg(): boolean {
  return false;
}

function useIsLarge(): boolean {
  return useSyncExternalStore(subscribeLg, getSnapshotLg, getServerSnapshotLg);
}

type SeoSocialImageOption = {
  id: string;
  label: string;
  imageUrl: string | null;
};

export type SeoSocialSettingsSheetProps = {
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageId: string;
  imagePreviewUrl: string | null;
  imageOptions: SeoSocialImageOption[];
  fallbackOpenGraphTitle: string;
  fallbackOpenGraphDescription: string;
  fallbackOpenGraphImageUrl: string | null;
  onOpenGraphTitleChange: (value: string) => void;
  onOpenGraphDescriptionChange: (value: string) => void;
  onImageIdChange: (value: string) => void;
  openGraphTitleError?: string;
  openGraphDescriptionError?: string;
  imageIdError?: string;
};

export function SeoSocialSettingsSheet({
  openGraphTitle,
  openGraphDescription,
  openGraphImageId,
  imagePreviewUrl,
  imageOptions,
  fallbackOpenGraphTitle,
  fallbackOpenGraphDescription,
  fallbackOpenGraphImageUrl,
  onOpenGraphTitleChange,
  onOpenGraphDescriptionChange,
  onImageIdChange,
  openGraphTitleError,
  openGraphDescriptionError,
  imageIdError,
}: SeoSocialSettingsSheetProps): JSX.Element {
  const isLarge = useIsLarge();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-full px-4 text-xs"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Configurer
        </Button>
      </SheetTrigger>

      {isLarge ? (
        <SheetContent side="right" className="flex w-120 flex-col overflow-hidden">
          <SheetHeader className="shrink-0">
            <SheetTitle>Partage social</SheetTitle>
            <SheetDescription>Titre, description et image Open Graph.</SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-4">
            <div className="space-y-6">
              <SeoSocialSettingsBody
                openGraphTitle={openGraphTitle}
                openGraphDescription={openGraphDescription}
                openGraphImageId={openGraphImageId}
                imagePreviewUrl={imagePreviewUrl}
                imageOptions={imageOptions}
                fallbackOpenGraphTitle={fallbackOpenGraphTitle}
                fallbackOpenGraphDescription={fallbackOpenGraphDescription}
                fallbackOpenGraphImageUrl={fallbackOpenGraphImageUrl}
                onOpenGraphTitleChange={onOpenGraphTitleChange}
                onOpenGraphDescriptionChange={onOpenGraphDescriptionChange}
                onImageIdChange={onImageIdChange}
                openGraphTitleError={openGraphTitleError}
                openGraphDescriptionError={openGraphDescriptionError}
                imageIdError={imageIdError}
              />
            </div>
          </div>
        </SheetContent>
      ) : (
        <SheetContent
          side="bottom"
          className="h-[88dvh] overflow-y-auto overscroll-contain rounded-t-2xl px-0 pb-0 touch-pan-y [-webkit-overflow-scrolling:touch]"
        >
          <SheetHeader className="px-4 pt-3 text-left">
            <SheetTitle>Partage social</SheetTitle>
            <SheetDescription>Titre, description et image Open Graph.</SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4">
            <div className="space-y-6">
              <SeoSocialSettingsBody
                openGraphTitle={openGraphTitle}
                openGraphDescription={openGraphDescription}
                openGraphImageId={openGraphImageId}
                imagePreviewUrl={imagePreviewUrl}
                imageOptions={imageOptions}
                fallbackOpenGraphTitle={fallbackOpenGraphTitle}
                fallbackOpenGraphDescription={fallbackOpenGraphDescription}
                fallbackOpenGraphImageUrl={fallbackOpenGraphImageUrl}
                onOpenGraphTitleChange={onOpenGraphTitleChange}
                onOpenGraphDescriptionChange={onOpenGraphDescriptionChange}
                onImageIdChange={onImageIdChange}
                openGraphTitleError={openGraphTitleError}
                openGraphDescriptionError={openGraphDescriptionError}
                imageIdError={imageIdError}
              />
            </div>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
}

type SeoSocialSettingsBodyProps = {
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageId: string;
  imagePreviewUrl: string | null;
  imageOptions: SeoSocialImageOption[];
  fallbackOpenGraphTitle: string;
  fallbackOpenGraphDescription: string;
  fallbackOpenGraphImageUrl: string | null;
  onOpenGraphTitleChange: (value: string) => void;
  onOpenGraphDescriptionChange: (value: string) => void;
  onImageIdChange: (value: string) => void;
  openGraphTitleError: string | undefined;
  openGraphDescriptionError: string | undefined;
  imageIdError: string | undefined;
};

function SeoSocialSettingsBody({
  openGraphTitle,
  openGraphDescription,
  openGraphImageId,
  imagePreviewUrl,
  imageOptions,
  fallbackOpenGraphTitle,
  fallbackOpenGraphDescription,
  fallbackOpenGraphImageUrl,
  onOpenGraphTitleChange,
  onOpenGraphDescriptionChange,
  onImageIdChange,
  openGraphTitleError,
  openGraphDescriptionError,
  imageIdError,
}: SeoSocialSettingsBodyProps): JSX.Element {
  return (
    <>
      <div className="space-y-4">
        <SeoSocialFields
          openGraphTitle={openGraphTitle}
          openGraphDescription={openGraphDescription}
          onOpenGraphTitleChange={onOpenGraphTitleChange}
          onOpenGraphDescriptionChange={onOpenGraphDescriptionChange}
          {...(openGraphTitleError !== undefined ? { openGraphTitleError } : {})}
          {...(openGraphDescriptionError !== undefined ? { openGraphDescriptionError } : {})}
        />
        <SeoDefaultValues
          items={[
            { label: "Titre Open Graph", value: fallbackOpenGraphTitle },
            {
              label: "Description Open Graph",
              value: fallbackOpenGraphDescription,
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        <SeoSocialImageField
          imageId={openGraphImageId}
          imagePreviewUrl={imagePreviewUrl}
          options={imageOptions}
          onImageIdChange={onImageIdChange}
          {...(imageIdError !== undefined ? { imageIdError } : {})}
        />
        <SeoDefaultValues
          items={[
            {
              label: "Image Open Graph",
              value: fallbackOpenGraphImageUrl ?? "Aucune image par défaut",
            },
          ]}
        />
      </div>
    </>
  );
}
