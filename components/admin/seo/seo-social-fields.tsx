"use client";

import type { JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SeoFieldAutoReset } from "./seo-field-auto-reset";

type SeoSocialFieldsProps = {
  openGraphTitle: string;
  openGraphDescription: string;
  onOpenGraphTitleChange: (value: string) => void;
  onOpenGraphDescriptionChange: (value: string) => void;
  openGraphTitleError?: string;
  openGraphDescriptionError?: string;
};

export function SeoSocialFields({
  openGraphTitle,
  openGraphDescription,
  onOpenGraphTitleChange,
  onOpenGraphDescriptionChange,
  openGraphTitleError,
  openGraphDescriptionError,
}: SeoSocialFieldsProps): JSX.Element {
  return (
    <div className="space-y-4">
      <AdminFormField
        label="Titre Open Graph"
        htmlFor="seo-open-graph-title"
        hint="Champ optionnel. En l’absence de valeur, le titre SEO est utilisé."
        error={openGraphTitleError}
      >
        {(controlProps) => (
          <div className="space-y-2">
            <Input
              id="seo-open-graph-title"
              value={openGraphTitle}
              onChange={(event) => onOpenGraphTitleChange(event.target.value)}
              className="text-sm"
              {...controlProps}
            />
            <div className="flex justify-end">
              <SeoFieldAutoReset
                onReset={() => onOpenGraphTitleChange("")}
                disabled={openGraphTitle.trim().length === 0}
              />
            </div>
          </div>
        )}
      </AdminFormField>

      <AdminFormField
        label="Description Open Graph"
        htmlFor="seo-open-graph-description"
        hint="Champ optionnel. En l’absence de valeur, la description SEO est utilisée."
        error={openGraphDescriptionError}
      >
        {(controlProps) => (
          <div className="space-y-2">
            <Textarea
              id="seo-open-graph-description"
              value={openGraphDescription}
              onChange={(event) => onOpenGraphDescriptionChange(event.target.value)}
              rows={4}
              className="resize-none text-sm"
              {...controlProps}
            />
            <div className="flex justify-end">
              <SeoFieldAutoReset
                onReset={() => onOpenGraphDescriptionChange("")}
                disabled={openGraphDescription.trim().length === 0}
              />
            </div>
          </div>
        )}
      </AdminFormField>
    </div>
  );
}
