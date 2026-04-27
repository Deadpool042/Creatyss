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

import { Gem, MapPin, ShieldCheck } from "lucide-react";

import { getUploadsPublicPath } from "@/core/uploads";
import { getProductOfferSectionPresentation } from "@/entities/product/product-public-presentation";

import { ProductDescriptionSection } from "./product-description-section";
import { ProductEditorialSection } from "./product-editorial-section";
import { ProductHeroSection } from "./product-hero-section";
import { ProductOffersSection, type OfferVariant } from "./product-offers-section";
// import { ProductPreHeaderSection } from "./product-preheader-section";
import { ProductRelatedSection } from "./product-related-section";

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
  productName: string;
  marketingHook?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  productType: "simple" | "variable";
  isAvailable: boolean;
  images: ProductPageImage[];
  variants: OfferVariant[];
  characteristics?: { id: string; label: string; value: string }[];
  technicalSpecs?: { label: string; value: string }[];
  relatedProductGroups: ProductPageRelatedGroup[];
  statusBanner?: React.ReactNode;
  heroCta?: React.ReactNode;
  heroVariantSummary?: { total: number; available: number } | null;
  heroAsideExtra?: React.ReactNode;
  offersSummaryContent?: React.ReactNode;
  renderVariantCta?: (variant: OfferVariant) => React.ReactNode;
};

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
  const singleOffer = isSimpleProduct && variants.length === 1 ? (variants[0] ?? null) : null;
  const offerSectionPresentation = getProductOfferSectionPresentation(productType);
  const hasRelatedProducts = relatedProductGroups.some((g) => g.products.length > 0);
  const resolvedTechnicalSpecs = technicalSpecs ?? [];
  const hasTechnicalSpecs = resolvedTechnicalSpecs.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl pb-8 min-[700px]:pb-10 min-[1200px]:pb-12">
      {statusBanner}

      <div className="grid gap-5 min-[700px]:gap-7 min-[1200px]:gap-8">
        <div className="grid gap-4 min-[700px]:gap-5 min-[1200px]:gap-6">
          <ProductHeroSection
            productName={productName}
            marketingHook={marketingHook ?? null}
            isSimpleProduct={isSimpleProduct}
            isAvailable={isAvailable}
            images={images}
            shortDescription={shortDescription ?? null}
            heroVariant={singleOffer ?? null}
            variableVariants={!isSimpleProduct ? variants : undefined}
            variantSummary={!isSimpleProduct ? (heroVariantSummary ?? null) : null}
            variablePriceLabel={!isSimpleProduct ? "Prix (selon déclinaison)" : null}
            singleVariantSku={singleOffer?.sku ?? null}
            cta={heroCta}
            asideExtra={heroAsideExtra}
          />

          <div className="flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-shell-border/60 px-6 py-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-foreground/50" aria-hidden="true" />
              <span className="text-micro-copy text-foreground-muted">Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-foreground/50" aria-hidden="true" />
              <span className="text-micro-copy text-foreground-muted">Fabrication locale</span>
            </div>
            <div className="flex items-center gap-2">
              <Gem className="size-4 shrink-0 text-foreground/50" aria-hidden="true" />
              <span className="text-micro-copy text-foreground-muted">Pièces uniques</span>
            </div>
          </div>
        </div>

        {isVariableProduct ? (
          <ProductOffersSection
            id="offers"
            productType={productType}
            variants={variants}
            presentation={offerSectionPresentation}
            summaryContent={offersSummaryContent}
            {...(renderVariantCta ? { renderVariantCta } : {})}
          />
        ) : null}

        {description ? <ProductDescriptionSection descriptionHtml={description} /> : null}
      </div>

      <ProductEditorialSection />

      <div className="mt-8 grid gap-7 min-[700px]:mt-10 min-[700px]:gap-9 min-[1200px]:mt-12 min-[1200px]:gap-10">
        {characteristics && characteristics.length > 0 ? (
          <section className="w-full">
            <div className="mb-6 grid gap-2.5 min-[700px]:mb-7">
              <p className="text-eyebrow text-brand">Caractéristiques</p>
              <h2 className="text-title-section">Détails du produit</h2>
            </div>
            <dl className="grid gap-3 border-t border-surface-border-subtle/70 pt-4 min-[700px]:gap-3.5 min-[700px]:pt-5 min-[900px]:grid-cols-2">
              {characteristics.map((c) => (
                <div
                  key={c.id}
                  className="grid gap-1.5 rounded-lg border border-surface-border-subtle/75 bg-surface-panel/50 px-3.5 py-3.5 shadow-inset-soft min-[700px]:gap-2 min-[700px]:px-4"
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

        {hasTechnicalSpecs ? (
          <section className="w-full">
            <div className="mb-6 grid gap-2.5 min-[700px]:mb-7">
              <p className="text-eyebrow text-brand">Spécifications</p>
              <h2 className="m-0 text-title-section">Spécifications techniques</h2>
            </div>
            <dl className="grid gap-3 border-t border-surface-border-subtle/70 pt-4 min-[700px]:gap-3.5 min-[700px]:pt-5 min-[900px]:grid-cols-2">
              {resolvedTechnicalSpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid gap-1.5 rounded-lg border border-surface-border-subtle/75 bg-surface-panel/50 px-3.5 py-3.5 shadow-inset-soft min-[700px]:gap-2 min-[700px]:px-4"
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

        {isSimpleProduct ? (
          <ProductOffersSection
            id="offers"
            productType={productType}
            variants={variants}
            presentation={offerSectionPresentation}
            summaryContent={offersSummaryContent}
            {...(renderVariantCta ? { renderVariantCta } : {})}
          />
        ) : null}

        {hasRelatedProducts ? (
          <section className="w-full rounded-xl border border-shell-border/80 bg-linear-to-b from-surface-panel-soft/84 to-surface-subtle/56 p-5 shadow-soft [@media(max-height:480px)]:p-4 min-[700px]:p-8">
            <div className="mb-6 grid gap-2.5 min-[700px]:mb-7">
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
