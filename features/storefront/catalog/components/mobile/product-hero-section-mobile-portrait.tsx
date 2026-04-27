// features/storefront/catalog/components/mobile/product-hero-section-mobile-portrait.tsx
"use client";

import Image from "next/image";

import { getProductAvailabilityLabel } from "@/entities/product/product-public-presentation";

import { ProductHeroGalleryDots } from "../product-hero-gallery-dots";
import type { ProductHeroResolvedProps } from "../product-hero-resolved-props";

function getVariantSelectionLabel(variant: {
  name: string;
  optionValues: { valueLabel: string }[];
}): string {
  const optionLabel = variant.optionValues
    .map((item) => item.valueLabel)
    .join(" · ")
    .trim();

  return optionLabel.length > 0 ? optionLabel : variant.name;
}

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
  const shouldShowBuyNowPresentation = isSimpleProduct && Boolean(cta);

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

              {galleryImages.length > 1 ? (
                <div className="absolute bottom-2.5 right-2.5 rounded-full bg-background/70 px-2.5 py-1 backdrop-blur-sm">
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
          <div className="p-6 sm:p-8">
            <div className="grid aspect-4/3 w-full place-items-center rounded-3xl border border-dashed border-hero-border text-center text-sm text-media-foreground">
              Aucune image.
            </div>
          </div>
        )}

      </div>

      {/* --- Aside empilé (mobile portrait) --- */}
      <aside className="flex flex-col px-6 pb-7 pt-6 sm:px-7 sm:pt-7">
        <div className="flex flex-col gap-6">
          <header className="grid gap-2.5">
            <p className="text-meta-label text-brand">
              {isSimpleProduct ? "Pièce unique" : "Édition unique"}
            </p>

            <h1 className="text-title-page text-foreground">{productName}</h1>

            {marketingHook ? (
              <p className="max-w-2xl border-l-2 border-brand/35 pl-4 text-secondary-copy reading-relaxed text-foreground-muted">
                {marketingHook}
              </p>
            ) : null}
          </header>

          {resolvedHeroVariant ? (
            <div className="grid gap-4">
              {resolvedHeroVariant.compareAtPrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-meta-label text-brand">Ancien prix</span>
                  <span className="text-secondary-copy reading-compact font-medium line-through text-foreground-muted">
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

              <p className="inline-flex items-center gap-2 text-secondary-copy reading-compact font-medium text-foreground">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-feedback-success"
                />
                <span>Livraison incluse</span>
              </p>
            </div>
          ) : null}

          <section className="grid gap-3">
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

          <div className="mt-auto grid gap-4">
            {cta ? (
              <div className="grid gap-2.5 border-t border-surface-border pt-6">
                {cta}

                {shouldShowBuyNowPresentation ? (
                  <div className="grid gap-1.5">
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="inline-flex w-auto items-center justify-center self-start rounded-xl border border-control-border bg-control-surface px-4 py-3 text-sm font-medium text-foreground-muted"
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
              className="prose prose-sm dark:prose-invert max-w-none border-t border-surface-border pt-4 text-foreground-muted [&_p]:my-0 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: shortDescription }}
            />
          ) : null}

          {!isSimpleProduct && variableVariants && variableVariants.length > 1 ? (
            <section className="grid gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-meta-label text-brand">Choix principal</p>
                {selectedVariableVariant ? (
                  <p className="text-micro-copy reading-compact text-foreground-muted">
                    {getVariantSelectionLabel(selectedVariableVariant)}
                  </p>
                ) : null}
              </div>

              <p className="max-w-2xl text-secondary-copy reading-relaxed text-foreground-muted">
                Définissez ici la déclinaison à privilégier.
              </p>

              <div className="flex flex-wrap gap-2.5">
                {variableVariants.map((variant) => {
                  const isSelected = variant.id === selectedVariableVariant?.id;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => onSelectVariantId(variant.id)}
                      className={[
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35",
                        isSelected
                          ? "border-control-border-strong bg-interactive-selected text-foreground"
                          : "border-control-border bg-transparent text-foreground-muted hover:bg-interactive-hover hover:text-foreground",
                      ].join(" ")}
                    >
                      {getVariantSelectionLabel(variant)}
                    </button>
                  );
                })}
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
