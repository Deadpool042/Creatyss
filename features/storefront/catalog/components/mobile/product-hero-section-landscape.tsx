// features/storefront/catalog/components/mobile/product-hero-section-landscape.tsx
"use client";

import Image from "next/image";

import { getProductAvailabilityLabel } from "@/entities/product/product-public-presentation";

import { ProductHeroGalleryDots } from "../product-hero-gallery-dots";
import type { ProductHeroResolvedProps } from "../product-hero-resolved-props";

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
  marketingHook,
  isSimpleProduct,
  shortDescription,
  resolvedHeroVariant,
  resolvedIsAvailable,
  resolvedSingleVariantSku,
  variablePriceLabel,
  variableSummaryText,
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
  const shouldShowBuyNowPresentation = isSimpleProduct && Boolean(cta);

  return (
    <section className="w-full border-b border-shell-border">
      <div className="flex flex-row">
        {/* --- Image compacte (landscape) --- */}
        <div className="min-w-0 w-[28%] shrink-0 p-2">
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
                    "h-full w-full rounded-xl border border-hero-border object-center shadow-raised transition-opacity duration-300 motion-reduce:transition-none",
                    isImageReady ? "opacity-100" : "opacity-0",
                    imageFit === "cover" ? "object-cover" : "object-contain",
                  ].join(" ")}
                />

                {galleryImages.length > 1 ? (
                  <div className="absolute bottom-2 right-2 rounded-full bg-background/70 px-2 py-0.5 backdrop-blur-sm">
                    <span className="text-micro-copy tabular-nums text-foreground">
                      {activeImageIndex + 1} / {galleryImages.length}
                    </span>
                  </div>
                ) : null}
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
            <div className="grid h-[48vh] w-full place-items-center rounded-xl border border-dashed border-hero-border text-center text-sm text-media-foreground">
              Aucune image.
            </div>
          )}
        </div>

        {/* --- Aside dominant (landscape) --- */}
        <aside className="flex flex-1 flex-col px-3 py-2">
          <div className="flex h-full flex-col gap-2">
            <header className="grid gap-1">
              <p className="text-meta-label text-brand">
                {isSimpleProduct ? "Pièce unique" : "Édition unique"}
              </p>
              <h1 className="text-title-page text-foreground">{productName}</h1>

              {marketingHook ? (
                <p className="max-w-xl border-l-2 border-brand/35 pl-3 text-sm reading-relaxed text-foreground-muted">
                  {marketingHook}
                </p>
              ) : null}
            </header>

            {resolvedHeroVariant ? (
              <div className="grid gap-1.5">
                {resolvedHeroVariant.compareAtPrice ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-meta-label text-brand">Ancien prix</span>
                    <span className="text-sm reading-compact font-medium line-through text-foreground-muted">
                      {resolvedHeroVariant.compareAtPrice}
                    </span>
                  </div>
                ) : null}

                {!isSimpleProduct ? (
                  <p className="text-meta-label text-brand">
                    {variablePriceLabel && variablePriceLabel.trim().length > 0
                      ? variablePriceLabel
                      : "Prix"}
                  </p>
                ) : null}

                <p className="font-serif text-price-display text-foreground">
                  {resolvedHeroVariant.price || "—"}
                </p>

                {!isSimpleProduct && variableSummaryText ? (
                  <p className="text-micro-copy reading-compact text-foreground-muted">
                    {variableSummaryText}
                  </p>
                ) : null}

                <p className="inline-flex items-center gap-1.5 text-sm reading-compact font-medium text-foreground">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-feedback-success"
                  />
                  <span>Livraison incluse</span>
                </p>
              </div>
            ) : null}

            <section className="grid gap-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-meta-label text-brand">Disponibilité</p>
                <span
                  className={[
                    "flex items-center gap-1.5 text-sm font-medium",
                    resolvedIsAvailable
                      ? "text-feedback-success-foreground"
                      : "text-feedback-error-foreground",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      resolvedIsAvailable ? "bg-feedback-success" : "bg-feedback-error",
                    ].join(" ")}
                  />
                  {getProductAvailabilityLabel(resolvedIsAvailable)}
                </span>
              </div>

              {resolvedSingleVariantSku ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-meta-label text-brand">Référence</p>
                  <p className="font-mono text-sm text-foreground-muted">
                    {resolvedSingleVariantSku}
                  </p>
                </div>
              ) : null}
            </section>

            <div className="grid gap-2">
              {cta ? (
                <div className="grid gap-1.5 border-t border-surface-border pt-2">
                  {cta}

                  {shouldShowBuyNowPresentation ? (
                    <div className="grid gap-1">
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        className="inline-flex w-auto items-center justify-center self-start justify-self-start rounded-lg border border-control-border bg-control-surface px-3 py-2 text-xs font-medium text-foreground-muted"
                      >
                        Achat immédiat
                      </button>
                      <p className="text-micro-copy reading-compact text-foreground-muted">
                        Bientôt disponible
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {shortDescription ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none border-t border-surface-border pt-2 text-foreground-muted [&_p]:my-0 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
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
