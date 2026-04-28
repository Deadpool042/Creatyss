// features/storefront/catalog/components/product-hero-section-desktop.tsx
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
 * Layout desktop/tablet du hero produit.
 *
 * Composant purement présentationnel : reçoit des props résolues,
 * aucune logique métier, aucun useState/useEffect.
 *
 * 2 colonnes : thumbnails + image principale à gauche, aside à droite.
 */
export function ProductHeroSectionDesktop({
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
    <section className="w-full border-b border-shell-border/80 pb-6 min-[700px]:pb-7 min-[1200px]:pb-8">
      <div className="flex flex-row">
        {/* --- Media : thumbnails + image (desktop) --- */}
        <div className="min-w-0 flex-1 p-4 lg:p-5">
          {selectedImage ? (
            <div className="grid grid-cols-[auto_1fr] items-start gap-2.5">
              {hasVisibleThumbnailRail ? (
                <div className="order-1">
                  <div className="flex max-h-128 flex-col items-start gap-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>button]:min-w-20 [&>button]:w-20">
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
                </div>
              ) : null}

              <div className="order-2">
                <div className="relative mx-auto aspect-7/8 w-full">
                  <Image
                    key={selectedImage.src}
                    src={selectedImage.src}
                    alt={selectedImage.alt ?? productName}
                    width={1200}
                    height={1500}
                    loading="lazy"
                    sizes="(min-width: 1280px) 36vw, (min-width: 1024px) 44vw, 40vw"
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
              </div>
            </div>
          ) : (
            <div className="p-10">
              <ProductHeroMediaEmptyState className="aspect-5/4 w-full rounded-3xl" />
            </div>
          )}
        </div>

        {/* --- Aside latéral (desktop) --- */}
        <aside className="flex w-96 shrink-0 flex-col border-l border-shell-border/70 px-6 py-4 lg:px-7 lg:py-5">
          <div className="flex h-full flex-col gap-6">
            <section className="grid gap-3">
              <ProductHeroHeader
                productName={productName}
                marketingHook={marketingHook}
                isSimpleProduct={isSimpleProduct}
                density="default"
              />
            </section>

            <section className="grid gap-5 border-t border-surface-border-strong pt-5">
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
                density="default"
              />
            </section>

            {shouldShowActionBlock ? (
              <section className="mt-auto grid gap-4 border-t border-surface-border-strong pt-5">
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
              <section className="grid gap-2 border-t border-surface-border-strong pt-5">
                <p className="text-meta-label text-brand">Description</p>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-text-muted-strong [&_p]:my-0 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: shortDescription }}
                />
              </section>
            ) : null}

            {asideExtra ? (
              <div className="border-t border-surface-border-strong pt-5">{asideExtra}</div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
