"use client";

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, type JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminCharCounter } from "@/components/admin/forms/admin-char-counter";
import { Button } from "@/components/ui/button";
import { clientEnv } from "@/core/config/env/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toSeoPlainText } from "@/entities/product/seo-text";
import {
  productSeoFormInitialState,
  type AdminProductEditorData,
  type ProductSeoFormAction,
} from "@/features/admin/products/editor/types";

const SITE_NAME = "Creatyss";

type ProductSeoTabProps = {
  action: ProductSeoFormAction;
  product: AdminProductEditorData;
};

type ProductSeoTabInnerProps = ProductSeoTabProps & {
  onReset: () => void;
};

const SEO_TITLE_RECOMMENDED = 60;
const SEO_TITLE_MIN = 20;
const SEO_DESC_RECOMMENDED = 160;
const SEO_DESC_MIN = 50;

function buildSeoTitleTemplate(productName: string, siteName: string): string {
  const full = `${productName} | ${siteName}`;
  return full.length > SEO_TITLE_RECOMMENDED ? full.slice(0, SEO_TITLE_RECOMMENDED) : full;
}

function buildSeoDescTemplate(shortDescription: string | null, description: string | null): string {
  const source = toSeoPlainText(shortDescription ?? description ?? "");
  return source.length > SEO_DESC_RECOMMENDED ? source.slice(0, SEO_DESC_RECOMMENDED) : source;
}

function SerpPreview({
  title,
  url,
  description,
}: {
  title: string;
  url: string;
  description: string;
}): JSX.Element {
  const rawTitle = title.trim();
  const rawDesc = description.trim();

  const displayTitle = rawTitle
    ? rawTitle.length > SEO_TITLE_RECOMMENDED
      ? rawTitle.slice(0, SEO_TITLE_RECOMMENDED) + "…"
      : rawTitle
    : "—";

  const displayDesc = rawDesc
    ? rawDesc.length > SEO_DESC_RECOMMENDED
      ? rawDesc.slice(0, SEO_DESC_RECOMMENDED) + "…"
      : rawDesc
    : "—";

  // Build full URL for display: domain + path
  let displayUrl = url;
  try {
    const base = new URL(clientEnv.appUrl);
    displayUrl = base.hostname + url;
  } catch {
    // fallback to path only if URL parsing fails
  }

  return (
    <div className="rounded-xl border border-border bg-background px-4 py-4 space-y-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Aperçu Google
      </p>

      {/* Site identity row */}
      <div className="flex items-center gap-2">
        <div className="size-5 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span className="text-[9px] font-bold text-muted-foreground">{SITE_NAME[0]}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium leading-tight text-foreground">{SITE_NAME}</p>
          <p className="text-[11px] text-muted-foreground truncate">{displayUrl}</p>
        </div>
      </div>

      {/* Title */}
      <p className="text-[16px] font-normal leading-snug text-blue-600 dark:text-blue-400">
        {displayTitle}
      </p>

      {/* Description */}
      <p className="text-[13px] leading-snug text-foreground/80">{displayDesc}</p>
    </div>
  );
}

function SocialPreview({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description: string;
  imageUrl: string | null;
}): JSX.Element {
  const displayTitle = title.trim() || "—";
  const displayDesc = description.trim() || "—";

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="aspect-[1.91/1] bg-muted relative overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] text-muted-foreground">Image du produit</span>
          </div>
        )}
      </div>
      <div className="px-3 py-2.5 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Aperçu partage
        </p>
        <p
          className="text-[13px] font-semibold leading-snug text-foreground truncate"
          title={displayTitle}
        >
          {displayTitle}
        </p>
        <p className="text-[11px] text-muted-foreground line-clamp-2">{displayDesc}</p>
      </div>
    </div>
  );
}

type SeoCheckStatus = "good" | "warn" | "error";

type SeoCheckItem = {
  label: string;
  status: SeoCheckStatus;
  hint?: string;
  nextStep?: string;
};

function SeoChecklist({ items }: { items: SeoCheckItem[] }): JSX.Element {
  const sorted = [...items].sort((left, right) => {
    const weight = (status: SeoCheckStatus) => (status === "error" ? 0 : status === "warn" ? 1 : 2);
    return weight(left.status) - weight(right.status);
  });
  const errorCount = items.filter((item) => item.status === "error").length;
  const warnCount = items.filter((item) => item.status === "warn").length;

  const headerText =
    errorCount > 0
      ? "Points à corriger"
      : warnCount > 0
        ? "Quelques points à surveiller"
        : "SEO en bon état";

  const headerColor =
    errorCount > 0
      ? "text-destructive"
      : warnCount > 0
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-700 dark:text-emerald-400";

  const borderBg =
    errorCount > 0
      ? "border-border bg-muted/40"
      : warnCount > 0
        ? "border-amber-200/60 bg-amber-50/40 dark:border-amber-800/30 dark:bg-amber-950/10"
        : "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/40 dark:bg-emerald-950/20";

  return (
    <div className={["rounded-xl border px-4 py-3 text-sm", borderBg].join(" ")}>
      <p
        className={["mb-2.5 text-[11px] font-semibold uppercase tracking-wide", headerColor].join(
          " "
        )}
      >
        {headerText}
      </p>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((item) => (
          <li key={item.label} className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              {item.status === "good" && (
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-emerald-400"
                  aria-hidden="true"
                />
              )}
              {item.status === "warn" && (
                <AlertTriangle
                  className="h-3.5 w-3.5 shrink-0 text-amber-500 dark:text-amber-400"
                  aria-hidden="true"
                />
              )}
              {item.status === "error" && (
                <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" aria-hidden="true" />
              )}
              <span className="text-[11px] leading-snug text-foreground/80">{item.label}</span>
            </div>
            {item.hint ? (
              <p className="pl-5.5 text-[10px] leading-snug text-muted-foreground">{item.hint}</p>
            ) : null}
            {item.nextStep ? (
              <p className="pl-5.5 text-[10px] leading-snug text-foreground/70">
                {item.nextStep}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SeoNextSteps({ items }: { items: SeoCheckItem[] }): JSX.Element | null {
  const actionable = items.filter((item) => item.status !== "good" && item.nextStep).slice(0, 3);
  if (actionable.length === 0) return null;

  return (
    <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-4 py-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted-strong">
        À faire en priorité
      </p>
      <ul className="grid gap-2">
        {actionable.map((item) => (
          <li key={item.label} className="grid gap-0.5">
            <p className="text-[11px] font-medium leading-snug text-foreground">{item.label}</p>
            <p className="text-[11px] leading-snug text-text-muted-strong">{item.nextStep}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductSeoTabInner({ action, product, onReset }: ProductSeoTabInnerProps): JSX.Element {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, productSeoFormInitialState);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router]);

  // Pre-fill: use saved value if non-empty, otherwise fallback to product data
  const initialTitle = product.seo.title.trim() || product.seo.fallbackTitle;
  const initialDesc = toSeoPlainText(
    product.seo.description.trim() || product.seo.fallbackDescription
  );
  const previewUrl = product.seo.canonicalPath ?? product.seo.fallbackCanonicalPath;
  const fallbackOpenGraphDescriptionPlain = toSeoPlainText(product.seo.fallbackOpenGraphDescription);

  const [titleValue, setTitleValue] = useState(initialTitle);
  const [descValue, setDescValue] = useState(initialDesc);

  // Pre-fill button visibility: show when no explicit override is saved yet
  const hasSavedTitle = product.seo.title.trim() !== "";
  const hasSavedDesc = product.seo.description.trim() !== "";

  // Social section: auto-expand if any override is already saved
  const hasOverrides =
    product.seo.openGraphTitle.trim() !== "" ||
    product.seo.openGraphDescription.trim() !== "" ||
    (product.seo.twitterTitle?.trim() ?? "") !== "" ||
    (product.seo.twitterDescription?.trim() ?? "") !== "";
  const [showSocialFields, setShowSocialFields] = useState(hasOverrides);

  // Social image: single dedicated image for OG + Twitter, falls back to primary product image
  const [socialImageId, setSocialImageId] = useState<string | null>(
    product.seo.openGraphImageId ?? product.seo.twitterImageId ?? null
  );
  const [showSocialImagePicker, setShowSocialImagePicker] = useState(false);
  const productOnlyImages = product.images.filter((img) => img.subjectType === "product");
  const socialImageUrl =
    socialImageId !== null
      ? (productOnlyImages.find((img) => img.mediaAssetId === socialImageId)?.publicUrl ??
        product.product.primaryImageUrl)
      : product.product.primaryImageUrl;

  // Effective social values for preview: saved override first, then live main SEO values
  const effectiveSocialTitle = product.seo.openGraphTitle.trim() || titleValue;
  const effectiveSocialDesc = product.seo.openGraphDescription.trim() || descValue;

  const titleLen = titleValue.trim().length;
  const descLen = descValue.trim().length;
  const titleStatus: SeoCheckStatus =
    titleLen >= SEO_TITLE_MIN && titleLen <= SEO_TITLE_RECOMMENDED
      ? "good"
      : titleLen > SEO_TITLE_RECOMMENDED
        ? "warn"
        : "error";
  const descStatus: SeoCheckStatus =
    descLen >= SEO_DESC_MIN && descLen <= SEO_DESC_RECOMMENDED
      ? "good"
      : descLen > SEO_DESC_RECOMMENDED
        ? "warn"
        : "error";
  const indexingStatus: SeoCheckStatus = product.seo.indexingMode.startsWith("INDEX")
    ? "good"
    : "error";
  const sitemapStatus: SeoCheckStatus = product.seo.sitemapIncluded ? "good" : "error";
  const socialImageStatus: SeoCheckStatus =
    socialImageUrl === null ? "error" : socialImageId !== null ? "good" : "warn";
  const canonicalStatus: SeoCheckStatus =
    product.seo.canonicalPath != null && product.seo.canonicalPath.trim() !== "" ? "warn" : "good";
  const socialOverridesStatus: SeoCheckStatus = hasOverrides ? "good" : "warn";

  const checklistItems: SeoCheckItem[] = [
    {
      label: "Titre SEO",
      status: titleStatus,
      ...(titleStatus === "error"
        ? { hint: "Trop court", nextStep: "Ajoutez un détail utile : matière, usage ou gamme." }
        : titleStatus === "warn"
          ? {
              hint: "Trop long",
              nextStep: "Gardez le nom du produit + 1 bénéfice, retirez le reste.",
            }
          : {
              hint: "Bon",
              nextStep: "Nom clair, longueur stable.",
            }),
    },
    {
      label: "Description SEO",
      status: descStatus,
      ...(descStatus === "error"
        ? {
            hint: "Trop courte",
            nextStep: "Écrivez 1 phrase : ce que c'est + pour qui + un bénéfice.",
          }
        : descStatus === "warn"
          ? {
              hint: "Trop longue",
              nextStep: "Gardez l'essentiel : produit + bénéfice + matière (optionnel).",
            }
          : {
              hint: "Bon",
              nextStep: "Résumé clair en 1 phrase.",
            }),
    },
    {
      label: "Visibilité Google",
      status: indexingStatus,
      ...(indexingStatus === "error"
        ? {
            hint: "Page masquée",
            nextStep: "Remettez sur “Visible” si vous voulez la faire apparaître sur Google.",
          }
        : { hint: "Visible", nextStep: "OK." }),
    },
    {
      label: "Plan du site",
      status: sitemapStatus,
      ...(sitemapStatus === "error"
        ? { hint: "Exclue", nextStep: "Incluez la page sauf cas provisoire." }
        : { hint: "Incluse", nextStep: "OK." }),
    },
    {
      label: "Image de partage",
      status: socialImageStatus,
      ...(socialImageStatus === "error"
        ? {
            hint: "Aucune image",
            nextStep: "Ajoutez une image produit, puis choisissez une image de partage.",
          }
        : socialImageStatus === "warn"
          ? { hint: "Image produit", nextStep: "Optionnel : choisissez une image dédiée." }
          : { hint: "Dédiée", nextStep: "OK." }),
    },
    {
      label: "URL canonique",
      status: canonicalStatus,
      ...(canonicalStatus === "warn"
        ? {
            hint: "Personnalisée",
            nextStep: "Ne remplissez que si ce produit a plusieurs URLs publiques.",
          }
        : { hint: "Standard", nextStep: "OK." }),
    },
    {
      label: "Textes réseaux",
      status: socialOverridesStatus,
      ...(socialOverridesStatus === "warn"
        ? { hint: "Par défaut", nextStep: "Optionnel : adaptez le ton pour le partage." }
        : { hint: "Personnalisés", nextStep: "OK." }),
    },
  ];

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <input type="hidden" name="productId" value={product.product.id} />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <div className="w-full space-y-6 px-4 py-4 md:space-y-8 md:px-6 md:py-6 lg:mx-auto lg:max-w-4xl lg:px-5 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:py-3">
          <AdminFormMessage
            tone={state.status === "success" ? "success" : "error"}
            message={state.status !== "idle" ? state.message : null}
          />

          <div className="grid gap-3">
            <SeoChecklist items={checklistItems} />
            <SeoNextSteps items={checklistItems} />
          </div>

          <AdminFormSection
            title="Référencement Google"
            description="Ces informations apparaissent dans les résultats Google. Elles sont pré-remplies depuis votre produit — vous pouvez les personnaliser."
          >
            {/* Mobile: stack. lg+: preview left, fields right */}
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0 lg:items-start">
              <SerpPreview title={titleValue} url={previewUrl} description={descValue} />

              <div className="space-y-4">
                <AdminFormField
                  label="Titre SEO"
                  htmlFor="seo-title"
                  error={state.fieldErrors.title}
                >
                  <div className="space-y-1.5">
                    <Input
                      id="seo-title"
                      name="title"
                      value={titleValue}
                      onChange={(e) => setTitleValue(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex items-center justify-between gap-3">
                      {!hasSavedTitle ? (
                        <button
                          type="button"
                          onClick={() =>
                            setTitleValue(buildSeoTitleTemplate(product.product.name, SITE_NAME))
                          }
                          className="text-[11px] text-muted-foreground underline-offset-2 hover:underline hover:text-foreground transition-colors"
                        >
                          ← Pré-remplir
                        </button>
                      ) : (
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {titleStatus === "error"
                            ? "Conseil : ajoutez 1 détail utile (matière, usage, gamme)."
                            : titleStatus === "warn"
                              ? "Conseil : retirez le superflu (gardez produit + 1 bénéfice)."
                              : "Conseil : nom clair, sans jargon."
                          }
                        </p>
                      )}
                      <AdminCharCounter
                        value={titleValue}
                        min={SEO_TITLE_MIN}
                        max={SEO_TITLE_RECOMMENDED}
                      />
                    </div>
                  </div>
                </AdminFormField>

                <AdminFormField
                  label="Description SEO"
                  htmlFor="seo-description"
                  error={state.fieldErrors.description}
                >
                  <div className="space-y-1.5">
                    <Textarea
                      id="seo-description"
                      name="description"
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                      className="min-h-24 resize-y text-sm leading-relaxed"
                    />
                    <div className="flex items-center justify-between gap-3">
                      {!hasSavedDesc ? (
                        <button
                          type="button"
                          onClick={() =>
                            setDescValue(
                              buildSeoDescTemplate(
                                product.product.shortDescription,
                                product.product.description
                              )
                            )
                          }
                          className="text-[11px] text-muted-foreground underline-offset-2 hover:underline hover:text-foreground transition-colors"
                        >
                          ← Pré-remplir
                        </button>
                      ) : (
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {descStatus === "error"
                            ? "Conseil : 1 phrase = ce que c'est + pour qui + bénéfice."
                            : descStatus === "warn"
                              ? "Conseil : gardez l'essentiel, supprimez les détails secondaires."
                              : "Conseil : phrase simple, lisible, sans listes."
                          }
                        </p>
                      )}
                      <AdminCharCounter
                        value={descValue}
                        min={SEO_DESC_MIN}
                        max={SEO_DESC_RECOMMENDED}
                      />
                    </div>
                  </div>
                </AdminFormField>

                <AdminFormField
                  label="Adresse de la page (URL canonique)"
                  htmlFor="seo-canonical-path"
                  error={state.fieldErrors.canonicalPath}
                >
                  <div className="space-y-1.5">
                    <Input
                      id="seo-canonical-path"
                      name="canonicalPath"
                      defaultValue={product.seo.canonicalPath ?? ""}
                      placeholder={product.seo.fallbackCanonicalPath}
                      className="text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Laissez vide pour utiliser l'adresse standard :{" "}
                      <span className="font-mono text-[10px]">
                        {product.seo.fallbackCanonicalPath}
                      </span>
                      . Ne remplissez ce champ que si ce produit est accessible depuis plusieurs
                      adresses différentes.
                    </p>
                  </div>
                </AdminFormField>

                <div className="space-y-4">
                  <AdminFormField
                    label="Visibilité Google"
                    htmlFor="seo-indexing-mode"
                    error={state.fieldErrors.indexingMode}
                  >
                    <div className="space-y-1.5">
                      <Select name="indexingMode" defaultValue={product.seo.indexingMode}>
                        <SelectTrigger id="seo-indexing-mode" className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INDEX_FOLLOW">
                            Visible sur Google — liens suivis
                          </SelectItem>
                          <SelectItem value="INDEX_NOFOLLOW">
                            Visible sur Google — liens non suivis
                          </SelectItem>
                          <SelectItem value="NOINDEX_FOLLOW">
                            Masqué sur Google — liens suivis
                          </SelectItem>
                          <SelectItem value="NOINDEX_NOFOLLOW">
                            Masqué sur Google — liens non suivis
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        Choisissez si cette page peut apparaître dans les résultats de recherche.
                        Laissez sur "Visible" sauf cas particulier.
                      </p>
                      {indexingStatus === "error" ? (
                        <p className="rounded-lg border border-feedback-warning-border bg-feedback-warning-surface px-3 py-2 text-[11px] leading-snug text-feedback-warning-foreground">
                          Cette page est actuellement masquée aux moteurs. Remettez sur “Visible”
                          si vous voulez qu’elle apparaisse sur Google.
                        </p>
                      ) : null}
                    </div>
                  </AdminFormField>

                  <AdminFormField
                    label="Plan du site (Sitemap)"
                    htmlFor="seo-sitemap-included"
                    error={state.fieldErrors.sitemapIncluded}
                  >
                    <div className="space-y-1.5">
                      <Select
                        name="sitemapIncluded"
                        defaultValue={product.seo.sitemapIncluded ? "true" : "false"}
                      >
                        <SelectTrigger id="seo-sitemap-included" className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Inclus dans le plan du site</SelectItem>
                          <SelectItem value="false">Exclu du plan du site</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        Le plan du site aide Google à découvrir vos pages. Incluez cette page sauf
                        si elle est masquée ou provisoire.
                      </p>
                      {sitemapStatus === "error" ? (
                        <p className="rounded-lg border border-feedback-warning-border bg-feedback-warning-surface px-3 py-2 text-[11px] leading-snug text-feedback-warning-foreground">
                          Cette page est exclue du plan du site. Gardez “Inclus” sauf cas
                          provisoire.
                        </p>
                      ) : null}
                    </div>
                  </AdminFormField>
                </div>
              </div>
            </div>
          </AdminFormSection>

          {/* Social sharing — single merged section, collapsible overrides */}
          <AdminFormSection
            title="Réseaux sociaux"
            description="Par défaut, votre titre et description Google sont utilisés lors du partage. Vous pouvez les personnaliser si nécessaire."
          >
            {/* Mobile: stack. lg+: preview capped left, controls right */}
            <div className="space-y-4 lg:grid lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-8 lg:space-y-0 lg:items-start">
              <SocialPreview
                title={effectiveSocialTitle}
                description={effectiveSocialDesc}
                imageUrl={socialImageUrl}
              />

              <div className="space-y-3">
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Vous pouvez reprendre les textes Google tels quels ou les adapter pour le partage
                  sur les réseaux — c'est optionnel.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSocialFields((v) => !v)}
                  className="text-xs text-muted-foreground underline-offset-2 hover:underline hover:text-foreground transition-colors"
                >
                  {showSocialFields
                    ? "Masquer les champs de personnalisation"
                    : "Personnaliser le titre et la description"}
                </button>

                {showSocialFields ? (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Facebook, LinkedIn et autres réseaux
                    </p>
                    <AdminFormField
                      label="Titre de partage"
                      htmlFor="seo-og-title"
                      error={state.fieldErrors.openGraphTitle}
                    >
                      <Input
                        id="seo-og-title"
                        name="openGraphTitle"
                        defaultValue={product.seo.openGraphTitle}
                        placeholder={product.seo.fallbackOpenGraphTitle}
                        className="text-sm"
                      />
                    </AdminFormField>

                    <AdminFormField
                      label="Description de partage"
                      htmlFor="seo-og-description"
                      error={state.fieldErrors.openGraphDescription}
                    >
                      <Input
                        id="seo-og-description"
                        name="openGraphDescription"
                        defaultValue={product.seo.openGraphDescription}
                        placeholder={fallbackOpenGraphDescriptionPlain}
                        className="text-sm"
                      />
                    </AdminFormField>

                    <p className="text-xs text-muted-foreground pt-2">X (anciennement Twitter)</p>

                    <AdminFormField
                      label="Titre X"
                      htmlFor="seo-twitter-title"
                      error={state.fieldErrors.twitterTitle}
                    >
                      <Input
                        id="seo-twitter-title"
                        name="twitterTitle"
                        defaultValue={product.seo.twitterTitle ?? ""}
                        placeholder={product.seo.fallbackOpenGraphTitle}
                        className="text-sm"
                      />
                    </AdminFormField>

                    <AdminFormField
                      label="Description X"
                      htmlFor="seo-twitter-description"
                      error={state.fieldErrors.twitterDescription}
                    >
                      <Input
                        id="seo-twitter-description"
                        name="twitterDescription"
                        defaultValue={product.seo.twitterDescription ?? ""}
                        placeholder={fallbackOpenGraphDescriptionPlain}
                        className="text-sm"
                      />
                    </AdminFormField>
                  </div>
                ) : (
                  /* When collapsed: preserve saved values in hidden inputs so they are not lost on save */
                  <>
                    <input type="hidden" name="openGraphTitle" value={product.seo.openGraphTitle} />
                    <input
                      type="hidden"
                      name="openGraphDescription"
                      value={product.seo.openGraphDescription}
                    />
                    <input
                      type="hidden"
                      name="twitterTitle"
                      value={product.seo.twitterTitle ?? ""}
                    />
                    <input
                      type="hidden"
                      name="twitterDescription"
                      value={product.seo.twitterDescription ?? ""}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Social image — single ID drives both OG and Twitter fields */}
            <input type="hidden" name="openGraphImageId" value={socialImageId ?? ""} />
            <input type="hidden" name="twitterImageId" value={socialImageId ?? ""} />

            {/* Social image picker */}
            <div className="space-y-3 border-t border-border/40 pt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Image de partage
                </p>
                <div className="flex items-center gap-3">
                  {socialImageId !== null ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSocialImageId(null);
                        setShowSocialImagePicker(false);
                      }}
                      className="text-[11px] text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                    >
                      Supprimer
                    </button>
                  ) : null}
                  {productOnlyImages.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setShowSocialImagePicker((v) => !v)}
                      className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                    >
                      {showSocialImagePicker
                        ? "Fermer"
                        : socialImageId !== null
                          ? "Modifier"
                          : "Choisir une image dédiée"}
                    </button>
                  ) : null}
                </div>
              </div>

              {socialImageId === null ? (
                <p className="text-[11px] leading-snug text-muted-foreground">
                  {product.product.primaryImageUrl
                    ? "L'image principale du produit sera utilisée pour le partage sur les réseaux sociaux."
                    : "Aucune image produit disponible. Ajoutez une image dans l'onglet Images."}
                </p>
              ) : null}

              {showSocialImagePicker && productOnlyImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {productOnlyImages.map((img) => {
                    const selected = img.mediaAssetId === socialImageId;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        title={img.originalName ?? img.altText ?? "Image produit"}
                        onClick={() => {
                          setSocialImageId(img.mediaAssetId);
                          setShowSocialImagePicker(false);
                        }}
                        className={[
                          "relative aspect-square overflow-hidden rounded-lg border transition-all",
                          selected
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-foreground/30",
                        ].join(" ")}
                      >
                        {img.publicUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img.publicUrl}
                            alt={img.altText ?? "Image produit"}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted text-[10px] text-muted-foreground">
                            Indisponible
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </AdminFormSection>
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end"
        className={[
          "bottom-[calc(3.5rem+env(safe-area-inset-bottom))]",
          "[@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom))]",
          "lg:bottom-0",
        ].join(" ")}
        overlay
      >
        <Button
          variant="ghost"
          type="button"
          size="xs"
          className="h-8 rounded-full px-4 text-muted-foreground hover:text-foreground lg:h-9"
          onClick={onReset}
        >
          Réinitialiser
        </Button>

        <Button
          type="submit"
          variant="outline"
          size="xs"
          className="h-8 w-fit rounded-full border-border px-4 text-foreground shadow-none sm:flex-none lg:h-9"
          disabled={pending}
        >
          {pending ? "Mise à jour…" : "Enregistrer"}
        </Button>
      </AdminFormFooter>
    </form>
  );
}

export function ProductSeoTab(props: ProductSeoTabProps): JSX.Element {
  const [manualResetKey, setManualResetKey] = useState(0);
  const { seo } = props.product;
  const serverDataKey = JSON.stringify({
    title: seo.title,
    description: seo.description,
    canonicalPath: seo.canonicalPath,
    indexingMode: seo.indexingMode,
    sitemapIncluded: seo.sitemapIncluded,
    openGraphTitle: seo.openGraphTitle,
    openGraphDescription: seo.openGraphDescription,
    openGraphImageId: seo.openGraphImageId,
    twitterTitle: seo.twitterTitle,
    twitterDescription: seo.twitterDescription,
    twitterImageId: seo.twitterImageId,
  });

  return (
    <ProductSeoTabInner
      key={`${manualResetKey}-${serverDataKey}`}
      {...props}
      onReset={() => setManualResetKey((current) => current + 1)}
    />
  );
}
