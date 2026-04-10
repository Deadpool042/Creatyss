"use client";

import type { JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SeoIndexingMode } from "@/entities/seo";
import { SeoEditorBlock } from "./seo-editor-block";

type SeoVisibilityFieldsProps = {
  indexingMode: SeoIndexingMode;
  sitemapIncluded: boolean;
  onIndexingModeChange: (value: SeoIndexingMode) => void;
  onSitemapIncludedChange: (value: boolean) => void;
  indexingModeError?: string;
  sitemapIncludedError?: string;
};

const INDEXING_MODE_LABELS: Record<SeoIndexingMode, string> = {
  INDEX_FOLLOW: "Index, follow",
  INDEX_NOFOLLOW: "Index, nofollow",
  NOINDEX_FOLLOW: "Noindex, follow",
  NOINDEX_NOFOLLOW: "Noindex, nofollow",
};

function SummaryRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-surface-border bg-surface-panel px-3 py-2.5">
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function isSeoIndexingMode(value: string): value is SeoIndexingMode {
  return value in INDEXING_MODE_LABELS;
}

export function SeoVisibilityFields({
  indexingMode,
  sitemapIncluded,
  onIndexingModeChange,
  onSitemapIncludedChange,
  indexingModeError,
  sitemapIncludedError,
}: SeoVisibilityFieldsProps): JSX.Element {
  return (
    <div className="space-y-4 md:space-y-5">
      <div className="grid gap-4 xl:grid-cols-2">
        <SeoEditorBlock
          title="Indexation moteur"
          description="Détermine si la page produit peut être indexée et si ses liens doivent être suivis."
        >
          <AdminFormField
            label="Mode d’indexation"
            htmlFor="seo-indexing-mode"
            error={indexingModeError}
          >
            {(controlProps) => (
              <Select
                value={indexingMode}
                onValueChange={(value) => {
                  if (isSeoIndexingMode(value)) {
                    onIndexingModeChange(value);
                  }
                }}
              >
                <SelectTrigger id="seo-indexing-mode" className="text-sm" {...controlProps}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="INDEX_FOLLOW">Index, follow</SelectItem>
                  <SelectItem value="INDEX_NOFOLLOW">Index, nofollow</SelectItem>
                  <SelectItem value="NOINDEX_FOLLOW">Noindex, follow</SelectItem>
                  <SelectItem value="NOINDEX_NOFOLLOW">Noindex, nofollow</SelectItem>
                </SelectContent>
              </Select>
            )}
          </AdminFormField>
        </SeoEditorBlock>

        <SeoEditorBlock
          title="Présence dans le sitemap"
          description="Indique si cette page doit apparaître dans le sitemap XML envoyé aux moteurs."
        >
          <AdminFormField
            label="Sitemap"
            htmlFor="seo-sitemap-included"
            error={sitemapIncludedError}
          >
            {(controlProps) => (
              <Select
                value={sitemapIncluded ? "true" : "false"}
                onValueChange={(value) => onSitemapIncludedChange(value === "true")}
              >
                <SelectTrigger id="seo-sitemap-included" className="text-sm" {...controlProps}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="true">Inclure dans le sitemap</SelectItem>
                  <SelectItem value="false">Exclure du sitemap</SelectItem>
                </SelectContent>
              </Select>
            )}
          </AdminFormField>
        </SeoEditorBlock>
      </div>

      <SeoEditorBlock
        title="État actuel"
        description="Résumé rapide des signaux techniques appliqués à cette page produit."
      >
        <div className="grid gap-2">
          <SummaryRow label="Indexation" value={INDEXING_MODE_LABELS[indexingMode]} />
          <SummaryRow
            label="Sitemap"
            value={sitemapIncluded ? "Inclus dans le sitemap" : "Exclu du sitemap"}
          />
        </div>
      </SeoEditorBlock>
    </div>
  );
}
