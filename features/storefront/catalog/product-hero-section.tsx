"use client";

/**
 * Bloc hero partagé — fiche produit.
 *
 * Utilisé par le storefront (app/boutique/[slug]/page.tsx)
 * et la preview admin (app/admin/.../products/[slug]/preview/page.tsx).
 */
import Image from "next/image";
import { useMemo, useState } from "react";

import { getProductAvailabilityLabel } from "@/entities/product/product-public-presentation";

type HeroVariant = {
  price: string;
  compareAtPrice: string | null;
};

type ProductHeroSectionProps = {
  productName: string;
  isSimpleProduct: boolean;
  isAvailable: boolean;
  images: { src: string; alt: string | null }[];
  shortDescription?: string | null;
  heroVariant?: HeroVariant | null;
  /**
   * Résumé des déclinaisons (produits variables).
   * Exemple: { total: 4, available: 3 }
   */
  variantSummary?: { total: number; available: number } | null;
  /**
   * Libellé du prix pour les produits variables (V1).
   * Doit rester honnête tant qu'on ne calcule pas un vrai min/max.
   */
  variablePriceLabel?: string | null;
  /**
   * Ajustement mesuré du fit image pour réduire le vide perçu.
   * Simple: "contain" (packshot propre), Variable: "cover" (plus incarné).
   */
  imageFit?: "contain" | "cover";
  singleVariantSku?: string | null;
  cta?: React.ReactNode | undefined;
  asideExtra?: React.ReactNode | undefined;
};

export function ProductHeroSection({
  productName,
  isSimpleProduct,
  isAvailable,
  images,
  shortDescription,
  heroVariant,
  variantSummary,
  variablePriceLabel,
  imageFit = "contain",
  singleVariantSku,
  cta,
  asideExtra,
}: ProductHeroSectionProps) {
  const galleryImages = useMemo(
    () => images.filter((image) => image.src.trim().length > 0),
    [images]
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loadedImageSrc, setLoadedImageSrc] = useState<string | null>(null);

  const activeImageIndex =
    galleryImages.length === 0 ? 0 : Math.min(selectedImageIndex, galleryImages.length - 1);
  const selectedImage = galleryImages[activeImageIndex] ?? null;
  const isImageReady = selectedImage ? loadedImageSrc === selectedImage.src : false;
  const variableSummaryText = useMemo(() => {
    if (!variantSummary) {
      return null;
    }

    const total = Math.max(0, variantSummary.total);
    const available = Math.max(0, variantSummary.available);
    const declLabel = `${total} déclinaison${total > 1 ? "s" : ""}`;
    const availLabel = `${available} disponible${available > 1 ? "s" : ""}`;

    return `${declLabel} · ${availLabel}`;
  }, [variantSummary]);
  const shortDescriptionPlainText = useMemo(() => {
    if (!shortDescription) {
      return null;
    }

    return shortDescription
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, [shortDescription]);
  const compactLandscapeThumbnails = useMemo(() => {
    if (galleryImages.length <= 1) {
      return [];
    }

    const candidateIndexes = [activeImageIndex, 0, 1, 2].filter(
      (index) => index >= 0 && index < galleryImages.length
    );
    const uniqueIndexes = [...new Set(candidateIndexes)].slice(0, 3);

    return uniqueIndexes
      .map((index) => ({
        image: galleryImages[index],
        index,
      }))
      .filter(
        (thumbnail): thumbnail is { image: { src: string; alt: string | null }; index: number } =>
          thumbnail.image !== undefined
      );
  }, [activeImageIndex, galleryImages]);

  return (
    <section className="w-full overflow-hidden rounded-xl border border-shell-border-strong bg-linear-to-b from-shell-surface via-surface-panel-soft to-surface-subtle shadow-card">
      <div className="grid min-[900px]:grid-cols-[minmax(0,0.97fr)_minmax(0,1.03fr)] min-[1300px]:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="border-b border-surface-border-subtle bg-media-surface/95 shadow-inset-soft min-[900px]:border-r min-[900px]:border-shell-border-strong min-[900px]:border-b-0 [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:border-r [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:border-shell-border-strong [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:border-b-0">
          {selectedImage ? (
            <div className="p-2.5 min-[700px]:p-3.5 min-[900px]:p-4 min-[1200px]:p-5 [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:p-1">
              <div className="grid gap-2.5 min-[900px]:grid-cols-[auto_minmax(0,1fr)] min-[900px]:items-center [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:gap-1">
                {galleryImages.length > 1 ? (
                  <div className="order-2 mx-auto w-full min-[900px]:order-1 min-[900px]:mx-0 min-[900px]:w-auto [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:hidden">
                    <div className="flex items-center justify-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[900px]:max-h-80 min-[900px]:flex-col min-[900px]:justify-start">
                      {galleryImages.map((image, index) => {
                        const isActive = index === activeImageIndex;

                        return (
                          <button
                            key={`${image.src}-${index}`}
                            type="button"
                            aria-label={`Voir l'image ${index + 1} du produit`}
                            aria-pressed={isActive}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`group relative w-10 min-w-10 overflow-hidden rounded-md border p-px transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 min-[700px]:w-11 min-[700px]:min-w-11 min-[900px]:w-12 min-[900px]:min-w-12 ${
                              isActive
                                ? "border-control-border-strong bg-control-surface-selected shadow-control"
                                : "border-surface-border-subtle bg-control-surface/70 shadow-control opacity-70 hover:border-control-border hover:bg-control-surface-hover hover:opacity-90 hover:shadow-control-hover"
                            }`}
                          >
                            <Image
                              alt={image.alt ?? `${productName} miniature ${index + 1}`}
                              className="aspect-square w-full rounded object-cover transition-transform duration-300 group-hover:scale-103"
                              width={160}
                              height={160}
                              loading="lazy"
                              sizes="(min-width: 1200px) 4vw, (min-width: 900px) 5vw, 10vw"
                              src={image.src}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="order-1 min-[900px]:order-2">
                  <div className="relative mx-auto aspect-4/5 w-full max-w-[min(100%,36rem)] overflow-hidden rounded-[1.6rem] border border-shell-border-strong/90 bg-media-surface shadow-raised [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:h-[60vh] [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:w-auto [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:max-h-[14.2rem] [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:rounded-xl [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:border-surface-border-subtle [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:shadow-control">
                    <Image
                      key={selectedImage.src}
                      alt={selectedImage.alt ?? productName}
                      className={`h-full w-full rounded-[1.45rem] object-center transition-opacity duration-300 motion-reduce:transition-none ${
                        isImageReady ? "opacity-100" : "opacity-0"
                      } ${imageFit === "cover" ? "object-cover" : "object-contain"}`}
                      width={1200}
                      height={1200}
                      loading="lazy"
                      sizes="(min-width: 1300px) 42vw, (min-width: 900px) 47vw, (min-width: 700px) 90vw, 92vw"
                      src={selectedImage.src}
                      onLoadingComplete={() => setLoadedImageSrc(selectedImage.src)}
                    />
                  </div>
                </div>

                {compactLandscapeThumbnails.length > 1 ? (
                  <div className="hidden [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:flex [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:items-center [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:justify-center [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:gap-1">
                    {compactLandscapeThumbnails.map(({ image, index }) => {
                      const isActive = index === activeImageIndex;

                      return (
                        <button
                          key={`${image.src}-${index}-landscape`}
                          type="button"
                          aria-label={`Voir l'image ${index + 1} du produit`}
                          aria-pressed={isActive}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`group relative h-8 w-8 overflow-hidden rounded-md border p-px transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 ${
                            isActive
                              ? "border-control-border-strong bg-control-surface-selected shadow-control"
                              : "border-surface-border-subtle bg-control-surface/70 opacity-80"
                          }`}
                        >
                          <Image
                            alt={image.alt ?? `${productName} miniature ${index + 1}`}
                            className="h-full w-full rounded object-cover"
                            width={120}
                            height={120}
                            loading="lazy"
                            sizes="8vw"
                            src={image.src}
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="p-6 min-[700px]:p-8 min-[900px]:p-8 min-[1200px]:p-10">
              <div className="grid aspect-4/3 w-full place-items-center rounded-3xl border border-dashed border-surface-border text-center text-sm text-media-foreground min-[900px]:aspect-5/4">
                Aucune image.
              </div>
            </div>
          )}
        </div>

        <div className="hidden bg-linear-to-b from-surface-panel via-surface-panel-soft to-surface-subtle p-1.5 [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:flex [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:flex-col justify-between gap-4 min-[900px]:p-6 min-[1200px]:p-8">
          <div className="grid gap-1.5 rounded-xl border border-control-border-strong bg-linear-to-b from-control-surface-hover to-control-surface px-2 py-2 shadow-control">
            <div className="flex flex-col items-start justify-between gap-2">
              <div className="grid min-w-0 gap-1">
                <p className="truncate text-meta-label text-text-muted-soft">{productName}</p>
                <div className="flex flex-wrap items-baseline gap-1.5">
                  {heroVariant?.compareAtPrice ? (
                    <span className="text-micro-copy reading-compact font-medium line-through text-text-muted-strong">
                      {heroVariant.compareAtPrice}
                    </span>
                  ) : null}
                  <span className="text-price-compact">{heroVariant?.price || "—"}</span>
                </div>
                {!isSimpleProduct && variableSummaryText ? (
                  <p className="text-micro-copy reading-compact text-text-muted-strong">
                    {variableSummaryText}
                  </p>
                ) : null}
              </div>

              <p className="inline-flex items-center gap-1 text-right text-micro-copy reading-compact font-medium">
                <span
                  aria-hidden="true"
                  className="relative h-1 w-5 overflow-hidden rounded-full bg-brand/25"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-brand/70 to-transparent bg-size-[280%_100%] motion-safe:animate-premium-shimmer motion-reduce:animate-none" />
                </span>
                <span className="bg-linear-to-r from-foreground/75 via-brand/90 to-foreground/75 bg-size-[240%_100%] bg-clip-text text-transparent motion-safe:animate-premium-shimmer-text motion-reduce:animate-none">
                  Livraison incluse
                </span>
              </p>
            </div>
          </div>

          {shortDescriptionPlainText ? (
            <div>
              <p className="text-micro-copy reading-compact text-text-muted-strong">
                {shortDescriptionPlainText}
              </p>
            </div>
          ) : null}

          {cta ? (
            <div className="mt-auto grid gap-1 [&_form]:grid [&_form]:gap-1 [&_label]:text-[0.58rem] [&_input]:h-6 [&_input]:max-w-20 [&_input]:px-1.5 [&_input]:text-[0.78rem] **:data-[slot=button]:h-7.5 **:data-[slot=button]:px-2 **:data-[slot=button]:text-[0.7rem]">
              {cta}
            </div>
          ) : null}
        </div>

        <aside className="flex flex-col border-l border-shell-border-strong bg-linear-to-b from-surface-panel via-surface-panel-soft to-surface-subtle p-4 shadow-inset-soft min-[700px]:p-5 min-[900px]:p-6 min-[1200px]:p-7 [@media(max-width:899px)_and_(max-height:430px)_and_(orientation:landscape)]:hidden">
          <div className="flex h-full flex-col gap-6 min-[900px]:gap-7">
            {heroVariant ? (
              <div className="grid gap-3 rounded-2xl border border-control-border-strong bg-linear-to-b from-control-surface-hover to-control-surface px-3 py-3 shadow-card min-[900px]:px-4 min-[900px]:py-4">
                {heroVariant.compareAtPrice ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-meta-label text-text-muted-soft">Ancien prix</span>
                    <span className="text-secondary-copy reading-compact font-medium line-through text-text-muted-strong">
                      {heroVariant.compareAtPrice}
                    </span>
                  </div>
                ) : null}

                {!isSimpleProduct ? (
                  <p className="text-meta-label text-text-muted-soft">
                    {variablePriceLabel && variablePriceLabel.trim().length > 0
                      ? variablePriceLabel
                      : "Prix"}
                  </p>
                ) : null}

                <p className="text-price-display">{heroVariant.price || "—"}</p>

                {!isSimpleProduct && variableSummaryText ? (
                  <p className="text-micro-copy reading-compact text-text-muted-strong">
                    {variableSummaryText}
                  </p>
                ) : null}

                <p className="inline-flex items-center gap-2 text-secondary-copy reading-compact font-medium">
                  <span
                    aria-hidden="true"
                    className="relative h-1.5 w-9 overflow-hidden rounded-full bg-brand/25"
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-brand/70 to-transparent bg-size-[280%_100%] motion-safe:animate-premium-shimmer motion-reduce:animate-none" />
                  </span>
                  <span className="bg-linear-to-r from-foreground/75 via-brand/90 to-foreground/75 bg-size-[260%_100%] bg-clip-text text-transparent motion-safe:animate-premium-shimmer-text motion-reduce:animate-none">
                    Livraison incluse
                  </span>
                </p>
              </div>
            ) : null}

            {shortDescription ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none px-1 text-text-muted-strong [&_p]:my-0 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
            ) : null}

            <div className="grid gap-2 rounded-2xl border border-control-border bg-linear-to-b from-control-surface-hover/95 to-control-surface px-3 py-3 min-[900px]:px-4 min-[900px]:py-4 shadow-control">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-meta-label text-text-muted-soft">Disponibilité</p>
                <span
                  className={`flex items-center gap-1.5 text-sm font-medium ${
                    isAvailable
                      ? "text-feedback-success-foreground"
                      : "text-feedback-error-foreground"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                      isAvailable ? "bg-feedback-success" : "bg-feedback-error"
                    }`}
                  />
                  {getProductAvailabilityLabel(isAvailable)}
                </span>
              </div>

              {singleVariantSku ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-meta-label text-text-muted-soft">Référence</p>
                  <p className="font-mono text-sm text-text-muted-strong">{singleVariantSku}</p>
                </div>
              ) : null}
            </div>

            {cta ? <div className="mt-auto">{cta}</div> : null}

            {asideExtra ? <div className="pt-1 min-[900px]:pt-1.5">{asideExtra}</div> : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
