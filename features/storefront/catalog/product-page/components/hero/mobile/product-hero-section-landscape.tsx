// features/storefront/catalog/components/mobile/product-hero-section-landscape.tsx
"use client";

import Image from "next/image";
import { CreditCard, MapPin, ShieldCheck } from "lucide-react";

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
  const shouldShowActionBlock = Boolean(cta) || Boolean(variableVariants);
  const shouldShowCompactTrust = shouldShowActionBlock && resolvedIsAvailable;

  return (
    <section className="w-full border-b border-shell-border/80 pb-10">
      <div className="flex flex-row">
        {/* --- Image compacte (landscape) --- */}
        <div className="min-w-0 w-[45%] shrink-0 p-1.5">
          {selectedImage ? (
            <>
              <button
                type="button"
                onClick={onOpenLightbox}
                aria-label="Ouvrir l'image en plein écran"
                className="relative mx-auto h-[40vh] max-h-56 w-full overflow-hidden rounded-xl border border-hero-border text-left shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35"
              >
                <Image
                  key={selectedImage.src}
                  src={selectedImage.src}
                  alt={selectedImage.alt ?? productName}
                  width={1200}
                  height={1500}
                  loading="lazy"
                  sizes="46vw"
                  onLoad={() => onImageLoaded(selectedImage.src)}
                  className={[
                    "h-full w-full object-center transition-opacity duration-300 motion-reduce:transition-none",
                    isImageReady ? "opacity-100" : "opacity-0",
                    imageFit === "cover" ? "object-cover" : "object-contain",
                  ].join(" ")}
                />

                <ProductHeroImageCounterOverlay
                  activeIndex={activeImageIndex}
                  total={galleryImages.length}
                  className="bottom-1 right-1 px-2 py-0.5"
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
            <ProductHeroMediaEmptyState className="h-[40vh] max-h-56 w-full rounded-xl" />
          )}
        </div>

        {/* --- Aside dominant (landscape) --- */}
        <aside className="flex min-w-0 flex-1 flex-col border-l border-shell-border/70 px-2 py-1.5">
          <div className="flex h-full flex-col gap-1">
            <section className="grid gap-1">
              <ProductHeroHeader
                productName={productName}
                marketingHook={marketingHook}
                isSimpleProduct={isSimpleProduct}
                density="compact"
              />

              <div className="flex flex-wrap items-center gap-1.5 text-[0.75rem] leading-4 text-foreground-muted">
                <span className="inline-flex items-center gap-1">
                  <MapPin aria-hidden="true" className="size-3 text-brand/85" />
                  <span>Fait main à Saint-Étienne</span>
                </span>
                <span className="rounded-full border border-surface-border-subtle px-1.5 py-0.5">
                  Pièce unique
                </span>
              </div>
            </section>

            <section className="grid gap-1 border-t border-surface-border pt-1">
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
                resolvedAvailabilityStatus={resolvedAvailabilityStatus}
                resolvedIsAvailable={resolvedIsAvailable}
                density="compact"
              />
            </section>

            {variableVariants && variableVariants.length > 1 ? (
              <section className="grid gap-1 border-t border-surface-border pt-1">
                <ProductHeroVariantSelector
                  variableVariants={variableVariants}
                  selectedVariableVariant={selectedVariableVariant}
                  onSelectVariantId={onSelectVariantId}
                  density="compact"
                />
              </section>
            ) : null}

            {shouldShowActionBlock ? (
              <section className="grid gap-1 border-t border-surface-border pb-2 pt-1">
                {cta ? (
                  <div className="grid gap-1.5">{cta}</div>
                ) : variableVariants ? (
                  <ProductHeroVariableCartForm
                    productSlug={productSlug}
                    selectedVariant={selectedVariableVariant}
                    disabled={disableCart}
                    layout="stacked"
                    showBuyNowHelper={false}
                  />
                ) : null}

                {shouldShowCompactTrust ? (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] text-foreground-muted">
                    <span className="inline-flex items-center gap-1 rounded-full border border-control-border px-2 py-0.5">
                      <CreditCard aria-hidden="true" className="size-3" />
                      <span>CB</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-control-border px-2 py-0.5">
                      <span className="font-semibold tracking-tight">PayPal</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-control-border px-2 py-0.5">
                      <ShieldCheck aria-hidden="true" className="size-3" />
                      <span>Paiement sécurisé</span>
                    </span>
                  </div>
                ) : null}
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
