// features/storefront/catalog/components/mobile/product-hero-section-mobile-portrait.tsx
"use client";

import Image from "next/image";
import { CreditCard, MapPin, ShieldCheck } from "lucide-react";

import { ProductHeroGalleryDots } from "../product-hero-gallery-dots";
import { ProductHeroHeader } from "../product-hero-header";
import { ProductHeroMediaEmptyState } from "../product-hero-media-elements";
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
                onLoad={() => onImageLoaded(selectedImage.src)}
                className={[
                  "h-full w-full object-center transition-opacity duration-300 motion-reduce:transition-none",
                  isImageReady ? "opacity-100" : "opacity-0",
                  imageFit === "cover" ? "object-cover" : "object-contain",
                ].join(" ")}
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
            <div className="flex flex-wrap items-center gap-2 text-xs leading-snug text-foreground-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-3.5 text-brand/85" />
                <span>Fait main à Saint-Étienne</span>
              </span>
              <span className="rounded-full border border-surface-border-subtle px-2 py-0.5 text-[0.75rem] leading-5 text-foreground-muted">
                Chaque sac est unique
              </span>
            </div>
            {shortDescription ? (
              <div
                className="prose prose-sm max-w-none text-foreground line-clamp-3 [&_p]:my-0 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
            ) : null}
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
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8125rem] text-foreground-muted">
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
              </div>
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
