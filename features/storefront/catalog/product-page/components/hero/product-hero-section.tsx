// features/storefront/catalog/components/product-hero-section.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";
import type { HeroImage } from "./product-hero-thumbnail-button";
import type { ProductHeroResolvedProps } from "./product-hero-resolved-props";
import { ProductHeroSectionDesktop } from "./desktop/product-hero-section-desktop";
import { ProductHeroSectionTablet } from "./desktop/product-hero-section-tablet";
import { ProductHeroSectionLandscape } from "./mobile/product-hero-section-landscape";
import { ProductHeroSectionMobilePortrait } from "./mobile/product-hero-section-mobile-portrait";

// ---------------------------------------------------------------------------
// Props publiques (contrat d'entrée du hero)
// ---------------------------------------------------------------------------

export type ProductHeroSectionProps = {
  productName: string;
  productSlug?: string;
  marketingHook?: string | null;
  isSimpleProduct: boolean;
  isAvailable: boolean;
  images: HeroImage[];
  shortDescription?: string | null;
  heroVariant?: OfferVariant | null;
  variableVariants?: OfferVariant[] | undefined;
  variantSummary?: { total: number; available: number } | null;
  variablePriceLabel?: string | null;
  imageFit?: "contain" | "cover";
  cta?: React.ReactNode | undefined;
  asideExtra?: React.ReactNode | undefined;
  disableCart?: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dedupeHeroImages(images: HeroImage[]): HeroImage[] {
  const seen = new Set<string>();
  const result: HeroImage[] = [];

  for (const image of images) {
    const key = image.src.trim();

    if (key.length === 0 || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(image);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Orchestrateur
// ---------------------------------------------------------------------------

/**
 * Orchestrateur du hero produit.
 *
 * Responsabilités :
 * 1. Résoudre les données (variant sélectionné, images, disponibilité)
 * 2. Construire les props résolues (ProductHeroResolvedProps)
 * 3. Rendre les layouts via wrappers CSS-driven (aucune logique JS d'orientation)
 *
 * Les layouts sont purement présentationnels : aucun état, aucune logique.
 */
export function ProductHeroSection({
  productName,
  productSlug = "",
  marketingHook,
  isSimpleProduct,
  isAvailable,
  images,
  shortDescription,
  heroVariant,
  variableVariants,
  variantSummary,
  variablePriceLabel,
  imageFit = "cover",
  cta,
  asideExtra,
  disableCart,
}: ProductHeroSectionProps) {
  // --- État variant sélectionné ---
  const initialSelectedVariantId = useMemo(() => {
    if (isSimpleProduct || !variableVariants || variableVariants.length === 0) {
      return null;
    }

    return (
      variableVariants.find((variant) => variant.isDefault)?.id ?? variableVariants[0]?.id ?? null
    );
  }, [isSimpleProduct, variableVariants]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    initialSelectedVariantId
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loadedImageSrc, setLoadedImageSrc] = useState<string | null>(null);

  useEffect(() => {
    setSelectedVariantId(initialSelectedVariantId);
  }, [initialSelectedVariantId]);

  // --- Résolution variant ---
  const selectedVariableVariant = useMemo(() => {
    if (isSimpleProduct || !variableVariants || variableVariants.length === 0) {
      return null;
    }

    return (
      variableVariants.find((variant) => variant.id === selectedVariantId) ??
      variableVariants.find((variant) => variant.isDefault) ??
      variableVariants[0] ??
      null
    );
  }, [isSimpleProduct, selectedVariantId, variableVariants]);

  const resolvedHeroVariant =
    !isSimpleProduct && selectedVariableVariant ? selectedVariableVariant : (heroVariant ?? null);

  const resolvedIsAvailable =
    !isSimpleProduct && selectedVariableVariant ? selectedVariableVariant.isAvailable : isAvailable;

  // --- Résolution images ---
  const resolvedImages = useMemo(() => {
    if (!isSimpleProduct && selectedVariableVariant) {
      return dedupeHeroImages([...(selectedVariableVariant.images ?? []), ...images]);
    }

    return dedupeHeroImages(images);
  }, [images, isSimpleProduct, selectedVariableVariant]);

  const galleryImages = useMemo(
    () => resolvedImages.filter((image) => image.src.trim().length > 0),
    [resolvedImages]
  );

  useEffect(() => {
    if (!isSimpleProduct) {
      setSelectedImageIndex(0);
      setLoadedImageSrc(null);
    }
  }, [isSimpleProduct, selectedVariantId]);

  const activeImageIndex =
    galleryImages.length === 0 ? 0 : Math.min(selectedImageIndex, galleryImages.length - 1);

  const selectedImage = galleryImages[activeImageIndex] ?? null;
  const isImageReady = selectedImage ? loadedImageSrc === selectedImage.src : false;

  // --- Résolution texte résumé variants ---
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

  // --- Props résolues pour les layouts ---
  const resolvedProps: ProductHeroResolvedProps = {
    productName,
    productSlug,
    marketingHook: marketingHook ?? null,
    isSimpleProduct,
    shortDescription: shortDescription ?? null,
    resolvedHeroVariant,
    resolvedIsAvailable,
    variablePriceLabel: variablePriceLabel ?? null,
    variableSummaryText,
    variableVariants,
    selectedVariableVariant,
    onSelectVariantId: setSelectedVariantId,
    galleryImages,
    activeImageIndex,
    selectedImage,
    isImageReady,
    onSelectImageIndex: setSelectedImageIndex,
    onImageLoaded: setLoadedImageSrc,
    imageFit,
    cta,
    asideExtra,
    ...(disableCart !== undefined ? { disableCart } : {}),
  };

  return (
    <>
      {/* Landscape compact — petit viewport paysage uniquement */}
      <div className="hidden [@media(max-height:600px)_and_(orientation:landscape)]:block">
        <ProductHeroSectionLandscape {...resolvedProps} />
      </div>

      {/* Mobile portrait — < md, hors landscape compact */}
      <div className="block md:hidden [@media(max-height:600px)_and_(orientation:landscape)]:hidden">
        <ProductHeroSectionMobilePortrait {...resolvedProps} />
      </div>

      {/* Tablet — md à < xl, hors landscape compact */}
      <div className="hidden md:block xl:hidden [@media(max-height:600px)_and_(orientation:landscape)]:hidden">
        <ProductHeroSectionTablet {...resolvedProps} />
      </div>

      {/* Desktop — xl+, hors landscape compact */}
      <div className="hidden xl:block [@media(max-height:600px)_and_(orientation:landscape)]:hidden">
        <ProductHeroSectionDesktop {...resolvedProps} />
      </div>
    </>
  );
}
