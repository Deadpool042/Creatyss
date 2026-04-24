/**
 * Template de présentation partagé — fiche produit.
 *
 * Orchestrateur des blocs partagés : hero → description → offres → produits liés.
 * Utilisé par la page storefront (app/boutique/[slug]/page.tsx) et
 * la page preview admin (app/admin/.../products/[slug]/preview/page.tsx).
 *
 * Ce composant est de présentation pure : il reçoit des données normalisées
 * et des injections contextuelles (CTA, bandeau statut) — il ne fait pas de fetch.
 *
 * Lot : PAGE-SHARED-1
 */
import React from "react";

import { getUploadsPublicPath } from "@/core/uploads";
import { getProductOfferSectionPresentation } from "@/entities/product/product-public-presentation";

import { ProductDescriptionSection } from "./product-description-section";
import { ProductHeroSection } from "./product-hero-section";
import { ProductOffersSection, type OfferVariant } from "./product-offers-section";
import { ProductPreHeaderSection } from "./product-preheader-section";
import { ProductRelatedSection } from "./product-related-section";

// ---------------------------------------------------------------------------
// Types de présentation locaux — découplés des types de query et Prisma
// ---------------------------------------------------------------------------

type ProductPageImage = {
  src: string;
  alt: string | null;
};

type ProductPageRelatedProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  imageFilePath: string | null;
  imageAltText: string | null;
};

type ProductPageRelatedGroup = {
  type: "related" | "cross_sell" | "up_sell" | "accessory" | "similar";
  label: string;
  products: ProductPageRelatedProduct[];
};

export type ProductPageTemplateProps = {
  // Données produit normalisées
  productName: string;
  marketingHook?: string | null;
  shortDescription?: string | null;
  /**
   * Description rich-text (HTML) issue de l'admin.
   *
   * Contrat: la valeur est sanitizée/normalisée côté domaine à l'écriture
   * (validateAdminProductInput) avant d'être stockée/relue.
   * Le template peut donc l'injecter via dangerouslySetInnerHTML.
   */
  description?: string | null;
  productType: "simple" | "variable";
  isAvailable: boolean;
  images: ProductPageImage[];
  variants: OfferVariant[];
  /**
   * Caractéristiques produit structurées (matière, dimensions, etc.).
   * Non affichées si absent ou vide.
   */
  characteristics?: { id: string; label: string; value: string }[];
  /**
   * Spécifications techniques (SKU, code-barres, poids, dimensions, etc.).
   * Séparées des caractéristiques éditoriales.
   */
  technicalSpecs?: { label: string; value: string }[];
  /**
   * Groupes de produits liés.
   * Compatible structurellement avec CatalogRelatedProductGroup[] (storefront)
   * et AdminProductPreviewRelatedProductGroup[] (admin) — TypeScript structural typing.
   * imageFilePath contient un storageKey brut ; l'URL est résolue en interne via
   * getUploadsPublicPath().
   */
  relatedProductGroups: ProductPageRelatedGroup[];
  // ---------------------------------------------------------------------------
  // Injections contextuelles
  // ---------------------------------------------------------------------------
  /**
   * Bandeau rendu avant le hero.
   * Storefront : messages panier (succès + erreur).
   * Admin    : notice de statut du produit (brouillon / inactif / archivé).
   */
  statusBanner?: React.ReactNode;
  /**
   * CTA rendu dans l'aside du hero (conditionnel selon disponibilité).
   * Storefront : form addToCart complet.
   * Admin    : bouton disabled « disponible en boutique ».
   */
  heroCta?: React.ReactNode;
  /**
   * Résumé des déclinaisons pour les produits variables (storefront uniquement en V1).
   * Exemple: "4 déclinaisons · 3 disponibles".
   */
  heroVariantSummary?: { total: number; available: number } | null;
  /**
   * Contenu additionnel en bas de l'aside du hero.
   * Admin : bloc « Référence de page » (slug).
   * Storefront : absent.
   */
  heroAsideExtra?: React.ReactNode;
  /**
   * Contenu de résumé rendu avant la grille de variants (produits variables uniquement).
   * Admin : badges nb déclinaisons / nb disponibles.
   * Storefront : absent.
   */
  offersSummaryContent?: React.ReactNode;
  /**
   * Render prop pour le CTA de chaque carte variant.
   * Storefront : message de disponibilité + form addToCart.
   * Admin    : bouton disabled.
   */
  renderVariantCta?: (variant: OfferVariant) => React.ReactNode;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductPageTemplate({
  productName,
  marketingHook,
  shortDescription,
  description,
  productType,
  isAvailable,
  images,
  variants,
  characteristics,
  technicalSpecs,
  relatedProductGroups,
  statusBanner,
  heroCta,
  heroVariantSummary,
  heroAsideExtra,
  offersSummaryContent,
  renderVariantCta,
}: ProductPageTemplateProps) {
  const uploadsPublicPath = getUploadsPublicPath();
  const isSimpleProduct = productType === "simple";
  const isVariableProduct = !isSimpleProduct;
  const singleOffer = isSimpleProduct && variants.length === 1 ? variants[0] : null;
  const heroVariant = singleOffer ?? variants[0] ?? null;
  const offerSectionPresentation = getProductOfferSectionPresentation(productType);
  const hasRelatedProducts = relatedProductGroups.some((g) => g.products.length > 0);
  const resolvedTechnicalSpecs = technicalSpecs ?? [];
  const hasTechnicalSpecs = resolvedTechnicalSpecs.length > 0;

  return (
    <div className="mx-auto max-w-6xl pb-6">
      {/* Bandeau contextuel (statut admin / messages panier storefront) */}
      {statusBanner}

      <div className="grid gap-4 min-[700px]:gap-6">
        {/* ------------------------------------------------------------------ */}
        {/* Pré-header éditorial — badge, nom, accroche courte                  */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid gap-3 min-[700px]:gap-4">
          <ProductPreHeaderSection
            productName={productName}
            isSimpleProduct={isSimpleProduct}
            marketingHook={marketingHook ?? null}
          />

          {/* ---------------------------------------------------------------- */}
          {/* Hero — grid image / aside transactionnel                         */}
          {/* ---------------------------------------------------------------- */}
          <ProductHeroSection
            productName={productName}
            isSimpleProduct={isSimpleProduct}
            isAvailable={isAvailable}
            images={images}
            shortDescription={shortDescription ?? null}
            heroVariant={heroVariant}
            variantSummary={!isSimpleProduct ? (heroVariantSummary ?? null) : null}
            variablePriceLabel={!isSimpleProduct ? "Prix (selon déclinaison)" : null}
            imageFit={!isSimpleProduct ? "cover" : "contain"}
            singleVariantSku={singleOffer?.sku ?? null}
            cta={heroCta}
            asideExtra={heroAsideExtra}
          />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Déclinaisons — point de décision prioritaire (variable uniquement)  */}
        {/* ------------------------------------------------------------------ */}
        {isVariableProduct ? (
          <ProductOffersSection
            id="offers"
            productType={productType}
            variants={variants}
            presentation={offerSectionPresentation}
            summaryContent={offersSummaryContent}
            renderVariantCta={renderVariantCta}
          />
        ) : null}

        {/* ------------------------------------------------------------------ */}
        {/* Description — section dédiée sous le hero                           */}
        {/* ------------------------------------------------------------------ */}
        {description ? <ProductDescriptionSection descriptionHtml={description} /> : null}
      </div>

      <div className="mt-6 grid gap-6 min-[700px]:mt-8 min-[700px]:gap-8">
        {/* ------------------------------------------------------------------ */}
        {/* Caractéristiques produit                                             */}
        {/* ------------------------------------------------------------------ */}
        {characteristics && characteristics.length > 0 ? (
          <section className="w-full rounded-xl border border-shell-border bg-surface-panel-soft p-5 shadow-soft [@media(max-height:480px)]:p-4 min-[700px]:p-8">
            <div className="mb-5 grid gap-2 min-[700px]:mb-6">
              <p className="text-eyebrow text-brand">Caractéristiques</p>
              <h2 className="text-title-section">Détails du produit</h2>
            </div>
            <dl className="grid gap-2.5 min-[700px]:gap-3 min-[900px]:grid-cols-2">
              {characteristics.map((c) => (
                <div
                  key={c.id}
                  className="grid gap-1.5 rounded-lg border border-surface-border-subtle bg-surface-panel px-3.5 py-3 min-[700px]:px-4"
                >
                  <dt className="m-0 text-meta-label text-text-muted-soft">{c.label}</dt>
                  <dd className="m-0 wrap-break-word text-secondary-copy reading-compact text-foreground">
                    {c.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {/* ------------------------------------------------------------------ */}
        {/* Spécifications techniques                                           */}
        {/* ------------------------------------------------------------------ */}
        {hasTechnicalSpecs ? (
          <section className="w-full rounded-xl border border-shell-border bg-surface-panel-soft p-5 shadow-soft [@media(max-height:480px)]:p-4 min-[700px]:p-8">
            <div className="mb-5 grid gap-2 min-[700px]:mb-6">
              <p className="text-eyebrow text-brand">Spécifications</p>
              <h2 className="m-0 text-title-section">Spécifications techniques</h2>
            </div>
            <dl className="grid gap-2.5 min-[700px]:gap-3 min-[900px]:grid-cols-2">
              {resolvedTechnicalSpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid gap-1.5 rounded-lg border border-surface-border-subtle bg-surface-panel px-3.5 py-3 min-[700px]:px-4"
                >
                  <dt className="m-0 text-meta-label text-text-muted-soft">{spec.label}</dt>
                  <dd className="m-0 wrap-break-word text-secondary-copy reading-compact text-foreground">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {/* ------------------------------------------------------------------ */}
        {/* Offre / déclinaisons                                                */}
        {/* ------------------------------------------------------------------ */}
        {isSimpleProduct ? (
          <ProductOffersSection
            id="offers"
            productType={productType}
            variants={variants}
            presentation={offerSectionPresentation}
            summaryContent={offersSummaryContent}
            renderVariantCta={renderVariantCta}
          />
        ) : null}

        {/* ------------------------------------------------------------------ */}
        {/* Produits liés                                                        */}
        {/* ------------------------------------------------------------------ */}
        {hasRelatedProducts ? (
          <section className="w-full rounded-xl border border-shell-border bg-surface-panel-soft p-5 shadow-soft [@media(max-height:480px)]:p-4 min-[700px]:p-8">
            <div className="mb-5 grid gap-2 min-[700px]:mb-6">
              <p className="text-eyebrow text-brand">Produits liés</p>
              <h2 className="m-0 text-title-section">Produits associés</h2>
            </div>
            <ProductRelatedSection
              groups={relatedProductGroups}
              uploadsPublicPath={uploadsPublicPath}
            />
          </section>
        ) : null}
      </div>
    </div>
  );
}
