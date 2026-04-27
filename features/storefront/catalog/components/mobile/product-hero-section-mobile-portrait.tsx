// features/storefront/catalog/components/mobile/product-hero-section-mobile-portrait.tsx
"use client";

import Image from "next/image";

import { ProductHeroGalleryDots } from "../product-hero-gallery-dots";
import { ProductHeroHeader } from "../product-hero-header";
import {
  ProductHeroImageCounterOverlay,
  ProductHeroMediaEmptyState,
} from "../product-hero-media-elements";
import {
  ProductHeroAvailabilityMeta,
  ProductHeroPricingMeta,
} from "../product-hero-meta-blocks";
import type { ProductHeroResolvedProps } from "../product-hero-resolved-props";
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
  marketingHook,
  isSimpleProduct,
  shortDescription,
  resolvedHeroVariant,
  resolvedIsAvailable,
  resolvedSingleVariantSku,
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
  imageFit,
  cta,
  asideExtra,
}: ProductHeroResolvedProps) {
  const hasVisibleThumbnailRail = false;
  const shouldShowGalleryDots = !hasVisibleThumbnailRail && galleryImages.length > 1;

  return (
    <section className="w-full border-b border-shell-border">
      {/* --- Image full-bleed (mobile portrait) --- */}
      <div>
        {selectedImage ? (
          <>
            <div className="relative aspect-4/5 w-full">
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
            </div>

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
            <ProductHeroMediaEmptyState className="aspect-4/3 w-full rounded-3xl" />
          </div>
        )}
      </div>

      {/* --- Aside empilé (mobile portrait) --- */}
      <aside className="flex flex-col px-6 pb-7 pt-6 sm:px-7 sm:pt-7">
        <div className="flex flex-col gap-6">
          <ProductHeroHeader
            productName={productName}
            marketingHook={marketingHook}
            isSimpleProduct={isSimpleProduct}
            density="default"
          />

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
            resolvedIsAvailable={resolvedIsAvailable}
            resolvedSingleVariantSku={resolvedSingleVariantSku}
            density="default"
          />

          <div className="mt-auto grid gap-4">
            {cta ? (
              <div className="grid gap-2.5 border-t border-surface-border pt-6">{cta}</div>
            ) : null}
          </div>

          {shortDescription ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none border-t border-surface-border pt-4 text-foreground-muted [&_p]:my-0 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: shortDescription }}
            />
          ) : null}

          {!isSimpleProduct ? (
            <ProductHeroVariantSelector
              variableVariants={variableVariants}
              selectedVariableVariant={selectedVariableVariant}
              onSelectVariantId={onSelectVariantId}
            />
          ) : null}

          {asideExtra ? (
            <div className="border-t border-surface-border pt-5">{asideExtra}</div>
          ) : null}
        </div>
      </aside>
    </section>
  );
}
