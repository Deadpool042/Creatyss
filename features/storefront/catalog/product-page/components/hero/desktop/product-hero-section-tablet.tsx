"use client";

import Image from "next/image";

import type { ProductHeroResolvedProps } from "../product-hero-resolved-props";
import { ProductHeroHeader } from "../product-hero-header";
import {
  ProductHeroImageCounterOverlay,
  ProductHeroMediaEmptyState,
} from "../product-hero-media-elements";
import { ProductHeroAvailabilityMeta, ProductHeroPricingMeta } from "../product-hero-meta-blocks";
import { HeroThumbnailButton } from "../product-hero-thumbnail-button";
import { ProductHeroVariableCartForm } from "../product-hero-variable-cart-form";
import { ProductHeroVariantSelector } from "../product-hero-variant-selector";

/**
 * Layout tablette du hero produit.
 *
 * Composant purement présentationnel : reçoit des props résolues,
 * aucune logique métier, aucun useState/useEffect.
 */
export function ProductHeroSectionTablet({
  productName,
  productSlug,
  marketingHook,
  isSimpleProduct,
  shortDescription,
  resolvedHeroVariant,
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
  imageFit,
  cta,
  asideExtra,
  disableCart,
}: ProductHeroResolvedProps) {
  const hasVisibleThumbnailRail = galleryImages.length > 1;
  const shouldShowActionBlock = !isSimpleProduct || Boolean(cta);

  return (
    <section className="w-full border-b border-shell-border/80 pb-5 lg:pb-6">
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
        <aside className="flex w-84 shrink-0 flex-col border-l border-shell-border/70 px-4 py-3 lg:w-96 lg:px-5 lg:py-4">
          <div className="flex h-full flex-col gap-3">
            <section className="grid gap-2">
              <ProductHeroHeader
                productName={productName}
                marketingHook={marketingHook}
                isSimpleProduct={isSimpleProduct}
                density="cozy"
              />
            </section>

            <section className="grid gap-3 border-t border-surface-border pt-4">
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
                density="cozy"
              />
            </section>

            {shouldShowActionBlock ? (
              <section className="mt-auto grid gap-3 border-t border-surface-border pt-4">
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
                  />
                ) : null}
              </section>
            ) : null}

            {shortDescription ? (
              <section className="grid gap-2 border-t border-surface-border pt-4">
                <p className="text-meta-label text-brand">Description</p>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-text-muted-strong [&_p]:my-0 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: shortDescription }}
                />
              </section>
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
