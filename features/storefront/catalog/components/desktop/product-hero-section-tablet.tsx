"use client";

import Image from "next/image";

import type { ProductHeroResolvedProps } from "../product-hero-resolved-props";
import { ProductHeroHeader } from "../product-hero-header";
import {
  ProductHeroImageCounterOverlay,
  ProductHeroMediaEmptyState,
} from "../product-hero-media-elements";
import {
  ProductHeroAvailabilityMeta,
  ProductHeroPricingMeta,
} from "../product-hero-meta-blocks";
import { HeroThumbnailButton } from "../product-hero-thumbnail-button";
import { ProductHeroVariantSelector } from "../product-hero-variant-selector";

/**
 * Layout tablette du hero produit.
 *
 * Composant purement présentationnel : reçoit des props résolues,
 * aucune logique métier, aucun useState/useEffect.
 */
export function ProductHeroSectionTablet({
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
  const hasVisibleThumbnailRail = galleryImages.length > 1;

  return (
    <section className="w-full">
      <div className="flex flex-row">
        {/* --- Media : thumbnails + image (tablet) --- */}
        <div className="min-w-0 flex-1 p-3 lg:p-4">
          {selectedImage ? (
            <div className="flex flex-col gap-3">
              <div className="relative mx-auto h-[56vh] max-h-128 w-full">
                <Image
                  key={selectedImage.src}
                  src={selectedImage.src}
                  alt={selectedImage.alt ?? productName}
                  width={1200}
                  height={1500}
                  loading="lazy"
                  sizes="(min-width: 1024px) 44vw, 56vw"
                  onLoadingComplete={() => onImageLoaded(selectedImage.src)}
                  className={[
                    "h-full w-full rounded-2xl border border-hero-border object-center shadow-raised transition-opacity duration-300 motion-reduce:transition-none",
                    isImageReady ? "opacity-100" : "opacity-0",
                    imageFit === "cover" ? "object-cover" : "object-contain",
                  ].join(" ")}
                />

                <ProductHeroImageCounterOverlay
                  activeIndex={activeImageIndex}
                  total={galleryImages.length}
                  className="bottom-3 right-3 px-2.5 py-1"
                />
              </div>

              {hasVisibleThumbnailRail ? (
                <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>button]:min-w-16 [&>button]:w-16 lg:[&>button]:min-w-18 lg:[&>button]:w-18">
                  {galleryImages.map((image, index) => (
                    <HeroThumbnailButton
                      key={`${image.src}-${index}`}
                      image={image}
                      index={index}
                      productName={productName}
                      isActive={index === activeImageIndex}
                      onSelect={onSelectImageIndex}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="p-8">
              <ProductHeroMediaEmptyState className="aspect-5/4 w-full rounded-3xl" />
            </div>
          )}
        </div>

        {/* --- Aside latéral (tablet) --- */}
        <aside className="flex w-84 shrink-0 flex-col px-4 py-4 lg:w-96 lg:px-5 lg:py-5">
          <div className="flex h-full flex-col gap-3">
            <ProductHeroHeader
              productName={productName}
              marketingHook={marketingHook}
              isSimpleProduct={isSimpleProduct}
              density="cozy"
            />

            {resolvedHeroVariant ? (
              <ProductHeroPricingMeta
                resolvedHeroVariant={resolvedHeroVariant}
                isSimpleProduct={isSimpleProduct}
                variablePriceLabel={variablePriceLabel}
                variableSummaryText={variableSummaryText}
                density="cozy"
              />
            ) : null}

            <ProductHeroAvailabilityMeta
              resolvedIsAvailable={resolvedIsAvailable}
              resolvedSingleVariantSku={resolvedSingleVariantSku}
              density="cozy"
            />

            <div className="grid gap-3">
              {cta ? (
                <div className="grid gap-2 border-t border-surface-border pt-4">{cta}</div>
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
              <div className="border-t border-surface-border pt-4">{asideExtra}</div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
