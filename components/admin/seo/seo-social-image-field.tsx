"use client";

import Image from "next/image";
import type { JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { SeoFieldAutoReset } from "@/components/admin/seo/seo-field-auto-reset";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SeoSocialImageOption = {
  id: string;
  label: string;
  imageUrl: string | null;
};

type SeoSocialImageFieldProps = {
  imageId: string;
  imagePreviewUrl: string | null;
  options: SeoSocialImageOption[];
  onImageIdChange: (value: string) => void;
  imageIdError?: string;
};

const AUTO_IMAGE_VALUE = "__auto__";

export function SeoSocialImageField({
  imageId,
  imagePreviewUrl,
  options,
  onImageIdChange,
  imageIdError,
}: SeoSocialImageFieldProps): JSX.Element {
  const selectValue = imageId.trim().length > 0 ? imageId : AUTO_IMAGE_VALUE;

  return (
    <AdminFormField
      label="Image Open Graph"
      htmlFor="seo-open-graph-image"
      hint="Champ optionnel. En l’absence de valeur, l’image par défaut est utilisée."
      error={imageIdError}
    >
      {(controlProps) => (
        <div className="space-y-3 [@media(max-height:480px)]:space-y-2.5">
          <Select
            value={selectValue}
            onValueChange={(value) => onImageIdChange(value === AUTO_IMAGE_VALUE ? "" : value)}
          >
            <SelectTrigger id="seo-open-graph-image" className="text-sm" {...controlProps}>
              <SelectValue placeholder="Image automatique" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={AUTO_IMAGE_VALUE}>Image automatique</SelectItem>

              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-3 [@media(max-height:480px)]:space-y-2.5">
            <div className="w-fit overflow-hidden rounded-xl border border-surface-border bg-card p-2 [@media(max-height:480px)]:max-w-56">
              <div className="relative aspect-4/3 w-50 overflow-hidden rounded-lg bg-muted [@media(max-height:480px)]:aspect-4/3">
                {imagePreviewUrl ? (
                  <Image
                    src={imagePreviewUrl}
                    alt=""
                    fill
                    sizes="(max-height: 480px) 224px, (min-width: 1024px) 640px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    Aucune image sélectionnée
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <SeoFieldAutoReset
                onReset={() => onImageIdChange("")}
                disabled={imageId.trim().length === 0}
              />
            </div>
          </div>
        </div>
      )}
    </AdminFormField>
  );
}
