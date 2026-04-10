"use client";

import Image from "next/image";
import type { JSX, ReactNode } from "react";

import { SeoEditorBlock } from "./seo-editor-block";
import { SeoDefaultValues } from "./seo-default-values";
import { SeoSocialFields } from "./seo-social-fields";
import { SeoSocialImageField } from "./seo-social-image-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type SeoSocialImageOption = {
  id: string;
  label: string;
  imageUrl: string | null;
};

type SeoSocialSummaryCardProps = {
  resolvedTitle: string;
  resolvedDescription: string;
  imagePreviewUrl: string | null;
  openGraphTitle: string;
  openGraphDescription: string;
  onOpenGraphTitleChange: (value: string) => void;
  onOpenGraphDescriptionChange: (value: string) => void;
  fallbackOpenGraphTitle: string;
  fallbackOpenGraphDescription: string;
  openGraphTitleError?: string;
  openGraphDescriptionError?: string;
  openGraphImageId: string;
  imageOptions: SeoSocialImageOption[];
  onImageIdChange: (value: string) => void;
  fallbackOpenGraphImageUrl: string | null;
  imageIdError?: string;
};

function SocialSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="pt-3">{children}</div>
    </div>
  );
}

const ACCORDION_ITEM_CLASS_NAME =
  "overflow-hidden rounded-2xl border border-surface-border bg-card shadow-card transition-colors duration-200";

const ACCORDION_TRIGGER_CLASS_NAME =
  "px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:no-underline hover:bg-interactive-hover data-[state=open]:bg-interactive-selected md:px-5 md:py-4";

const ACCORDION_CONTENT_INNER_CLASS_NAME =
  "border-t border-surface-border bg-surface-panel px-4 pb-5 pt-4 md:px-5";

export function SeoSocialSummaryCard({
  resolvedTitle,
  resolvedDescription,
  imagePreviewUrl,
  openGraphTitle,
  openGraphDescription,
  onOpenGraphTitleChange,
  onOpenGraphDescriptionChange,
  fallbackOpenGraphTitle,
  fallbackOpenGraphDescription,
  openGraphTitleError,
  openGraphDescriptionError,
  openGraphImageId,
  imageOptions,
  onImageIdChange,
  fallbackOpenGraphImageUrl,
  imageIdError,
}: SeoSocialSummaryCardProps): JSX.Element {
  return (
    <div className="space-y-4 md:space-y-5">
      <SeoEditorBlock
        title="Aperçu du partage"
        description="Résumé du rendu Open Graph utilisé par les réseaux sociaux et les messageries."
      >
        <div className="flex items-start gap-3 rounded-2xl border border-surface-border bg-surface-panel p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-surface-border bg-muted">
            {imagePreviewUrl ? (
              <Image src={imagePreviewUrl} alt="" fill sizes="64px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-center text-[10px] leading-tight text-muted-foreground">
                  Auto
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{resolvedTitle}</p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {resolvedDescription}
            </p>
          </div>
        </div>
      </SeoEditorBlock>

      <Accordion type="multiple" defaultValue={["text-opengraph"]} className="space-y-4">
        <AccordionItem value="text-opengraph" className={ACCORDION_ITEM_CLASS_NAME}>
          <AccordionTrigger className={ACCORDION_TRIGGER_CLASS_NAME}>
            Texte Open Graph
          </AccordionTrigger>

          <AccordionContent>
            <div className={ACCORDION_CONTENT_INNER_CLASS_NAME}>
              <SocialSection
                title="Titre et description"
                description="Contenu affiché dans l’aperçu social quand une valeur spécifique est renseignée."
              >
                <div className="space-y-4">
                  <SeoSocialFields
                    openGraphTitle={openGraphTitle}
                    openGraphDescription={openGraphDescription}
                    onOpenGraphTitleChange={onOpenGraphTitleChange}
                    onOpenGraphDescriptionChange={onOpenGraphDescriptionChange}
                    {...(openGraphTitleError !== undefined ? { openGraphTitleError } : {})}
                    {...(openGraphDescriptionError !== undefined
                      ? { openGraphDescriptionError }
                      : {})}
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
              </SocialSection>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="image-opengraph" className={ACCORDION_ITEM_CLASS_NAME}>
          <AccordionTrigger className={ACCORDION_TRIGGER_CLASS_NAME}>
            Image Open Graph
          </AccordionTrigger>

          <AccordionContent>
            <div className={ACCORDION_CONTENT_INNER_CLASS_NAME}>
              <SocialSection
                title="Image de partage"
                description="Image utilisée pour représenter le produit dans les aperçus sociaux."
              >
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
              </SocialSection>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
