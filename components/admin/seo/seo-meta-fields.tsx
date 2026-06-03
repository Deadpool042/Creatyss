"use client";

import type { JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SEO_META_DESCRIPTION_SOFT_LIMIT, SEO_META_TITLE_SOFT_LIMIT } from "@/entities/seo";
import { SeoEditorBlock } from "./seo-editor-block";
import { SeoFieldAutoReset } from "./seo-field-auto-reset";

type SeoMetaFieldsProps = {
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onCanonicalPathChange: (value: string) => void;
  withCanonical?: boolean;
  metaTitleError?: string;
  metaDescriptionError?: string;
  canonicalPathError?: string;
};

export function SeoMetaFields({
  metaTitle,
  metaDescription,
  canonicalPath,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onCanonicalPathChange,
  withCanonical = true,
  metaTitleError,
  metaDescriptionError,
  canonicalPathError,
}: SeoMetaFieldsProps): JSX.Element {
  const metaTitleLength = metaTitle.trim().length;
  const metaDescriptionLength = metaDescription.trim().length;

  return (
    <div className="space-y-4 md:space-y-5">
      <SeoEditorBlock
        title="Contenu de recherche"
        description="Titre et description affichés dans les résultats moteur quand une valeur spécifique est renseignée."
      >
        <div className="space-y-4">
          <AdminFormField
            label={
              <div className="flex w-full items-start justify-between gap-3">
                <span>Titre SEO</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  {metaTitleLength} / {SEO_META_TITLE_SOFT_LIMIT}
                </span>
              </div>
            }
            htmlFor="seo-meta-title"
            hint="Champ optionnel. En l’absence de valeur, le nom du produit est utilisé."
            error={metaTitleError}
          >
            {(controlProps) => (
              <div className="space-y-2">
                <Input
                  id="seo-meta-title"
                  value={metaTitle}
                  onChange={(event) => onMetaTitleChange(event.target.value)}
                  className="text-sm"
                  {...controlProps}
                />
                <div className="flex justify-end">
                  <SeoFieldAutoReset
                    onReset={() => onMetaTitleChange("")}
                    disabled={metaTitle.trim().length === 0}
                  />
                </div>
              </div>
            )}
          </AdminFormField>

          <AdminFormField
            label={
              <div className="flex w-full items-start justify-between gap-3">
                <span>Description SEO</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  {metaDescriptionLength} / {SEO_META_DESCRIPTION_SOFT_LIMIT}
                </span>
              </div>
            }
            htmlFor="seo-meta-description"
            hint="Champ optionnel. En l’absence de valeur, la description courte est utilisée."
            error={metaDescriptionError}
          >
            {(controlProps) => (
              <div className="space-y-2">
                <Textarea
                  id="seo-meta-description"
                  value={metaDescription}
                  onChange={(event) => onMetaDescriptionChange(event.target.value)}
                  rows={5}
                  className="resize-none text-sm"
                  {...controlProps}
                />
                <div className="flex justify-end">
                  <SeoFieldAutoReset
                    onReset={() => onMetaDescriptionChange("")}
                    disabled={metaDescription.trim().length === 0}
                  />
                </div>
              </div>
            )}
          </AdminFormField>
        </div>
      </SeoEditorBlock>

      {withCanonical && (
        <SeoEditorBlock
          title="URL canonique"
          description="Chemin de référence utilisé pour indiquer aux moteurs l’URL canonique de cette page produit."
        >
          <AdminFormField
            label="Chemin canonique"
            htmlFor="seo-canonical-path"
            hint="Champ optionnel. En l’absence de valeur, l’URL canonique calculée est utilisée."
            error={canonicalPathError}
          >
            {(controlProps) => (
              <div className="space-y-2">
                <Input
                  id="seo-canonical-path"
                  value={canonicalPath}
                  onChange={(event) => onCanonicalPathChange(event.target.value)}
                  placeholder="/products/mon-produit"
                  className="font-mono text-sm"
                  {...controlProps}
                />
                <div className="flex justify-end">
                  <SeoFieldAutoReset
                    onReset={() => onCanonicalPathChange("")}
                    disabled={canonicalPath.trim().length === 0}
                  />
                </div>
              </div>
            )}
          </AdminFormField>
        </SeoEditorBlock>
      )}
    </div>
  );
}
