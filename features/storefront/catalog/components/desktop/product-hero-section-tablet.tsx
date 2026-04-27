"use client";

import Image from "next/image";

import { getProductAvailabilityLabel } from "@/entities/product/product-public-presentation";

import type { ProductHeroResolvedProps } from "../product-hero-resolved-props";
import { HeroThumbnailButton } from "../product-hero-thumbnail-button";

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
  const shouldShowBuyNowPresentation = isSimpleProduct && Boolean(cta);

  return (
    <section className="w-full">
      <div className="flex flex-row">
        {/* --- Media : thumbnails + image (tablet) --- */}
        <div className="min-w-0 flex-1 p-3 lg:p-4">
          {selectedImage ? (
            <div className="flex flex-col gap-3">
              <div className="relative mx-auto h-[56vh] max-h-[32rem] w-full">
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

                {galleryImages.length > 1 ? (
                  <div className="absolute bottom-3 right-3 rounded-full bg-background/70 px-2.5 py-1 backdrop-blur-sm">
                    <span className="text-micro-copy tabular-nums text-foreground">
                      {activeImageIndex + 1} / {galleryImages.length}
                    </span>
                  </div>
                ) : null}
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
              <div className="grid aspect-5/4 w-full place-items-center rounded-3xl border border-dashed border-hero-border text-center text-sm text-media-foreground">
                Aucune image.
              </div>
            </div>
          )}
        </div>

        {/* --- Aside latéral (tablet) --- */}
        <aside className="flex w-84 shrink-0 flex-col px-4 py-4 lg:w-96 lg:px-5 lg:py-5">
          <div className="flex h-full flex-col gap-3">
            <header className="grid gap-2">
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
              <div className="grid gap-3">
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

            <div className="grid gap-3">
              {cta ? (
                <div className="grid gap-2 border-t border-surface-border pt-4">
                  {cta}

                  {shouldShowBuyNowPresentation ? (
                    <div className="grid gap-1.5">
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        className="inline-flex w-auto items-center justify-center self-start justify-self-start rounded-xl border border-control-border bg-control-surface px-4 py-2.5 text-sm font-medium text-foreground-muted"
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
              <div className="border-t border-surface-border pt-4">{asideExtra}</div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
