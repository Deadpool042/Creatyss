// features/storefront/catalog/components/mobile/product-hero-section-mobile-portrait.tsx
"use client";

import Image from "next/image";
import { CreditCard, MapPin, ShieldCheck, Sparkles } from "lucide-react";

import { ProductHeroGalleryDots } from "../product-hero-gallery-dots";
import { ProductHeroHeader } from "../product-hero-header";
import {
  ProductHeroImageCounterOverlay,
  ProductHeroMediaEmptyState,
} from "../product-hero-media-elements";
import { ProductHeroAvailabilityMeta, ProductHeroPricingMeta } from "../product-hero-meta-blocks";
import type { ProductHeroResolvedProps } from "../product-hero-resolved-props";
import { ProductHeroVariableCartForm } from "../product-hero-variable-cart-form";
import { ProductHeroVariantSelector } from "../product-hero-variant-selector";

/**
 * Layout mobile portrait du hero produit.
 *
 * Composant purement présentationnel : reçoit des props résolues,
 * aucune logique métier, aucun useState/useEffect.
 *
 * Image full-bleed 4/5, pas de thumbnails, aside empilé en dessous.
 */
export function ProductHeroSectionMobilePortrait({
  productName,
  productSlug,
  marketingHook,
  isSimpleProduct,
  shortDescription,
  resolvedHeroVariant,
  resolvedAvailabilityStatus,
  resolvedIsAvailable,
  variablePriceLabel,
  variableSummaryText,
  variableVariants,
  selectedVariableVariant,
  onSelectVariantId,
  galleryImages,
  activeImageIndex,
  selectedImage,
  isImageReady,
  onSelectImageIndex,
  onImageLoaded,
  onOpenLightbox,
  imageFit,
  cta,
  asideExtra,
  disableCart,
}: ProductHeroResolvedProps) {
  const hasVisibleThumbnailRail = false;
  const shouldShowGalleryDots = !hasVisibleThumbnailRail && galleryImages.length > 1;
  const shouldShowActionBlock = !isSimpleProduct || Boolean(cta);

  return (
    <section className="w-full border-b border-shell-border/80 pb-6">
      {/* --- Image full-bleed (mobile portrait) --- */}
      <div>
        {selectedImage ? (
          <>
            <button
              type="button"
              onClick={onOpenLightbox}
              aria-label="Ouvrir l'image en plein écran"
              className="relative aspect-4/5 h-[56vh] w-full overflow-hidden border border-hero-border text-left shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35"
            >
              <Image
                key={selectedImage.src}
                src={selectedImage.src}
                alt={selectedImage.alt ?? productName}
                width={1200}
                height={1500}
                loading="lazy"
                sizes="100vw"
                onLoadingComplete={() => onImageLoaded(selectedImage.src)}
                className={[
                  "h-full w-full object-center transition-opacity duration-300 motion-reduce:transition-none",
                  isImageReady ? "opacity-100" : "opacity-0",
                  imageFit === "cover" ? "object-cover" : "object-contain",
                ].join(" ")}
              />

              <ProductHeroImageCounterOverlay
                activeIndex={activeImageIndex}
                total={galleryImages.length}
                className="bottom-2.5 right-2.5 px-2.5 py-1"
              />
            </button>

            {shouldShowGalleryDots ? (
              <ProductHeroGalleryDots
                total={galleryImages.length}
                activeIndex={activeImageIndex}
                onSelect={onSelectImageIndex}
              />
            ) : null}
          </>
        ) : (
          <div className="p-6 sm:p-8">
            <ProductHeroMediaEmptyState className="aspect-4/3 w-full rounded-2xl" />
          </div>
        )}
      </div>

      {/* --- Aside empilé (mobile portrait) --- */}
      <aside className="flex flex-col px-5 pb-1 pt-5 sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-5">
          <section className="grid gap-4">
            <ProductHeroHeader
              productName={productName}
              marketingHook={marketingHook}
              isSimpleProduct={isSimpleProduct}
              density="default"
            />
            <div className="flex flex-wrap items-center gap-2 text-micro-copy text-foreground-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-3.5 text-brand/85" />
                <span>Fait main à Saint-Étienne</span>
              </span>
              <span className="rounded-full border border-surface-border-subtle px-2 py-0.5 text-[0.68rem] leading-5 text-foreground-muted">
                Pièces uniques ou petites séries
              </span>
            </div>
          </section>

          <section className="grid gap-4 border-t border-surface-border pt-4.5">
            {resolvedHeroVariant ? (
              <ProductHeroPricingMeta
                resolvedHeroVariant={resolvedHeroVariant}
                isSimpleProduct={isSimpleProduct}
                variablePriceLabel={variablePriceLabel}
                variableSummaryText={variableSummaryText}
                density="default"
              />
            ) : null}

            <ProductHeroAvailabilityMeta
              resolvedAvailabilityStatus={resolvedAvailabilityStatus}
              resolvedIsAvailable={resolvedIsAvailable}
              density="default"
            />
          </section>

          {shouldShowActionBlock ? (
            <section className="grid gap-4 border-t border-surface-border pt-5">
              {!isSimpleProduct ? (
                <ProductHeroVariantSelector
                  variableVariants={variableVariants}
                  selectedVariableVariant={selectedVariableVariant}
                  onSelectVariantId={onSelectVariantId}
                />
              ) : null}

              {cta ? (
                <div className="grid gap-2.5">{cta}</div>
              ) : variableVariants ? (
                <ProductHeroVariableCartForm
                  productSlug={productSlug}
                  selectedVariant={selectedVariableVariant}
                  disabled={disableCart}
                  layout="stacked"
                />
              ) : null}

              <div className="grid gap-3 border-t border-surface-border-subtle/80 pt-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] text-foreground-muted">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-control-border px-2 py-1">
                    <CreditCard aria-hidden="true" className="size-3.5" />
                    <span>CB</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-control-border px-2 py-1">
                    <span className="font-semibold tracking-tight">PayPal</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-control-border px-2 py-1">
                    <ShieldCheck aria-hidden="true" className="size-3.5" />
                    <span>Paiement sécurisé</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] text-foreground-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles aria-hidden="true" className="size-3.5 text-brand/85" />
                    <span>Fait main</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck aria-hidden="true" className="size-3.5 text-brand/85" />
                    <span>Pièce unique / petite série</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden="true" className="size-3.5 text-brand/85" />
                    <span>Atelier local</span>
                  </span>
                </div>
              </div>
            </section>
          ) : null}

          {shortDescription ? (
            <section className="grid gap-2 border-t border-surface-border pt-5">
              <p className="text-meta-label text-brand">Description</p>
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-text-muted-strong [&_p]:my-0 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
            </section>
          ) : null}

          {asideExtra ? (
            <div className="border-t border-surface-border pt-5">{asideExtra}</div>
          ) : null}
        </div>
      </aside>
    </section>
  );
}
