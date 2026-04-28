/**
 * Template de présentation partagé — fiche produit.
 *
 * Orchestrateur des blocs partagés : hero → informations produit → offres → produits liés.
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
import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";

import { ProductRelatedSection } from "./sections/product-related-section";
import { ProductHeroSection } from "./hero/product-hero-section";
import { ProductEditorialSection } from "./sections/product-editorial-section";
import { ProductInfoAccordionSection } from "./sections/product-info-accordion-section";
import { ProductTrust } from "./shared/product-trust";

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

function normalizeCharacteristicLabel(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function isCareCharacteristicLabel(label: string): boolean {
  const normalizedLabel = normalizeCharacteristicLabel(label);
  return normalizedLabel === "entretien" || normalizedLabel === "conseils d entretien";
}

export type ProductPageTemplateProps = {
  productName: string;
  productSlug?: string;
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
  disableCart?: boolean;
};

export function ProductPageTemplate({
  productName,
  productSlug = "",
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
  disableCart,
}: ProductPageTemplateProps) {
  const uploadsPublicPath = getUploadsPublicPath();
  const isSimpleProduct = productType === "simple";
  const singleOffer = isSimpleProduct && variants.length === 1 ? (variants[0] ?? null) : null;
  const hasRelatedProducts = relatedProductGroups.some((g) => g.products.length > 0);
  const resolvedTechnicalSpecs = technicalSpecs ?? [];
  const hasTechnicalSpecs = resolvedTechnicalSpecs.length > 0;
  const detailsDescriptionHtml = description?.trim() ? description : null;
  const careCharacteristicValue =
    characteristics
      ?.find(
        (characteristic) =>
          isCareCharacteristicLabel(characteristic.label) && characteristic.value.trim().length > 0
      )
      ?.value.trim() ?? null;

  return (
    <div className="mx-auto w-full max-w-6xl pb-8 min-[700px]:pb-10 min-[1200px]:pb-12">
      {statusBanner}

      <div className="grid  gap-5 min-[700px]:gap-7 min-[1200px]:gap-8">
        <ProductHeroSection
          productName={productName}
          productSlug={productSlug}
          marketingHook={marketingHook ?? null}
          isSimpleProduct={isSimpleProduct}
          isAvailable={isAvailable}
          images={images}
          shortDescription={shortDescription ?? null}
          heroVariant={singleOffer ?? null}
          variableVariants={!isSimpleProduct ? variants : undefined}
          variantSummary={!isSimpleProduct ? (heroVariantSummary ?? null) : null}
          variablePriceLabel={!isSimpleProduct ? "Prix (selon déclinaison)" : null}
          cta={heroCta}
          asideExtra={heroAsideExtra}
          {...(disableCart !== undefined ? { disableCart } : {})}
        />

        {/* Zone informations produit */}
        <div className="grid px-4 grid-cols-1 gap-5 min-[700px]:grid-cols-[5fr_7fr] min-[700px]:gap-7 min-[1200px]:gap-8">
          <ProductInfoAccordionSection
            detailsContent={
              detailsDescriptionHtml ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-[68ch] text-foreground min-[900px]:prose-base [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                  // Le contrat existant côté produit/admin est que `description`
                  // a déjà été normalisée en amont avant affichage storefront.
                  dangerouslySetInnerHTML={{ __html: detailsDescriptionHtml }}
                />
              ) : undefined
            }
            careContent={careCharacteristicValue ? <p>{careCharacteristicValue}</p> : undefined}
          />
          <ProductEditorialSection />
        </div>

        <div className="block min-[700px]:hidden">
          <ProductTrust />
        </div>
      </div>

      <div className="mt-8  grid gap-5 min-[700px]:mt-10 min-[700px]:gap-7 min-[1200px]:mt-12 min-[1200px]:gap-8">
        {characteristics && characteristics.length > 0 ? (
          <section className="w-full px-4 border-t border-shell-border/80  pt-5 min-[700px]:pt-6">
            <div className="mb-6 grid gap-2.5 min-[700px]:mb-7">
              <p className="text-eyebrow text-brand">Caractéristiques</p>
              <h2 className="text-title-section">Caractéristiques du produit</h2>
              <p className="m-0 text-secondary-copy text-foreground-muted">
                Attributs factuels renseignés pour ce produit.
              </p>
            </div>
            <dl className="grid gap-3  pt-4 min-[700px]:gap-3.5 min-[700px]:pt-5 min-[900px]:grid-cols-2">
              {characteristics.map((c) => (
                <div
                  key={c.id}
                  className="grid gap-1.5 rounded-xl border border-surface-border-subtle/75 bg-surface-panel/44 px-3.5 py-3.5 shadow-inset-soft min-[700px]:gap-2 min-[700px]:px-4"
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
          <section className="w-full px-4 border-t border-shell-border/80 pt-5 min-[700px]:pt-6">
            <div className="mb-6 grid gap-2.5 min-[700px]:mb-7">
              <p className="text-eyebrow text-brand">Spécifications</p>
              <h2 className="m-0 text-title-section">Spécifications techniques</h2>
              <p className="m-0 text-secondary-copy text-foreground-muted">
                Données techniques dérivées de la variante de référence.
              </p>
            </div>
            <dl className="border-t border-surface-border-subtle/70 pt-2 min-[700px]:pt-3">
              {resolvedTechnicalSpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid grid-cols-1 gap-1.5 border-b border-surface-border-subtle/60 px-1 py-3 min-[700px]:grid-cols-[minmax(0,1fr)_auto] min-[700px]:items-start min-[700px]:gap-4 min-[700px]:px-2 min-[700px]:py-3.5"
                >
                  <dt className="m-0 text-meta-label text-text-muted-soft">{spec.label}</dt>
                  <dd className="m-0 wrap-break-word text-secondary-copy reading-compact text-foreground min-[700px]:text-right min-[700px]:font-mono">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {hasRelatedProducts ? (
          <section className="w-full px-4 border-shell-border/80 pt-5 min-[700px]:pt-6">
            <div className="mb-6 grid gap-2.5 min-[700px]:mb-7">
              <p className="text-eyebrow text-brand">À découvrir</p>
              <h2 className="m-0 text-title-section">Vous aimerez aussi</h2>
            </div>
            <ProductRelatedSection
              groups={relatedProductGroups}
              uploadsPublicPath={uploadsPublicPath}
            />
          </section>
        ) : null}
      </div>

      <div className="hidden min-[700px]:block">
        <ProductTrust />
      </div>
    </div>
  );
}
