// features/storefront/catalog/components/product-hero-resolved-props.ts

import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";
import type { HeroImage } from "./product-hero-thumbnail-button";

/**
 * Contrat de données résolues passé de l'orchestrateur hero
 * vers les composants de layout (landscape, desktop, mobile portrait).
 *
 * Toutes les valeurs sont pré-calculées : les layouts n'ont aucune logique métier.
 */
export type ProductHeroResolvedProps = {
  // --- Identité produit ---
  productName: string;
  marketingHook: string | null;
  isSimpleProduct: boolean;
  shortDescription: string | null;

  // --- Variant résolu ---
  resolvedHeroVariant: OfferVariant | null;
  resolvedIsAvailable: boolean;
  resolvedSingleVariantSku: string | null;

  // --- Label prix variable ---
  variablePriceLabel: string | null;
  variableSummaryText: string | null;

  // --- Sélection variante (produit variable) ---
  variableVariants: OfferVariant[] | undefined;
  selectedVariableVariant: OfferVariant | null;
  onSelectVariantId: (id: string) => void;

  // --- Galerie résolue ---
  galleryImages: HeroImage[];
  activeImageIndex: number;
  selectedImage: HeroImage | null;
  isImageReady: boolean;
  onSelectImageIndex: (index: number) => void;
  onImageLoaded: (src: string) => void;

  // --- Affichage image ---
  imageFit: "contain" | "cover";

  // --- Slots injectés ---
  cta: React.ReactNode | undefined;
  asideExtra: React.ReactNode | undefined;
};
