// features/storefront/catalog/components/mobile/product-hero-section-landscape.tsx
"use client";

import Image from "next/image";

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
 * Layout landscape compact du hero produit.
 *
 * Composant purement présentationnel : reçoit des props résolues,
 * aucune logique métier, aucun useState/useEffect.
 *
 * Optimisé pour les viewports paysage compacts (téléphones tournés).
 * Image compacte (~1/3), aside dominant (~2/3), rythme vertical serré.
 */
export function ProductHeroSectionLandscape({
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
  const hasVisibleThumbnailRail = false;
  const shouldShowGalleryDots = !hasVisibleThumbnailRail && galleryImages.length > 1;
  const shouldShowActionBlock = Boolean(cta) || Boolean(variableVariants);

  return (
    <section className="w-full border-b border-shell-border/80 pb-3">
      <div className="flex flex-row">
        {/* --- Image compacte (landscape) --- */}
        <div className="min-w-0 w-[28%] shrink-0 p-2.5">
          {selectedImage ? (
            <>
              <div className="relative mx-auto h-[50vh] max-h-80 w-auto">
                <Image
                  key={selectedImage.src}
                  src={selectedImage.src}
                  alt={selectedImage.alt ?? productName}
                  width={1200}
                  height={1500}
                  loading="lazy"
                  sizes="30vw"
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
                  className="bottom-2 right-2 px-2 py-0.5"
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
            <ProductHeroMediaEmptyState className="h-[48vh] w-full rounded-2xl" />
          )}
        </div>

        {/* --- Aside dominant (landscape) --- */}
        <aside className="flex flex-1 flex-col border-l border-shell-border/70 px-3 py-2">
          <div className="flex h-full flex-col gap-2">
            <section className="grid gap-1.5">
              <ProductHeroHeader
                productName={productName}
                marketingHook={marketingHook}
                isSimpleProduct={isSimpleProduct}
                density="compact"
              />
            </section>

            <section className="grid gap-2 border-t border-surface-border pt-2">
              {resolvedHeroVariant ? (
                <ProductHeroPricingMeta
                  resolvedHeroVariant={resolvedHeroVariant}
                  isSimpleProduct={isSimpleProduct}
                  variablePriceLabel={variablePriceLabel}
                  variableSummaryText={variableSummaryText}
                  density="compact"
                />
              ) : null}

              <ProductHeroAvailabilityMeta
                resolvedIsAvailable={resolvedIsAvailable}
                density="compact"
              />
            </section>

            {variableVariants && variableVariants.length > 1 ? (
              <section className="grid gap-2 border-t border-surface-border pt-2">
                <ProductHeroVariantSelector
                  variableVariants={variableVariants}
                  selectedVariableVariant={selectedVariableVariant}
                  onSelectVariantId={onSelectVariantId}
                />
              </section>
            ) : null}

            {shouldShowActionBlock ? (
              <section className="grid gap-2 border-t border-surface-border pt-2">
                {cta ? (
                  <div className="grid gap-1.5">{cta}</div>
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
              <section className="grid gap-1.5 border-t border-surface-border pt-2">
                <p className="text-meta-label text-brand">Description</p>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-text-muted-strong [&_p]:my-0 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: shortDescription }}
                />
              </section>
            ) : null}

            {asideExtra ? (
              <div className="border-t border-surface-border pt-2">{asideExtra}</div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
