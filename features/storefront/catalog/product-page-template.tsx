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
  description?: string | null;
  productType: "simple" | "variable";
  isAvailable: boolean;
  primaryImage: ProductPageImage | null;
  variants: OfferVariant[];
  /**
   * Caractéristiques produit structurées (matière, dimensions, etc.).
   * Non affichées si absent ou vide.
   */
  characteristics?: { id: string; label: string; value: string }[];
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
  primaryImage,
  variants,
  characteristics,
  relatedProductGroups,
  statusBanner,
  heroCta,
  heroAsideExtra,
  offersSummaryContent,
  renderVariantCta,
}: ProductPageTemplateProps) {
  const uploadsPublicPath = getUploadsPublicPath();
  const isSimpleProduct = productType === "simple";
  const singleOffer = isSimpleProduct && variants.length === 1 ? variants[0] : null;
  const heroVariant = singleOffer ?? variants[0] ?? null;
  const offerSectionPresentation = getProductOfferSectionPresentation(productType);
  const hasRelatedProducts = relatedProductGroups.some((g) => g.products.length > 0);

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
            shortDescription={shortDescription ?? null}
            primaryImage={primaryImage}
            heroVariant={heroVariant}
            singleVariantSku={singleOffer?.sku ?? null}
            cta={heroCta}
            asideExtra={heroAsideExtra}
          />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Description — section dédiée sous le hero                           */}
        {/* ------------------------------------------------------------------ */}
        {description ? <ProductDescriptionSection description={description} /> : null}
      </div>

      <div className="mt-6 grid gap-6 min-[700px]:mt-8 min-[700px]:gap-10">
        {/* ------------------------------------------------------------------ */}
        {/* Caractéristiques produit                                             */}
        {/* ------------------------------------------------------------------ */}
        {characteristics && characteristics.length > 0 ? (
          <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
            <div className="mb-6 grid gap-2">
              <p className="text-sm font-bold uppercase tracking-widest text-brand">
                Caractéristiques
              </p>
              <h2 className="m-0">Détails du produit</h2>
            </div>
            <dl className="divide-y divide-surface-border">
              {characteristics.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0"
                >
                  <dt className="shrink-0 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {c.label}
                  </dt>
                  <dd className="min-w-0 wrap-break-word text-sm text-foreground">{c.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {/* ------------------------------------------------------------------ */}
        {/* Offre / déclinaisons                                                */}
        {/* ------------------------------------------------------------------ */}
        <ProductOffersSection
          productType={productType}
          variants={variants}
          presentation={offerSectionPresentation}
          summaryContent={offersSummaryContent}
          renderVariantCta={renderVariantCta}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Produits liés                                                        */}
        {/* ------------------------------------------------------------------ */}
        {hasRelatedProducts ? (
          <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
            <div className="mb-8 grid gap-2">
              <p className="text-sm font-bold uppercase tracking-widest text-brand">
                Produits liés
              </p>
              <h2 className="m-0">Produits associés</h2>
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
