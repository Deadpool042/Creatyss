"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { SEO_INDEXING_MODE_LABELS, SEO_INDEXING_MODE_VALUES } from "@/entities/seo";
import { updateSeoSettingsAction } from "@/features/admin/settings/actions/update-seo-settings.action";
import { type SeoSettingsFormState } from "@/features/admin/settings/schemas/seo-settings.schema";
import type { AdminSeoSettings } from "@/features/admin/settings/queries/get-seo-settings.query";


const INITIAL_STATE: SeoSettingsFormState = { status: "idle" };

type Props = { seo: AdminSeoSettings | null };

export function SeoSettingsForm({ seo }: Props) {
  const [state, action, isPending] = useActionState(updateSeoSettingsAction, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state]);

  const fieldError = (key: string) =>
    state.status === "error" ? state.fieldErrors?.[key as keyof typeof state.fieldErrors] : undefined;

  const defaultIndexingMode = seo?.indexingMode ?? "INDEX_FOLLOW";
  const defaultSitemapIncluded = seo?.sitemapIncluded ?? true;

  return (
    <form action={action} className="relative">
      {/* Feedback global (champs invalides) */}
      {state.status === "error" && state.fieldErrors && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-error-border bg-feedback-error-surface/40 px-4 py-3">
          <XCircle className="size-4 shrink-0 text-feedback-error-foreground" />
          <p className="text-sm text-feedback-error-foreground">{state.message}</p>
        </div>
      )}
      {state.status === "success" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-success-border bg-feedback-success-surface/40 px-4 py-3">
          <CheckCircle2 className="size-4 shrink-0 text-feedback-success-foreground" />
          <p className="text-sm text-feedback-success-foreground">{state.message}</p>
        </div>
      )}

      <div className="divide-y divide-surface-border/40">
        {/* ── Section 1 : Métadonnées de base ──────────────────────── */}
        <AdminFormSection
          eyebrow="Référencement"
          title="Métadonnées principales"
          description="Titre et description affichés dans les résultats des moteurs de recherche pour la page d'accueil."
          className="py-6 first:pt-0"
        >
          <AdminFormField
            label="Titre de la page (meta title)"
            htmlFor="metaTitle"
            description="Recommandé : 50 à 60 caractères. Affiché dans les résultats Google."
            error={fieldError("metaTitle")}
          >
            <Input
              id="metaTitle"
              name="metaTitle"
              defaultValue={seo?.metaTitle ?? ""}
              maxLength={120}
              placeholder="Ma boutique — Produits artisanaux"
              className={cn(fieldError("metaTitle") && "border-feedback-error")}
            />
          </AdminFormField>

          <AdminFormField
            label="Description (meta description)"
            htmlFor="metaDescription"
            description="Recommandé : 120 à 160 caractères. Affiché sous le titre dans Google."
            error={fieldError("metaDescription")}
          >
            <Textarea
              id="metaDescription"
              name="metaDescription"
              defaultValue={seo?.metaDescription ?? ""}
              maxLength={320}
              rows={3}
              placeholder="Découvrez notre sélection de produits faits main, livrés en 48h partout en France."
              className={cn(fieldError("metaDescription") && "border-feedback-error")}
            />
          </AdminFormField>

          <AdminFormField
            label="Mots-clés (meta keywords)"
            htmlFor="metaKeywords"
            description="Séparés par des virgules. Peu utilisés par Google, mais utiles pour d'autres moteurs."
            error={fieldError("metaKeywords")}
          >
            <Input
              id="metaKeywords"
              name="metaKeywords"
              defaultValue={seo?.metaKeywords ?? ""}
              maxLength={500}
              placeholder="boutique, artisanat, fait main, France"
              className={cn(fieldError("metaKeywords") && "border-feedback-error")}
            />
          </AdminFormField>
        </AdminFormSection>

        {/* ── Section 2 : Open Graph ────────────────────────────────── */}
        <AdminFormSection
          eyebrow="Réseaux sociaux"
          title="Open Graph"
          description="Informations affichées lors du partage de la boutique sur Facebook, LinkedIn et autres réseaux."
          className="py-6"
        >
          <AdminFormField
            label="Titre Open Graph"
            htmlFor="openGraphTitle"
            description="Si vide, le meta title sera utilisé par défaut."
            error={fieldError("openGraphTitle")}
          >
            <Input
              id="openGraphTitle"
              name="openGraphTitle"
              defaultValue={seo?.openGraphTitle ?? ""}
              maxLength={120}
              placeholder="Identique au meta title si laissé vide"
              className={cn(fieldError("openGraphTitle") && "border-feedback-error")}
            />
          </AdminFormField>

          <AdminFormField
            label="Description Open Graph"
            htmlFor="openGraphDescription"
            description="Si vide, la meta description sera utilisée par défaut."
            error={fieldError("openGraphDescription")}
          >
            <Textarea
              id="openGraphDescription"
              name="openGraphDescription"
              defaultValue={seo?.openGraphDescription ?? ""}
              maxLength={320}
              rows={3}
              placeholder="Identique à la meta description si laissé vide"
              className={cn(fieldError("openGraphDescription") && "border-feedback-error")}
            />
          </AdminFormField>
        </AdminFormSection>

        {/* ── Section 3 : Twitter Card ──────────────────────────────── */}
        <AdminFormSection
          eyebrow="Réseaux sociaux"
          title="Twitter / X Card"
          description="Informations affichées lors du partage sur Twitter (X). Reprend l'Open Graph si vide."
          className="py-6"
        >
          <AdminFormField
            label="Titre Twitter"
            htmlFor="twitterTitle"
            description="Si vide, le titre Open Graph sera utilisé."
            error={fieldError("twitterTitle")}
          >
            <Input
              id="twitterTitle"
              name="twitterTitle"
              defaultValue={seo?.twitterTitle ?? ""}
              maxLength={120}
              placeholder="Identique au titre Open Graph si laissé vide"
              className={cn(fieldError("twitterTitle") && "border-feedback-error")}
            />
          </AdminFormField>

          <AdminFormField
            label="Description Twitter"
            htmlFor="twitterDescription"
            description="Si vide, la description Open Graph sera utilisée."
            error={fieldError("twitterDescription")}
          >
            <Textarea
              id="twitterDescription"
              name="twitterDescription"
              defaultValue={seo?.twitterDescription ?? ""}
              maxLength={320}
              rows={3}
              placeholder="Identique à la description Open Graph si laissé vide"
              className={cn(fieldError("twitterDescription") && "border-feedback-error")}
            />
          </AdminFormField>
        </AdminFormSection>

        {/* ── Section 4 : Indexation ────────────────────────────────── */}
        <AdminFormSection
          eyebrow="Indexation"
          title="Visibilité dans les moteurs"
          description="Contrôle comment les robots des moteurs de recherche traitent la boutique."
          className="py-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField
              label="Mode d'indexation"
              htmlFor="indexingMode"
              description="Détermine si la page d'accueil est indexée et si les liens sont suivis."
              error={fieldError("indexingMode")}
            >
              <Select name="indexingMode" defaultValue={defaultIndexingMode}>
                <SelectTrigger id="indexingMode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEO_INDEXING_MODE_VALUES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {SEO_INDEXING_MODE_LABELS[mode]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AdminFormField>

            <AdminFormField
              label="Inclure dans le sitemap"
              htmlFor="sitemapIncluded"
              description="Si activé, la page d'accueil apparaît dans le sitemap XML."
              error={fieldError("sitemapIncluded")}
            >
              <Select
                name="sitemapIncluded"
                defaultValue={defaultSitemapIncluded ? "true" : "false"}
              >
                <SelectTrigger id="sitemapIncluded">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Inclure dans le sitemap</SelectItem>
                  <SelectItem value="false">Exclure du sitemap</SelectItem>
                </SelectContent>
              </Select>
            </AdminFormField>
          </div>
        </AdminFormSection>
      </div>

      {/* ── Sticky footer ────────────────────────────────────────────── */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-surface-border/40 bg-page-background/90 px-0 py-4 backdrop-blur-sm">
        <Button
          type="submit"
          disabled={isPending}
          className="min-w-32 rounded-full"
        >
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
